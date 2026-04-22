<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router    = useRouter();
const authStore = useAuthStore();

const usuarioActual = ref(authStore.usuario || { nombre: 'Invitado' });

function cerrarSesion() {
  authStore.logout(); // limpia token + usuario del store Y del localStorage
  router.push('/login');
}
</script>

<template>
  <div class="pagina">
    <header>
      <h1>📚 Biblioteca</h1>
      <div>
        <span>Hola, {{ usuarioActual.nombre }}</span>
        <button @click="cerrarSesion">Cerrar sesión</button>
      </div>
    </header>
  </div>
</template>

<style scoped>
.pagina {
  max-width: 700px;
  margin: 40px auto;
  padding: 0 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

button {
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>