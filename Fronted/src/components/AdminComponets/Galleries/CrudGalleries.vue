<script setup>
import CrudTable from '@/components/AdminComponets/CrudTable.vue';
import GalleryForm from './GalleryForm.vue'; // Cambia al nuevo formulario
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

function confirmar() {
  proxy.$swal({
    title: '¿Estás seguro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('Acción confirmada')
    }
  })
}

const toast = useToast();

const API_URL = import.meta.env.VITE_API_URL;
const crudTableRef = ref(null);
const showModal = ref(false);
const selected = ref(null);

function openModal() {
  selected.value = null;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selected.value = null;
}

async function fetchGalleries() {
  try {
    const res = await fetch(`${API_URL}/gallery`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error al obtener galerías:', error);
    return [];
  }
}

function editGallery(gallery) {
  selected.value = { ...gallery };
  showModal.value = true;
}

async function deleteGallery(gallery) {
  const result = await proxy.$swal({
    title: '¿Estás seguro que deseas eliminar este evento?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'No',
    confirmButtonColor: '#d33',
  });

  if (!result.isConfirmed) {
    // El usuario canceló
    return;
  }
  try {
    const res = await fetch(`${API_URL}/gallery/${gallery._id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al eliminar. Código: ${res.status}`);
    }
    crudTableRef.value?.loadData();
    toast.success('Evento eliminado correctamente');

  } catch (error) {
    toast.error('Error al eliminar un evento');
  }
}

function renderImage(path) {
  return `${API_URL}/${path}`;
}

function onSaved() {
  crudTableRef.value?.loadData();
  closeModal();
}
</script>

<template>
  <CrudTable ref="crudTableRef" title="Gestión de Galerías" :columns="[
    { label: 'Título', key: 'title' },
    { label: 'Descripción', key: 'description' },
    { label: 'Imagen', key: 'imagen' }
  ]" :fetchData="fetchGalleries" :editItem="editGallery" :deleteItem="deleteGallery"
    :searchKeys="['title', 'description']" :renderImage="renderImage" :showDelete="true" :showEdit="true"
    @open-modal="openModal" />

  <div v-if="showModal" class="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
    <button @click="closeModal" class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl">
    </button>
    <GalleryForm :initialData="selected" @cancel="closeModal" @saved="onSaved" />
  </div>
</template>
