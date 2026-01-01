import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert("Registration failed. Email might already be in use.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input className="w-full border p-2 mb-3" placeholder="Username" onChange={(e)=>setFormData({...formData, username: e.target.value})} required />
        <input className="w-full border p-2 mb-3" type="email" placeholder="Email" onChange={(e)=>setFormData({...formData, email: e.target.value})} required />
        <input className="w-full border p-2 mb-4" type="password" placeholder="Password" onChange={(e)=>setFormData({...formData, password: e.target.value})} required />
        <button className="w-full bg-green-600 text-white p-2 rounded mb-2">Sign Up</button>
        <p className="text-sm">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
      </form>
    </div>
  );
};
export default Register;