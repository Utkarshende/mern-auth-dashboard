import { useEffect, useState, useCallback } from 'react';
import API from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/tasks', { title });
      setTasks([data, ...tasks]);
      setTitle('');
    } catch (err) { alert("Add failed"); }
  };

  const toggleComplete = async (task) => {
    try {
      const { data } = await API.patch(`/tasks/${task._id}/toggle`);
      setTasks(tasks.map(t => t._id === task._id ? data : t));
    } catch (err) { alert("Toggle failed"); }
  };

  const updateTask = async (id) => {
    try {
      const { data } = await API.put(`/tasks/${id}`, { title: editTitle });
      setTasks(tasks.map(t => t._id === id ? data : t));
      setEditingId(null);
    } catch (err) { alert("Update failed"); }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">TaskPulse Dashboard</h1>
        <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Logout</button>
      </div>

      <input className="w-full border p-3 mb-6 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400" placeholder="🔍 Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <form onSubmit={addTask} className="flex gap-4 mb-8">
        <input className="flex-grow border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task..." required />
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">Add</button>
      </form>

      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="grid gap-3">
          {filteredTasks.map(task => (
            <div key={task._id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border hover:border-blue-200 transition">
              {editingId === task._id ? (
                <div className="flex gap-2 flex-grow mr-4">
                  <input className="border p-2 flex-grow rounded" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus />
                  <button onClick={() => updateTask(task._id)} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500">Cancel</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleComplete(task)}
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                    />
                    <span className={`text-lg transition-all ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => { setEditingId(task._id); setEditTitle(task.title); }} className="text-blue-500 hover:text-blue-700">Edit</button>
                    <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:text-red-700">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
          {filteredTasks.length === 0 && <p className="text-center text-gray-400 mt-10">No tasks found.</p>}
        </div>
      )}
    </div>
  );
};

export default Dashboard;