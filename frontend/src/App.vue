<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import { useFavoritesStore } from './stores/favoritesStore';

const authStore      = useAuthStore();
const favoritesStore = useFavoritesStore();

// Si el usuario ya tiene sesión activa al cargar la app (ej: tras un refresh),
// poblamos el store de favoritos de inmediato para que cualquier vista
// que consulte isFavorite() reciba el estado correcto.
onMounted(() => {
  if (authStore.estaAutenticado) {
    favoritesStore.loadFavorites();
  }
});
</script>

<template>
  <router-view />
</template>