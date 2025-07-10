import axios from 'axios';

// Create axios instance with custom config
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
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

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with a status code outside of 2xx
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        // Optionally redirect to login page
      }
      return Promise.reject(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject('No response from server. Please try again.');
    } else {
      // Error in request configuration
      return Promise.reject('Request failed. Please try again.');
    }
  }
);

export default instance;