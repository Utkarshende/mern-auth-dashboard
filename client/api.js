import axios from 'axios';

const API = axios.create({
  // Use your Render URL here to stop the localhost error
  baseURL: 'https://mern-auth-dashboard-backend.onrender.com/api',
});

// Add a request interceptor to attach the token
API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('userInfo');
  
  if (profile) {
    const user = JSON.parse(profile);
    // Ensure "token" matches the key name used in your Backend response
    if (user.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return req;
});

export default API;