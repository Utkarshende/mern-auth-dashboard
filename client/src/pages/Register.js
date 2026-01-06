import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', formData);
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Create Account</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-sm font-semibold">Full Name</label>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your Name"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-sm font-semibold">Email Address</label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="email@example.com"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-sm font-semibold">Password</label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${
            loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <p className="mt-6 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-green-500 hover:underline font-semibold">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;