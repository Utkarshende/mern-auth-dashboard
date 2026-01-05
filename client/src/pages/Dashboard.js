import { useEffect, useState, useCallback } from 'react';
import API from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data?.message || err.message);
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
      setTasks((prev) => [data, ...prev]);
      setTitle('');
    } catch (err) {
      alert("Error adding task: " + (err.response?.data?.message || "Check Server"));
    }
  };

  const deleteTask = async (id) => {
    if (!id) {
        console.error("Delete failed: No Task ID provided");
        return;
    }

    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      
      console.log(`Task ${id} deleted successfully`);
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Delete failed";
      alert(errorMsg);
      
      if (err.response?.status === 404) fetchTasks();
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
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="bg-red-500 text-white px-4 py-2 rounded transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <input
        className="w-full border p-3 mb-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <form onSubmit={addTask} className="flex gap-4 mb-8">
        <input
          className="flex-grow border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter new task..."
          required
        />
        <button className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700">
          Add Task
        </button>
      </form>

      <div className="grid gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div key={task._id} className="flex justify-between items-center bg-white p-4 rounded shadow border hover:shadow-md transition">
              <span className="text-lg text-gray-800">{task.title}</span>
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500 font-bold px-3 py-1 rounded hover:bg-red-50 hover:text-red-700 transition"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-10 italic">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;