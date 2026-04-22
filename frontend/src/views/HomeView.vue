<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router    = useRouter();
const authStore = useAuthStore();

function cerrarSesion() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div class="pagina">

    <header>
      <div class="logo">📚 Biblioteca</div>
      <div class="acciones">
        <span class="saludo">Hola, {{ authStore.nombreUsuario }}</span>
        <button @click="cerrarSesion" class="btn-salir">Cerrar sesión</button>
      </div>
    </header>

    <main>
      <h2 class="bienvenida">¿Qué quieres hacer hoy?</h2>

      <div class="tarjetas">

        <div class="tarjeta" @click="router.push('/catalog')">
          <span class="icono">📖</span>
          <h3>Ver catálogo</h3>
          <p>Explora y busca libros disponibles en la biblioteca.</p>
          <button class="btn-ir">Ir al catálogo →</button>
        </div>

        <div v-if="authStore.esAdmin" class="tarjeta tarjeta-admin" @click="router.push('/admin')">
          <span class="icono">🛠️</span>
          <h3>Panel admin</h3>
          <p>Agrega, edita o elimina libros del catálogo.</p>
          <button class="btn-ir btn-admin">Ir al panel →</button>
        </div>

      </div>
    </main>

  </div>
</template>

<style scoped>
.pagina {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 20px;
  font-family: system-ui, sans-serif;
}

/* Header */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}
.logo { font-size: 1.4rem; font-weight: 700; color: #1e1b4b; }
.acciones { display: flex; align-items: center; gap: 12px; }
.saludo { font-size: 14px; color: #6b7280; }
.btn-salir {
  padding: 7px 14px;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

/* Main */
.bienvenida {
  text-align: center;
  font-size: 1.3rem;
  color: #374151;
  margin-bottom: 32px;
}

.tarjetas {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.tarjeta {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px 28px;
  width: 260px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,.07);
  transition: box-shadow .2s, transform .15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.tarjeta:hover {
  box-shadow: 0 6px 18px rgba(0,0,0,.12);
  transform: translateY(-3px);
}
.tarjeta-admin { border-color: #c7d2fe; background: #f5f3ff; }

.icono { font-size: 2.4rem; }
.tarjeta h3 { margin: 0; font-size: 1.1rem; color: #111827; }
.tarjeta p  { margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5; }

.btn-ir {
  margin-top: 8px;
  padding: 9px 20px;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}
.btn-admin { background: #7c3aed; }
</style>