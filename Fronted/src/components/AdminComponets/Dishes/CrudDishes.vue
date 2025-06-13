<!-- pages/Dishes.vue -->
<script setup>
import CrudTable from '@/components/AdminComponets/CrudTable.vue';
import DishForm from './DishForm.vue';
import { ref } from 'vue';

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
            method: 'GET'
        });
        if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`Error ${res.status}: ${errorText}`);
        };
        return await res.json();
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
    if (!confirm(`¿Está seguro que desea eliminar el plato?`)) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/dishes/${dish._id}`, {
            method: 'DELETE',
        });     

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Error al eliminar. Código: ${res.status}`);
        }

        crudTableRef.value?.loadData();
    } catch (error) {
        console.error('Error al eliminar plato:', error);
        alert(error.message || 'Ocurrió un error al eliminar el plato.');
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
        { label: 'Especialidad', key: 'especialidad.nombre' },
        { label: 'Imprescindible', key: 'imprescindible' },
        { label: 'Oferta', key: 'offer' }
    ]" :fetchData="fetchDishes" :editItem="editDish" :deleteItem="deleteDish"
        :searchKeys="['nombre', 'descripcion', 'offer']" :renderImage="renderImage" :showDelete="true"
        @open-modal="openModal" />

    <div v-if="showModal" class="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl">
            &times;
        </button>
        <DishForm :initialData="selected" @close="closeModal" @saved="onSaved" />
    </div>
</template>
