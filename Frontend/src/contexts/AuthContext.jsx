import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../endpoints/Api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      setUser(null);
      console.log('Failed to load user profile:', error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      await authAPI.login(credentials); 
      await loadUser(); 
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data || { detail: 'Login failed' }
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      await authAPI.register(userData);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data || { detail: 'Registration failed' }
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
      setLoading(false);
      window.location.href = '/login';
    }
  };

  const value = { 
    user, 
    login, 
    register, 
    logout, 
    loading,
    isAuthenticated: !!user 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};