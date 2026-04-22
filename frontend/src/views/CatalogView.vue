<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import api from '../services/api';

// 1. IMPORTACIÓN DEL COMPONENTE DE FAVORITOS
import FavoriteButton from '../components/FavoriteButton.vue'; 

const authStore = useAuthStore();
const router = useRouter();

const libros = ref([]);
const cargando = ref(false);
const errorMsg = ref('');

const filtrTitulo = ref('');
const filtrAutor = ref('');

async function cargarLibros() {
  cargando.value = true;
  errorMsg.value = '';
  try {
    const params = {};
    if (filtrTitulo.value.trim()) params.titulo = filtrTitulo.value.trim();
    if (filtrAutor.value.trim()) params.autor = filtrAutor.value.trim();

    const { data } = await api.get('/libros', { params });
    libros.value = data;
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'No se pudo cargar el catálogo.';
  } finally {
    cargando.value = false;
  }
}

function limpiarFiltros() {
  filtrTitulo.value = '';
  filtrAutor.value = '';
  cargarLibros();
}

function cerrarSesion() {
  authStore.logout();
  router.push({ name: 'login' });
}

onMounted(cargarLibros);
</script>

<template>
  <div class="pagina">
    <header class="cabecera">
      <h1>📚 Catálogo de libros</h1>
      <div class="acciones-cabecera">
        <span class="bienvenida">Hola, {{ authStore.nombreUsuario }}</span>
        <router-link v-if="authStore.esAdmin" to="/admin" class="btn-admin">
          Panel admin
        </router-link>
        <router-link to="/favorites" class="btn-favoritos-link">❤️ Mis Favoritos</router-link>
        <button @click="cerrarSesion" class="btn-salir">Cerrar sesión</button>
      </div>
    </header>

    <section class="filtros">
      <input v-model="filtrTitulo" @keyup.enter="cargarLibros" placeholder="Buscar por título…" />
      <input v-model="filtrAutor" @keyup.enter="cargarLibros" placeholder="Buscar por autor…" />
      <button @click="cargarLibros" class="btn-buscar">Buscar</button>
      <button @click="limpiarFiltros" class="btn-limpiar">Limpiar</button>
    </section>

    <p v-if="cargando" class="estado">Cargando catálogo…</p>
    <p v-else-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p v-else-if="libros.length === 0" class="estado">No se encontraron libros.</p>

    <div v-else class="grilla">
      <article v-for="libro in libros" :key="libro.id" class="tarjeta">
        <div class="portada">
          <img
            v-if="libro.imagen_url"
            :src="libro.imagen_url"
            :alt="libro.titulo"
            @error="(e) => e.target.style.display = 'none'"
          />
          <div v-else class="portada-placeholder">📖</div>
        </div>

        <div class="info">
          <h3 class="titulo">{{ libro.titulo }}</h3>
          <p class="autor">{{ libro.autor }}</p>
          <p v-if="libro.genero" class="genero">{{ libro.genero }}</p>
          <p v-if="libro.anio_publicacion" class="anio">{{ libro.anio_publicacion }}</p>
          <p class="paginas">{{ libro.total_paginas }} páginas</p>
          <p v-if="libro.descripcion" class="descripcion">{{ libro.descripcion }}</p>

          <div class="acciones-tarjeta">
            <FavoriteButton :bookId="String(libro.id)" />
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.pagina { max-width: 1100px; margin: 0 auto; padding: 24px 20px; font-family: system-ui, sans-serif; }
.cabecera { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
.cabecera h1 { margin: 0; font-size: 1.6rem; color: #1e1b4b; }
.acciones-cabecera { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.bienvenida { font-size: 14px; color: #6b7280; }

.btn-admin { padding: 7px 14px; background: #4f46e5; color: #fff; border-radius: 6px; text-decoration: none; font-size: 13px; }
.btn-favoritos-link { padding: 7px 14px; background: #fff; color: #ef4444; border: 1px solid #ef4444; border-radius: 6px; text-decoration: none; font-size: 13px; transition: all 0.2s; }
.btn-favoritos-link:hover { background: #ef4444; color: #fff; }
.btn-salir { padding: 7px 14px; background: #ef4444; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }

.filtros { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; }
.filtros input { flex: 1; min-width: 180px; padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }
.btn-buscar { padding: 9px 18px; background: #4f46e5; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
.btn-limpiar { padding: 9px 18px; background: #9ca3af; color: #fff; border: none; border-radius: 6px; cursor: pointer; }

.grilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }

.tarjeta {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,.07);
  transition: box-shadow .2s;
}
.tarjeta:hover { box-shadow: 0 4px 12px rgba(0,0,0,.12); }
.portada { height: 180px; overflow: hidden; background: #f3f4f6; display: flex; align-items: center; justify-content: center; }
.portada img { width: 100%; height: 100%; object-fit: cover; }

.info { padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
.titulo { margin: 0; font-size: 15px; font-weight: 600; color: #111827; line-height: 1.3; }
.autor { margin: 0; font-size: 13px; color: #4b5563; }

/* ESTILO PARA EL CONTENEDOR DEL BOTÓN DE FAVORITOS */
.acciones-tarjeta {
  margin-top: auto; 
  padding-top: 12px;
  display: flex;
  justify-content: flex-end; 
}
</style>