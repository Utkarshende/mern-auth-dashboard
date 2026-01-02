import axios from 'axios';

const API = axios.create({
  // Use your Render URL for production, localhost for development
  baseURL: 'https://mern-auth-dashboard-backend.onrender.com/api', 
});

// This interceptor automatically attaches the token to every request
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    // Standard JWT Format: "Bearer <token>"
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;