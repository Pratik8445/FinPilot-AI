import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  timeout: 30000,
});

// Request interceptor — attach Bearer token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
// Skip auto-redirect for auth endpoints (login/register) so they can
// show the real error message to the user instead of being swallowed.
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register'];

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => url.includes(ep));

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('access_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
