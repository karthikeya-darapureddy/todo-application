import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ── Request Interceptor: attach token from localStorage ──────────────
api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('taskflow_auth');
      if (stored) {
        const { state } = JSON.parse(stored);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch {}
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: handle 401 globally ────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear session
      try {
        localStorage.removeItem('taskflow_auth');
        localStorage.removeItem('taskflow_tasks');
      } catch {}
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
