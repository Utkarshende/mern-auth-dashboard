import axios from 'axios';

// Check if we are in production (Netlify) or local
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const { token } = JSON.parse(userInfo);
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Token parsing error", error);
    }
  }
  return req;
});

export default API;