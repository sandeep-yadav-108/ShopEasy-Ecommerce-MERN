import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const login = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/users/login', userData);
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      setSuccess(true);
      toast.success(`Welcome back, ${response.data.user.fullname}! 🎉`);
      return response.data;
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    login,
    loading,
    error,
    success,
    resetState
  };
};

export default useLogin;
