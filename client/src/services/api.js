import axios from 'axios';

const API = axios.create({
  // Use the environment variable for production, fallback to localhost for dev
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Middleware to attach the JWT token to every request
API.interceptors.request.use((req) => {
  const user = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;
    
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;