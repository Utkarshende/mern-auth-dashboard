import axios from 'axios';

const API = axios.create({
  baseURL:process.env.REACT_APP_API_URL || 'http://localhost:5000/api ',
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