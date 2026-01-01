import { useEffect, useState } from 'react';
import API from '../api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await API.get('/tasks');
    setTasks(data);
  };

  const addTask = async () => {
    await API.post('/tasks', { title: newTask });
    setNewTask('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  // The Search Logic
  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl">My Tasks</h1>
        <button onClick={() => { localStorage.clear(); window.location.href='/'; }} className="text-red-500">Logout</button>
      </div>

      <input className="border p-2 w-full mb-4" placeholder="Search tasks..." onChange={(e) => setSearch(e.target.value)} />
      
      <div className="flex mb-4">
        <input className="border p-2 flex-grow" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New task title..." />
        <button onClick={addTask} className="bg-green-500 text-white p-2 ml-2">Add</button>
      </div>

      <ul>
        {filteredTasks.map(task => (
          <li key={task._id} className="flex justify-between border-b p-2">
            {task.title}
            <button onClick={() => deleteTask(task._id)} className="text-red-400">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;