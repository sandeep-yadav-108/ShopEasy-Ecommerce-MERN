import axios from 'axios';
import toast from 'react-hot-toast';

// Simple request throttling - prevent rapid identical requests
const requestLog = new Map();
const REQUEST_THROTTLE_MS = 1000; // Minimum time between identical requests (1 second)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    // Temporarily disable throttling to test the useCallback fixes
    // TODO: Re-enable with better logic if needed
    /*
    // Create a more specific request key that includes method, url, and params
    const requestKey = `${config.method}_${config.url}_${JSON.stringify(config.params || {})}_${JSON.stringify(config.data || {})}`;
    const lastRequestTime = requestLog.get(requestKey);
    const now = Date.now();
    
    if (lastRequestTime && (now - lastRequestTime) < REQUEST_THROTTLE_MS) {
      console.warn(`🚫 Request throttled: ${config.method}_${config.url}`);
      return Promise.reject(new Error('Request throttled'));
    }
    
    requestLog.set(requestKey, now);
    */
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't show toast for throttled requests
    if (error.message === 'Request throttled') {
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401) {
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.status >= 400) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Something went wrong';
      toast.error(errorMessage);
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    } else {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;
