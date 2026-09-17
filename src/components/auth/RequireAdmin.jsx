import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const RequireAdmin = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuthContext();

  if (loading) return null;

  return isAuthenticated && isAdmin ? children : <Navigate to="/login" replace />;
};

export default RequireAdmin;
