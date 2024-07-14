import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const PrivateRoute = ({ component: Component }) => {
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Hoặc bất kỳ component loading nào bạn muốn
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Hoặc bất kỳ component error nào bạn muốn
  }

  if (!user) {
    // Lưu URL gốc trong localStorage
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default PrivateRoute;
