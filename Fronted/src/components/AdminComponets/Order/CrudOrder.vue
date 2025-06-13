<script setup>
import CrudTable from '@/components/AdminComponets/CrudTable.vue';
import OrderForm from './OrderForm.vue';
import { ref } from 'vue';

const crudTableRef = ref(null);
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

async function fetchOrders() {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      console.error('Error en la respuesta:', res.status, res.statusText);
      return [];
    }
     
    const data = await res.json();
    const ordersFlattened = data.map(order => ({
      ...order,
      clienteName: order.cliente?.name || 'Sin nombre',  
    }));
    return ordersFlattened;

  } catch (error) {
    console.error('Error al hacer fetch:', error);
    return [];
  }
}

function editOrder(order) {
    selected.value = { ...order };
    showModal.value = true;
}

function onSaved() {
    crudTableRef.value?.loadData();
    closeModal();
}
</script>

<template>
  <CrudTable
    ref="crudTableRef"
    title="Gestión de Pedidos"
    :columns="[
      { label: 'Cliente', key: 'clienteName' },   
      { label: 'Contacto', key: 'contacto' },
      { label: 'Dirección', key: 'direccion' },
      { label: 'Total ($)', key: 'total' },
      { label: 'Indicaciones', key: 'indicaciones' },
      { label: 'Fecha', key: 'createdAt' }
    ]"
    :fetchData="fetchOrders"
    :editItem="editOrder"
    :searchKeys="['clienteName', 'direccion', 'contacto']"  
    :showDelete="true"
    @open-modal="openModal"
  />

  <div v-if="showModal" class="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
    <OrderForm :initialData="selected" @cancel="closeModal" @saved="onSaved" />
  </div>
</template>
