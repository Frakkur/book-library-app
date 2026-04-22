<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router    = useRouter();
const authStore = useAuthStore();

const nombre     = ref('');
const email      = ref('');
const contrasena = ref('');
const error      = ref('');
const exito      = ref('');
const cargando   = ref(false);

// Validaciones reactivas
const nombreValido    = computed(() => nombre.value.length >= 1);
const emailValido     = computed(() => email.value.includes('@') && email.value.includes('.'));
const contrasenaValida = computed(() => contrasena.value.length >= 6);
const formularioValido = computed(() => nombreValido.value && emailValido.value && contrasenaValida.value);

const erroresValidacion = computed(() => {
  const e = {};
  if (nombre.value     && !nombreValido.value)     e.nombre     = 'El nombre es requerido';
  if (email.value      && !emailValido.value)      e.email      = 'Email inválido (debe incluir @)';
  if (contrasena.value && !contrasenaValida.value) e.contrasena = `Mínimo 6 caracteres (tienes ${contrasena.value.length})`;
  return e;
});

async function registrar() {
  if (!formularioValido.value) {
    error.value = 'Por favor completa todos los campos correctamente';
    return;
  }

  error.value  = '';
  exito.value  = '';
  cargando.value = true;

  try {
    await authStore.registro(nombre.value, email.value, contrasena.value);
    exito.value = 'Usuario registrado. Redirigiendo...';
    setTimeout(() => router.push('/home'), 1500);
  } catch (err) {
    error.value = err.response?.data?.error || 'Error de conexión con el servidor';
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="contenedor">
    <div class="caja">
      <h1>Crear cuenta</h1>
      
      <div class="campo">
        <input 
          v-model="nombre" 
          type="text" 
          placeholder="Nombre"
        />
        <p v-if="erroresValidacion.nombre" class="error-campo">{{ erroresValidacion.nombre }}</p>
      </div>

      <div class="campo">
        <input 
          v-model="email" 
          type="email" 
          placeholder="Email (ej: juan@ejemplo.com)"
        />
        <p v-if="erroresValidacion.email" class="error-campo">{{ erroresValidacion.email }}</p>
      </div>

      <div class="campo">
        <input 
          v-model="contrasena" 
          type="password" 
          placeholder="Contraseña (mínimo 6 caracteres)"
        />
        <p v-if="erroresValidacion.contrasena" class="error-campo">{{ erroresValidacion.contrasena }}</p>
        <p v-if="contrasena" class="info-contrasena">{{ contrasena.length }}/6 caracteres</p>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="exito" class="exito">{{ exito }}</p>
      
      <button 
        @click="registrar" 
        :disabled="!formularioValido || cargando"
        :class="{ deshabilitado: !formularioValido || cargando }"
      >
        {{ cargando ? 'Registrando...' : 'Registrarse' }}
      </button>

      <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
    </div>
  </div>
</template>

<style scoped>
.contenedor { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  height: 100vh; 
}

.caja { 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
  width: 320px; 
  padding: 32px; 
  border: 1px solid #ddd; 
  border-radius: 8px; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

input { 
  padding: 10px; 
  border: 1px solid #ccc; 
  border-radius: 6px; 
  font-size: 14px; 
}

input:focus {
  border-color: #4f46e5;
  outline: none;
}

button { 
  padding: 10px; 
  background: #4f46e5; 
  color: white; 
  border: none; 
  border-radius: 6px; 
  cursor: pointer; 
  font-size: 15px;
  font-weight: 600;
  transition: background 0.3s;
}

button:hover:not(:disabled) { 
  background: #4338ca;
}

button.deshabilitado {
  background: #ccc;
  cursor: not-allowed;
}

.error { 
  color: #dc2626; 
  font-size: 13px;
  padding: 8px;
  background: #fee2e2;
  border-radius: 4px;
}

.error-campo {
  color: #dc2626;
  font-size: 12px;
  margin-top: -2px;
}

.info-contrasena {
  font-size: 12px;
  color: #666;
}

.exito { 
  color: #16a34a; 
  font-size: 13px;
  padding: 8px;
  background: #dcfce7;
  border-radius: 4px;
}

a {
  color: #4f46e5;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>