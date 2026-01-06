import axios from 'axios';

const API = axios.create({
  // prioritize the Netlify environment variable, otherwise use local
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Interceptor to attach the JWT token to every request
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const { token } = JSON.parse(userInfo);
      if (token) {
        // Standard Bearer token format
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Token parsing error", error);
    }
  }
  return req;
});

export default API;