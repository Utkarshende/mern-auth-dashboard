import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/tasks', config);
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  }, [token]); 

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); 

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', { title }, config);
      setTitle('');
      fetchTasks(); 
    } catch (err) {
      alert("Error adding task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, config);
      fetchTasks(); 
    } catch (err) {
      alert("Error deleting task");
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }} 
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <input 
        className="w-full border p-3 mb-6" 
        placeholder="🔍 Search tasks..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)} 
      />

      <form onSubmit={addTask} className="flex gap-4 mb-8">
        <input 
          className="flex-grow border p-3" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Enter new task..." 
          required 
        />
        <button className="bg-green-600 text-white px-6 py-3 rounded">Add Task</button>
      </form>

      <div className="grid gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div key={task._id} className="flex justify-between items-center bg-white p-4 rounded shadow border">
              <span className="text-lg">{task.title}</span>
              <button onClick={() => deleteTask(task._id)} className="text-red-500 font-bold hover:text-red-700">
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;