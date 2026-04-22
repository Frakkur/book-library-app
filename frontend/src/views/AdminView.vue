<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const libros    = ref([]);
const error     = ref('');
const exito     = ref('');
const modoEditar = ref(false);

const libroVacio = () => ({
  titulo: '', autor: '', total_paginas: '', descripcion: '',
  genero: '', anio_publicacion: '', imagen_url: '',
});

const form = ref(libroVacio());

async function cargarLibros() {
  const { data } = await api.get('/libros');
  libros.value = data;
}

function iniciarEdicion(libro) {
  modoEditar.value = true;
  form.value = { ...libro };
}

function cancelar() {
  modoEditar.value = false;
  form.value = libroVacio();
  error.value = '';
}

async function guardar() {
  error.value = '';
  exito.value = '';
  try {
    const payload = {
      ...form.value,
      total_paginas:    Number(form.value.total_paginas),
      anio_publicacion: form.value.anio_publicacion ? Number(form.value.anio_publicacion) : undefined,
    };

    if (modoEditar.value) {
      await api.put(`/libros/${form.value.id}`, payload);
      exito.value = 'Libro actualizado';
    } else {
      await api.post('/libros', payload);
      exito.value = 'Libro creado';
    }

    cancelar();
    await cargarLibros();
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al guardar';
  }
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este libro?')) return;
  try {
    await api.delete(`/libros/${id}`);
    await cargarLibros();
  } catch (err) {
    error.value = 'Error al eliminar';
  }
}

onMounted(cargarLibros);
</script>

<template>
  <div class="pagina">
    <h2>Panel Admin — Catálogo</h2>

    <p v-if="exito" class="exito">{{ exito }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Formulario -->
    <div class="formulario">
      <h3>{{ modoEditar ? 'Editar libro' : 'Nuevo libro' }}</h3>
      <input v-model="form.titulo"           placeholder="Título *" />
      <input v-model="form.autor"            placeholder="Autor *" />
      <input v-model="form.total_paginas"    placeholder="Total páginas *" type="number" />
      <input v-model="form.genero"           placeholder="Género" />
      <input v-model="form.anio_publicacion" placeholder="Año publicación" type="number" />
      <input v-model="form.imagen_url"       placeholder="URL imagen" />
      <textarea v-model="form.descripcion"   placeholder="Descripción"></textarea>
      <div class="botones-form">
        <button @click="guardar">{{ modoEditar ? 'Actualizar' : 'Crear' }}</button>
        <button v-if="modoEditar" @click="cancelar" class="cancelar">Cancelar</button>
      </div>
    </div>

    <!-- Tabla -->
    <table>
      <thead>
        <tr>
          <th>Título</th><th>Autor</th><th>Páginas</th><th>Género</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="libro in libros" :key="libro.id">
          <td>{{ libro.titulo }}</td>
          <td>{{ libro.autor }}</td>
          <td>{{ libro.total_paginas }}</td>
          <td>{{ libro.genero || '—' }}</td>
          <td>
            <button @click="iniciarEdicion(libro)" class="btn-editar">Editar</button>
            <button @click="eliminar(libro.id)"    class="btn-eliminar">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.pagina     { max-width: 900px; margin: 40px auto; padding: 0 20px; }
.formulario { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 32px; display: flex; flex-direction: column; gap: 10px; }
.formulario h3 { margin: 0 0 8px; }
input, textarea { padding: 9px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; }
textarea    { min-height: 80px; resize: vertical; }
.botones-form { display: flex; gap: 8px; }
button      { padding: 9px 18px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; }
.cancelar   { background: #6b7280; }
table       { width: 100%; border-collapse: collapse; }
th, td      { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
th          { background: #f3f4f6; font-weight: 600; }
.btn-editar   { background: #f59e0b; padding: 5px 12px; font-size: 12px; margin-right: 6px; }
.btn-eliminar { background: #ef4444; padding: 5px 12px; font-size: 12px; }
.exito      { color: #16a34a; background: #dcfce7; padding: 8px; border-radius: 4px; }
.error      { color: #dc2626; background: #fee2e2; padding: 8px; border-radius: 4px; }
</style>