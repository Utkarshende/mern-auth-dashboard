import { useEffect, useState, useCallback } from 'react';
import API from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // FETCH ALL TASKS
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
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
      setTasks([data, ...tasks]);
      setTitle('');
    } catch (err) {
      alert("Failed to add task");
    }
  };

  // TOGGLE CHECKBOX
  const toggleComplete = async (task) => {
    try {
      const { data } = await API.patch(`/tasks/${task._id}/toggle`);
      setTasks(tasks.map(t => t._id === task._id ? data : t));
    } catch (err) {
      alert("Update failed");
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      alert("Delete failed. Check console.");
    }
  };

  // START EDITING
  const handleEditClick = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  // SAVE EDIT
  const updateTask = async (id) => {
    try {
      const { data } = await API.put(`/tasks/${id}`, { title: editTitle });
      setTasks(tasks.map(t => t._id === id ? data : t));
      setEditingId(null);
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">TaskPulse</h1>
        <button 
          onClick={() => { localStorage.clear(); window.location.href='/login'; }}
          className="bg-red-500 text-white px-4 py-2 rounded font-medium hover:bg-red-600 transition"
        >Logout</button>
      </div>

      {/* ADD TASK FORM */}
      <form onSubmit={addTask} className="flex gap-4 mb-8">
        <input 
          className="flex-grow border p-3 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          required
        />
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition">
          Add
        </button>
      </form>

      {/* TASK LIST */}
      {loading ? (
        <div className="text-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></div>
      ) : (
        <div className="grid gap-3">
          {tasks.map(task => (
            <div key={task._id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border hover:border-blue-300 transition">
              
              {editingId === task._id ? (
                /* EDIT MODE UI */
                <div className="flex gap-2 flex-grow mr-4">
                  <input 
                    className="border p-2 flex-grow rounded outline-none focus:ring-2 focus:ring-blue-400" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => updateTask(task._id)} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500 px-2">Cancel</button>
                </div>
              ) : (
                /* NORMAL VIEW MODE UI */
                <>
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleComplete(task)}
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                    />
                    <span className={`text-lg transition-all ${task.completed ? 'line-through text-gray-400 italic' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                  </div>
                  
                  {/* THESE ARE THE BUTTONS YOU WERE MISSING */}
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleEditClick(task)} 
                      className="text-blue-500 font-semibold hover:text-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteTask(task._id)} 
                      className="text-red-400 font-semibold hover:text-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {tasks.length === 0 && <p className="text-center text-gray-400 mt-10">No tasks yet. Get started!</p>}
        </div>
      )}
    </div>
  );
};

export default Dashboard;