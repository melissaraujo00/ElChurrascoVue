<!-- pages/Dishes.vue -->
<script setup>
import CrudTable from '@/components/AdminComponets/CrudTable.vue';
import DishForm from './DishForm.vue';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
const toast = useToast();
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

function confirmar() {
  proxy.$swal({
    title: '¿Estás seguro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('Acción confirmada')
    }
  })
}

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

async function fetchDishes() {
  try {
    const res = await fetch(`${API_URL}/dishes`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    const data = await res.json();

    return data.map(dish => ({
      ...dish,
      especialidadNombre: dish.especialidad?.nombre || ''
    }));
  } catch (error) {
    console.error('Error al obtener platos:', error);
    return [];
  }
}

function editDish(dish) {
    selected.value = { ...dish };
    showModal.value = true;
}

async function deleteDish(dish) {
    const result = await proxy.$swal({
      title: '¿Estás seguro que deseas eliminar este plato?',
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
        const res = await fetch(`${API_URL}/dishes/${dish._id}`, {
            method: 'DELETE',
            credentials: 'include'
        });     

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Error al eliminar. Código: ${res.status}`);
        }

        crudTableRef.value?.loadData();
        toast.success('Plato eliminado correctamente');
    } catch (error) {
        toast.error('Ocurrió un error');
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
    <CrudTable ref="crudTableRef" title="Gestión de Platos" :columns="[
        { label: 'Nombre', key: 'nombre' },
        { label: 'Precio', key: 'precio' },
        { label: 'Descripción', key: 'descripcion' },
        { label: 'Imagen', key: 'imagen' },
        { label: 'Especialidad', key: 'especialidadNombre' },
        { label: 'Imprescindible', key: 'imprescindible' },
        { label: 'Oferta', key: 'offer' }
    ]" :fetchData="fetchDishes" :editItem="editDish" :deleteItem="deleteDish"
        :searchKeys="['nombre', 'descripcion', 'offer']" :renderImage="renderImage" :showDelete="true" :showEdit="true" 
        @open-modal="openModal" />

    <div v-if="showModal" class="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl">
        </button>
        <DishForm :initialData="selected" @cancel="closeModal" @saved="onSaved" />
    </div>
</template>
