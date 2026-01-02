import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach JWT to every request
API.interceptors.request.use((req) => {
  const data = localStorage.getItem('userInfo');
  
  if (data) {
    const userInfo = JSON.parse(data);
    // Ensure you are accessing .token (or whatever your backend returns)
    if (userInfo.token) {
      req.headers.Authorization = `Bearer ${userInfo.token}`;
    }
  }
  return req;
});

export default API;