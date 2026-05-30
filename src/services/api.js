import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token into requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage and trigger page reload to AuthContext redirect
      localStorage.removeItem('access_token');
      // Dispatch custom event to notify AuthContext of logout
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    
    let message = error.response?.data?.error;
    if (!message) {
      if (error.response?.data?.message) {
        message = error.response?.data?.message || 'Something went wrong';
      }
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
