<!-- pages/Specialties.vue -->
<script setup>
import CrudTable from '@/components/AdminComponets/CrudTable.vue';
import SpecialtyForm from './SpecialtyForm.vue';
import { ref } from 'vue';

const API_URL = import.meta.env.VITE_API_URL;
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
  const res = await fetch(`${API_URL}/specialty`);
  return await res.json();
}

function editSpecialty(s) {
  selected.value = { ...s };
  showModal.value = true;
}

function renderImage(path) {
  return `${API_URL}/${path}`;
}
</script>

<template>
  <CrudTable
    title="Gestión de Especialidades"
    :columns="[
      { label: 'Nombre', key: 'nombre' },
      { label: 'Descripción', key: 'descripcion' },
      { label: 'Imagen', key: 'imagen' },
      { label: 'Tipo', key: 'type' }
    ]"
    :fetchData="fetchSpecialties"
    :editItem="editSpecialty"
    :searchKeys="['nombre', 'descripcion', 'type']"
    :renderImage="renderImage"
    @open-modal="openModal"
  />

  <div v-if="showModal" class="fixed inset-0 flex justify-center items-center z-50">
    <button @click="closeModal" class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl">
      &times;
    </button>
    <SpecialtyForm
      :initialData="selected"
      @close="closeModal"
      @saved="() => { closeModal(); }"
    />
  </div>
</template>
