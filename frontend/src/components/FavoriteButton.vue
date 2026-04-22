<template>
  <button
    :class="['btn-favorite', { 'is-favorite': isFavored }]"
    @click="toggleFavorite"
    :disabled="loadingFav"
    :aria-label="`${isFavored ? 'Remover de' : 'Agregar a'} favoritos`"
  >
    <span class="icon">{{ isFavored ? '♥' : '♡' }}</span>
    <span class="text">{{ isFavored ? 'En favoritos' : 'Agregar' }}</span>
  </button>
  
  <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useFavoritesStore } from '../stores/favoritesStore';

const props = defineProps({
  bookId: {
    type: String,
    required: true
  }
});

const favoritesStore = useFavoritesStore();
const loadingFav = ref(false);
const errorMsg = ref(null);

const isFavored = computed(() => {
  return favoritesStore.isFavorite(props.bookId);
});

const toggleFavorite = async () => {
  loadingFav.value = true;
  errorMsg.value = null;
  
  try {
    if (isFavored.value) {
      await favoritesStore.removeFavorite(props.bookId);
    } else {
      await favoritesStore.addFavorite(props.bookId);
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'Error al procesar';
  } finally {
    loadingFav.value = false;
  }
};
</script>

<style scoped>
.btn-favorite {
  background: none;
  border: 2px solid #ddd;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-favorite:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.btn-favorite.is-favorite {
  background: #ff6b6b;
  border-color: #ff6b6b;
  color: white;
}

.btn-favorite:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #d63031;
  font-size: 12px;
  margin-top: 4px;
}
</style>