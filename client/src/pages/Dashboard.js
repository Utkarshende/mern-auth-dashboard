import { useEffect, useState, useCallback } from 'react';
import API from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/tasks');
      console.log("SUCCESS: Tasks loaded from server:", data);
      setTasks(data);
    } catch (err) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const { data } = await API.post('/tasks', { title });
      setTasks([data, ...tasks]);
      setTitle('');
    } catch (err) {
      alert("Failed to add task");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">TaskPulse</h1>
        <button 
          onClick={() => { localStorage.clear(); window.location.href='/login'; }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >Logout</button>
      </div>

      <form onSubmit={addTask} className="flex gap-4 mb-8">
        <input 
          className="flex-grow border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Add</button>
      </form>

      {loading ? (
        <div className="text-center py-10">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
           <p className="mt-4 text-gray-500">Fetching your data...</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="grid gap-3">
          {tasks.map(task => (
            <div key={task._id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between">
              <span className={task.completed ? 'line-through text-gray-400' : ''}>{task.title}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 italic">No tasks yet. Create one above!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;