<!-- pages/Specialties.vue -->
<script setup>
import CrudTable from '@/components/AdminComponets/CrudTable.vue';
import SpecialtyForm from './SpecialtyForm.vue';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

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

async function fetchSpecialties() {
  try{
    const res = await fetch(`${API_URL}/specialty`);
    return await res.json();
  }
  catch(error){
    console.error('Error al obtener especialidades:', error);
    return [];
  }
  
}

function editSpecialty(s) {
  selected.value = { ...s };
  showModal.value = true;
}
async function deleteSpecialty(specialty) {
  if (!confirm(`¿Está seguro que desea eliminar la especialidad"?`)) {
    return;
  }
  try {
    const res = await fetch(`${API_URL}/specialty/${specialty._id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Error al eliminar');

    crudTableRef.value?.loadData();

    toast.success('Especialidad eliminada correctamente');
  } catch (error) {
    toast.error('Error al eliminar la especialidad');
    return [];
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
  <CrudTable ref="crudTableRef" title="Gestión de Especialidades" :columns="[
    { label: 'Nombre', key: 'nombre' },
    { label: 'Descripción', key: 'descripcion' },
    { label: 'Imagen', key: 'imagen' },
    { label: 'Tipo', key: 'type' }
  ]" :fetchData="fetchSpecialties" :editItem="editSpecialty" :deleteItem="deleteSpecialty"
    :searchKeys="['nombre', 'descripcion', 'type']" :renderImage="renderImage" :showDelete="true" :showEdit="true" 
    @open-modal="openModal" />

  <div v-if="showModal" class="fixed inset-0 flex justify-center items-center z-50">
    <button @click="closeModal" class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl">
    </button>
    <SpecialtyForm :initialData="selected" @cancel="closeModal" @saved="onSaved" />
  </div>
</template>
