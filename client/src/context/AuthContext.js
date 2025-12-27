import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

/**
 * Authentication Context
 * Manages user authentication state globally
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * User Signup
   */
  const signup = async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/signup', { name, email, password });
      
      // Save user and token
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      setUser(data);
      
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
      };
    }
  };

  /**
   * User/Admin Login
   */
  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      // Save user and token
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      setUser(data);
      
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  /**
   * Update user data (e.g., after earning points)
   */
  const updateUser = (updatedData) => {
    // Preserve existing user data, especially role and token
    const updatedUser = { 
      ...user, 
      ...updatedData,
      role: user?.role || updatedData.role, // Preserve role
      token: user?.token || updatedData.token // Preserve token
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  /**
   * Refresh user data from server (to get latest points)
   */
  const refreshUser = async () => {
    try {
      const { data } = await API.get('/auth/me');
      const updatedUser = { 
        ...user, 
        points: data.points 
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
