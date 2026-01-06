import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');

  // If userInfo exists, render the Dashboard. If not, redirect to Login.
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;