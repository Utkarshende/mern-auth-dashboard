import { useEffect, useState, useCallback } from 'react';
import API from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); // Initial loading state

  // FETCH TASKS
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false); // Stop loading regardless of success/fail
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ADD TASK
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

  // DELETE TASK
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Delete failed";
      alert(errorMsg);
    }
  };

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">TaskPulse Dashboard</h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-sm"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <input
          className="w-full border p-3 mb-6 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="🔍 Search your tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <form onSubmit={addTask} className="flex gap-4">
          <input
            className="flex-grow border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
          />
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition">
            Add
          </button>
        </form>
      </div>

      {/* LOADING STATE UI */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Waking up server, please wait...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task._id} className="flex justify-between items-center bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition">
                <span className="text-lg text-gray-700">{task.title}</span>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-400 hover:text-red-600 font-semibold p-2 transition"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic">No tasks found. Start by adding one above!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;