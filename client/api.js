import axios from 'axios';

const API = axios.create({
  baseURL: 'https://mern-auth-dashboard-backend.onrender.com/api',
});

API.interceptors.request.use((req) => {
  const data = localStorage.getItem('userInfo');
  if (data) {
    const userInfo = JSON.parse(data);
    if (userInfo.token) {
      req.headers.Authorization = `Bearer ${userInfo.token}`;
    }
  }
  return req;
});

export default API;