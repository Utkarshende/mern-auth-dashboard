import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from './../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Login to TaskPulse</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <input
          className="w-full p-2 mb-4 border rounded"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 mb-6 border rounded"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </button>
        
        <p className="mt-4 text-center text-sm">
          New user? <Link to="/register" className="text-indigo-600 underline">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;