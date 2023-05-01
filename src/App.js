import './App.css';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

const initialForm = {
  title: '',
  description: '',
  details: ''
};

const apiUrl = `https://gqlzgean1g.execute-api.us-east-1.amazonaws.com/PROD`;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [newTask, setNewTask] = useState(initialForm);
  
  const fetchTasks = async () => {
    setIsLoading(true);
    console.info(`fetching new tasks...`, { apiUrl })
    const resp = await fetch(apiUrl)
    const { data } = await resp.json();
    setTasks(data);
    setIsLoading(false);
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
    setIsLoading(true);
    await fetch(apiUrl, {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask),
    })
    setActiveTask(null);
    await fetchTasks();
    setNewTask(initialForm);
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
      {/* Show Task Detail */}
      {activeTask !== null && activeTask > -1 && (
        <div className="task-detail">
          <h2>{`Task Title: ${tasks[activeTask].title}`}</h2>
          <p>{`Created At: ${format(new Date(tasks[activeTask].lastUpdated), 'MM/dd/yyyy')}`}</p>
          <p>{`Description: ${tasks[activeTask].description}`}</p>
          <p>{`Details: ${tasks[activeTask].details}`}</p>
          <button onClick={(e) => setActiveTask(null)}>All Tasks</button>
        </div>
      )}
      {/* Show New Task Form */}
      {activeTask === -1 && (
        <form>
          <label>Title:</label><input type="text" value={newTask.title} onChange={(e) => handleInputChange(e, 'title')} />
          <label>Description:</label><textarea type="text" value={newTask.description} onChange={(e) => handleInputChange(e, 'description')} />
          <label>Details:</label><textarea type="text" value={newTask.details} onChange={(e) => handleInputChange(e, 'details')} />
          <div className='buttons'>
            <button onClick={(e) => setActiveTask(null)}>Cancel</button>
            <button onClick={handleCreateTask}>{isLoading ? 'Loading...' : 'Save'}</button>
          </div>
        </form>
      )}
      {/* Show Task List */}
      {activeTask === null && (
        <ul>
        <li><button onClick={addTask}>New Task</button></li>
          {isLoading && <p>Loading...</p>}
          {tasks
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map(renderTasks)
          }
      </ul>
      )}
    </div>
  );
}

export default App;
