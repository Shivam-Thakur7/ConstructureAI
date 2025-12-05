import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setError(null);
      const authUrl = await authService.getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError(err.message || 'Failed to initiate login');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('auth_token');
    } catch (err) {
      console.error('Logout failed:', err);
      // Clear local state anyway
      setUser(null);
      localStorage.removeItem('auth_token');
    }
  };

  const handleAuthSuccess = async (token) => {
    try {
      console.log('AuthContext: handleAuthSuccess called');
      console.log('AuthContext: Saving token to localStorage');
      localStorage.setItem('auth_token', token);
      
      console.log('AuthContext: Fetching user data');
      const userData = await authService.getCurrentUser();
      console.log('AuthContext: User data received:', userData);
      
      setUser(userData);
      console.log('AuthContext: User state updated');
    } catch (err) {
      console.error('AuthContext: handleAuthSuccess error:', err);
      setError(err.message || 'Failed to get user data');
      throw err;
    }
  };

  const checkPermissions = async () => {
    try {
      return await authService.checkPermissions();
    } catch (err) {
      console.error('Permission check failed:', err);
      return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    handleAuthSuccess,
    checkPermissions,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
