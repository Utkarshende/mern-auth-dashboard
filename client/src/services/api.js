import axios from 'axios';

const renderURL = 'https://mern-auth-dashboard-backend.onrender.com/api';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || renderURL,
});

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('userInfo');
  if (profile) {
    const user = JSON.parse(profile);
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;