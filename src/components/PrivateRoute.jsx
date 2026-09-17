import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 🔐 If user not signed in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role || 'user';

  // ✅ Check role against allowedRoles
  if (!allowedRoles || allowedRoles.includes(role)) {
    return children;
  }

  // ❌ Role not allowed → redirect to home
  return <Navigate to="/" replace />;
};

export default PrivateRoute;
