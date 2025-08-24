import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/users/signup', userData);
      
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      setSuccess(true);
      toast.success('Account created successfully! Welcome aboard! 🎉');
      return response.data;
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
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
    signup,
    loading,
    error,
    success,
    resetState
  };
};

export default useSignup;
