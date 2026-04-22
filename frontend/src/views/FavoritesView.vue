<script setup>
import { onMounted } from 'vue';
import { useFavoritesStore } from '../stores/favoritesStore';

const favoritesStore = useFavoritesStore();

onMounted(() => {
  favoritesStore.loadFavorites();
});

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<template>
  <div class="pagina">
    <header class="cabecera">
      <h1>❤️ Mis favoritos</h1>
      <router-link to="/catalog" class="btn-catalogo">← Volver al catálogo</router-link>
    </header>

    <p v-if="favoritesStore.loading" class="estado">Cargando favoritos…</p>
    <p v-else-if="favoritesStore.error" class="error">{{ favoritesStore.error }}</p>

    <div v-else-if="favoritesStore.favoritesList.length === 0" class="vacio">
      <p class="vacio-icono">📭</p>
      <p>No tienes favoritos aún.</p>
      <router-link to="/catalog" class="btn-catalogo">Explorar catálogo</router-link>
    </div>

    <template v-else>
      <p class="contador">
        {{ favoritesStore.favoritesList.length }} 
        {{ favoritesStore.favoritesList.length === 1 ? 'libro guardado' : 'libros guardados' }}
      </p>

      <div class="grilla">
        <article v-for="fav in favoritesStore.favoritesList" :key="fav.id" class="tarjeta">
         <div class="portada">
  <img
    v-if="fav.imagen_url"
    :src="fav.imagen_url"
    :alt="fav.titulo"
    @error="(e) => { 
      e.target.onerror = null; 
      e.target.src = 'https://via.placeholder.com/200x300?text=Imagen+No+Disponible';
    }"
  />
  <div v-else class="portada-placeholder">📖</div>
</div>
<div class="info">
  <h3 class="titulo">{{ fav.titulo }}</h3>
</div>

          <div class="info">
            <h3 class="titulo">{{ fav.titulo || 'Sin título' }}</h3>
            <p class="fecha">Guardado el {{ formatDate(fav.creado_en) }}</p>
          </div>

          <div class="acciones">
            <button
              class="btn-eliminar"
              @click="favoritesStore.removeFavorite(fav.libro_id)"
            >
              ✕ Eliminar
            </button>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pagina { max-width: 1100px; margin: 0 auto; padding: 24px 20px; font-family: system-ui, sans-serif; }
.cabecera { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.btn-catalogo { padding: 8px 16px; background: #4f46e5; color: white; border-radius: 6px; text-decoration: none; font-size: 14px; }
.grilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
.tarjeta { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; transition: 0.2s; }
.tarjeta:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.portada { height: 220px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.portada img { width: 100%; height: 100%; object-fit: cover; }
.info { padding: 12px; flex-grow: 1; }
.titulo { margin: 0; font-size: 15px; font-weight: 600; }
.fecha { font-size: 12px; color: #9ca3af; margin-top: 5px; }
.acciones { padding: 12px; }
.btn-eliminar { width: 100%; padding: 8px; background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; border-radius: 6px; cursor: pointer; }
.btn-eliminar:hover { background: #fecaca; }
</style>