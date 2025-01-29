import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);

  if (!auth.isAuthenticated || auth.status !== 'succeeded') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;