import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, saveAuthData, clearAuthData, getStoredUser } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem('civix_token'));
  const [loading, setLoading] = useState(true);

  // Validate token / refresh user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const data = await authAPI.getMe();
          if (data.user) {
            setUser(data.user);
            saveAuthData(token, data.user);
          }
        } catch (error) {
          console.error('Session validation error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      saveAuthData(data.token, data.user);
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await authAPI.signup(userData);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      saveAuthData(data.token, data.user);
    }
    return data;
  };

  const sendOTP = async (email, type = 'signup') => {
    return await authAPI.sendOTP({ email, type });
  };

  const verifyOTP = async (email, otp, type = 'signup') => {
    return await authAPI.verifyOTP({ email, otp, type });
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore logout errors
    } finally {
      setToken(null);
      setUser(null);
      clearAuthData();
    }
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    if (token) {
      saveAuthData(token, newUserData);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    login,
    signup,
    sendOTP,
    verifyOTP,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
