import axios from 'axios';

const fallbackBaseURL = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || fallbackBaseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartQueueToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
