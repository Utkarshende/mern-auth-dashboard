import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/auth/register', formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      window.location.reload(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Create Account</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <input
          className="w-full p-2 mb-4 border rounded"
          type="text"
          placeholder="Username"
          required
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          className="w-full p-2 mb-4 border rounded"
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          className="w-full p-2 mb-6 border rounded"
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        
        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
        
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-indigo-600 underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;