import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', formData);
      
      // Save user data and token to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Force a full redirect to clear state and trigger PrivateRoute check
      window.location.href = '/dashboard';
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Credentials");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Login</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-sm font-semibold">Email Address</label>
          <input
            type="email"
            name="email"
            autoComplete="username"
            placeholder="email@example.com"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-sm font-semibold">Password</label>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Authenticating...' : 'Login'}
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:underline font-semibold">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login; 