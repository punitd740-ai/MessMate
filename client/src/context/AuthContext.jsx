import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);

  // Initialize and verify session on load
  const loadUser = async () => {
    const savedToken = getAuthToken();
    if (!savedToken) {
      setLoading(false);
      return;
    }

    const res = await api.get('/auth/me');
    if (res.success && res.user) {
      setUser(res.user);
    } else {
      setAuthToken(null);
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.token) {
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.success && res.token) {
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  // One-click quick login for testing all 3 roles instantly
  const quickLogin = async (role) => {
    const credentials = {
      student: { email: 'aarav@student.com', password: 'student123' },
      mess_owner: { email: 'rajesh@annapurnamess.com', password: 'mess123' },
      super_admin: { email: 'admin@messmate.com', password: 'admin123' },
    };

    const creds = credentials[role];
    if (!creds) return { success: false, message: 'Invalid role' };

    return await login(creds.email, creds.password);
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await api.get('/auth/me');
    if (res.success && res.user) {
      setUser(res.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        loading,
        login,
        register,
        quickLogin,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
