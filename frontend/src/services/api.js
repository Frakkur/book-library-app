import axios from 'axios';

// 1. FORZAMOS 127.0.0.1 en lugar de localhost para evitar el CONNECTION_REFUSED
const api = axios.create({
  baseURL: 'http://127.0.0.1:5001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  // 2. IMPORTANTE: Permitir el intercambio de cookies/sesión
  withCredentials: true 
});

// ─── INTERCEPTOR DE REQUEST ──────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── INTERCEPTOR DE RESPONSE ─────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si la conexión falla totalmente (error.request existe pero no hay response)
    if (!error.response) {
      console.error("❌ No hay respuesta del servidor. ¿Está encendido el backend?");
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      // Solo redirigir si no estamos ya en el login para evitar bucles
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;