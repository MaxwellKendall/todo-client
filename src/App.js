import './App.css';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

const initialForm = {
  title: '',
  description: '',
  details: ''
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [newTask, setNewTask] = useState(initialForm);
  
  const fetchTasks = async () => {
    console.info(`fetching new tasks...`)
    const resp = await fetch(
      process.env.REACT_APP_API_URL
    )
    const { data } = await resp.json();
    setTasks(data);
  }

  useEffect(() => {
    // call on initial render
    fetchTasks();
  }, [])

  const renderTasks = ({
    title,
    description,
    lastUpdated
  },
  i) => (
    <li>
      <h2>{title}</h2>
      <p>{format(new Date(lastUpdated), 'MM/dd/yyyy')}</p>
      <p>{description}</p>
      <button onClick={(e) => setActiveTask(i)}>View Details</button>
    </li>
  )

  const handleCreateTask = async (e) => {
    e.preventDefault();
    await fetch(process.env.REACT_APP_API_URL, {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask),
    })
    await fetchTasks();
    setActiveTask(null);
  }

  const addTask = (e) => {
    e.preventDefault();
    setActiveTask(-1);
  }

  const handleInputChange = (e, key) => {
    setNewTask({
      ...newTask,
      [key]: e.target.value,
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task List</h1>
      </header>
      {activeTask !== null && activeTask > -1 && (
        <div className="task-detail">
          <h2>{`Task Title: ${tasks[activeTask].title}`}</h2>
          <p>{`Created At: ${format(new Date(tasks[activeTask].lastUpdated), 'MM/dd/yyyy')}`}</p>
          <p>{`Description: ${tasks[activeTask].description}`}</p>
          <p>{`Details: ${tasks[activeTask].details}`}</p>
          <button onClick={(e) => setActiveTask(null)}>All Tasks</button>
        </div>
      )}
      {activeTask === -1 && (
        <form>
          <label>Title:</label><input type="text" value={newTask.title} onChange={(e) => handleInputChange(e, 'title')} />
          <label>Description:</label><textarea type="text" value={newTask.description} onChange={(e) => handleInputChange(e, 'description')} />
          <label>Details:</label><textarea type="text" value={newTask.details} onChange={(e) => handleInputChange(e, 'details')} />
          <div className='buttons'>
            <button onClick={(e) => setActiveTask(null)}>Cancel</button>
            <button onClick={handleCreateTask}>Save</button>
          </div>
        </form>
      )}
      {activeTask === null && (
        <ul>
        <li><button onClick={addTask}>New Task</button></li>
        {tasks.map(renderTasks)}
      </ul>
      )}
    </div>
  );
}

export default App;
