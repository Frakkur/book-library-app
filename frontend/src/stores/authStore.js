import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  // ─── STATE ──────────────────────────────────────────────────────────────────
  // Persistimos el usuario/token desde localStorage al iniciar la app
  const token = ref(localStorage.getItem('token') || null);
  const usuario = ref(
    JSON.parse(localStorage.getItem('usuario') || 'null')
  );

  // ─── GETTERS ────────────────────────────────────────────────────────────────
  const estaAutenticado = computed(() => !!token.value);
  const esAdmin = computed(() => usuario.value?.rol === 'admin');
  const nombreUsuario = computed(() => usuario.value?.nombre || '');

  // ─── ACTIONS ────────────────────────────────────────────────────────────────

  /**
   * Inicia sesión: llama al backend, guarda token + usuario en
   * el store (reactivo) y en localStorage (persistencia).
   */
  async function login(email, contrasena) {
    const { data } = await api.post('/auth/login', { email, contrasena });

    _guardarSesion(data.token, data.usuario);
    return data;
  }

  /**
   * Registra un nuevo usuario y lo deja con sesión iniciada.
   */
  async function registro(nombre, email, contrasena) {
    const { data } = await api.post('/auth/registro', {
      nombre,
      email,
      contrasena,
    });

    _guardarSesion(data.token, data.usuario);
    return data;
  }

  /**
   * Cierra sesión: limpia store + localStorage.
   */
  function logout() {
    token.value = null;
    usuario.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  // ─── PRIVATE HELPER ─────────────────────────────────────────────────────────
  function _guardarSesion(nuevoToken, nuevoUsuario) {
    token.value = nuevoToken;
    usuario.value = nuevoUsuario;
    localStorage.setItem('token', nuevoToken);
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
  }

  return {
    // state
    token,
    usuario,
    // getters
    estaAutenticado,
    esAdmin,
    nombreUsuario,
    // actions
    login,
    registro,
    logout,
  };
});
