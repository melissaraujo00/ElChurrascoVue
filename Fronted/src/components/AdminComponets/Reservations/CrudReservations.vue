<!-- pages/Reservations.vue -->
<script setup>
import CrudTable from '@/components/AdminComponets/CrudTable.vue';
import ReservationForm from './ReservationForm.vue';
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

async function fetchReservations() {
  const res = await fetch(`${API_URL}/reservations`);
  return await res.json();
}

function editReservation(r) {
  selected.value = { ...r };
  showModal.value = true;
}
</script>

<template>
  <CrudTable
    title="Gestión de Reservaciones"
    :columns="[
      { label: 'Nombre', key: 'nombre' },
      { label: 'Número de Personas', key: 'numeroPersonas' },
      { label: 'Fecha', key: 'fecha' },
      { label: 'Hora', key: 'hora' },
      { label: 'Contacto', key: 'contactos' },
      { label: 'Datos Adicionales', key: 'datosAdicionales' }
    ]"
    :fetchData="fetchReservations"
    :editItem="editReservation"
    :searchKeys="['nombre', 'contactos', 'datosAdicionales']"
    :showDelete="false"
    @open-modal="openModal"
  />

  <div v-if="showModal" class="fixed inset-0 flex justify-center items-center z-50">
    <button @click="closeModal" class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl">
      &times;
    </button>
    <ReservationForm
      :initialData="selected"
      @close="closeModal"
      @saved="() => { closeModal(); }"
    />
  </div>
</template>
