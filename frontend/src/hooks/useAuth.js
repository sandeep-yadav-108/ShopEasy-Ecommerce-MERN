import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('useAuth - Logout called, clearing state');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Use functional updates to ensure state changes
    setUser(() => null);
    setIsAuthenticated(() => false);
    
    // Double-check after a small delay
    setTimeout(() => {
      setUser(() => null);
      setIsAuthenticated(() => false);
      console.log('useAuth - Logout completed, state should be cleared');
    }, 50);
    
    toast.success('Logged out successfully!');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return {
    user,
    loading,
    isAuthenticated,
    logout,
    updateUser,
    checkAuthStatus
  };
};

export default useAuth;
