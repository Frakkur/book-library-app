<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router   = useRouter();
const authStore = useAuthStore();

const email      = ref('');
const contrasena = ref('');
const error      = ref('');
const cargando   = ref(false);

async function iniciarSesion() {
  error.value    = '';
  cargando.value = true;

  try {
    await authStore.login(email.value, contrasena.value);
    router.push('/home');
  } catch (err) {
    // Axios envuelve la respuesta del servidor en err.response.data
    error.value = err.response?.data?.error || 'Error de conexión con el servidor';
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="contenedor">
    <div class="caja">
      <h1>Iniciar Sesión</h1>
      <input v-model="email"      type="email"    placeholder="Email" />
      <input v-model="contrasena" type="password" placeholder="Contraseña" />
      <p v-if="error" class="error">{{ error }}</p>
      <button @click="iniciarSesion" :disabled="cargando">
        {{ cargando ? 'Entrando...' : 'Entrar' }}
      </button>
      <p>¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
    </div>
  </div>
</template>

<style scoped>
.contenedor { display:flex; justify-content:center; align-items:center; height:100vh; }
.caja { display:flex; flex-direction:column; gap:12px; width:320px; padding:32px; border:1px solid #ddd; border-radius:8px; }
input { padding:10px; border:1px solid #ccc; border-radius:6px; font-size:14px; }
button { padding:10px; background:#4f46e5; color:white; border:none; border-radius:6px; cursor:pointer; font-size:15px; }
button:disabled { background:#a5b4fc; cursor:not-allowed; }
.error { color:red; font-size:13px; }
</style>