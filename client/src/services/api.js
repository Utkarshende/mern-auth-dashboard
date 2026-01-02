import axios from 'axios';

const API = axios.create({
  // This will use your Vercel Env Var, or default to Render
  baseURL: process.env.REACT_APP_API_URL || 'https://mern-auth-dashboard-backend.onrender.com/api',
});

// Attach Token to every request automatically
API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('userInfo');
  if (profile) {
    const user = JSON.parse(profile);
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;