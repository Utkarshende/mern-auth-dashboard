import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // Fix: Added this import
import Dashboard from './pages/Dashboard';

// Helper to check if user is logged in
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route 
          path="/dashboard" 
          element={<PrivateRoute><Dashboard /></PrivateRoute>} 
        />
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;