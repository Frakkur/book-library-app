import axios from 'axios';

// Instancia central de Axios apuntando al backend
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── INTERCEPTOR DE REQUEST ──────────────────────────────────────────────────
// Antes de cada petición, adjunta el JWT si existe en localStorage
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
// Si el servidor devuelve 401 (token expirado o inválido), limpia la sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      // Redirige al login sin importar en qué ruta esté el usuario
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
