import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '../services/api';

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref(new Set());
  const favoritesList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const isFavorite = computed(() => (bookId) => favoriteIds.value.has(String(bookId)));

  const loadFavorites = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get('/favorites');
      favoritesList.value = response.data;
      // IMPORTANTE: Cambiamos f.book_id por f.libro_id (nombre en la DB)
      favoriteIds.value = new Set(response.data.map(f => String(f.libro_id)));
    } catch (err) {
      console.error('Error en loadFavorites:', err);
      error.value = err.response?.data?.error || 'Error cargando favoritos';
    } finally {
      loading.value = false;
    }
  };

  const addFavorite = async (bookId) => {
    // Convertimos a String para evitar problemas de tipos
    const bId = String(bookId);
    if (isFavorite.value(bId)) return;
    
    try {
      // ENVIAMOS libro_id para que el backend lo reciba correctamente
      await apiClient.post('/favorites', { libro_id: bId }); 
      
      favoriteIds.value.add(bId);
      await loadFavorites();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error agregando a favoritos';
      throw err;
    }
  };

  const removeFavorite = async (bookId) => {
    const bId = String(bookId);
    try {
      await apiClient.delete(`/favorites/${bId}`);
      favoriteIds.value.delete(bId);
      // Filtramos usando libro_id
      favoritesList.value = favoritesList.value.filter(f => String(f.libro_id) !== bId);
    } catch (err) {
      error.value = err.response?.data?.error || 'Error removiendo de favoritos';
      throw err;
    }
  };

  return {
    favoriteIds,
    favoritesList,
    loading,
    error,
    isFavorite,
    loadFavorites,
    addFavorite,
    removeFavorite
  };
});