<script setup>
import CrudTable from '@/components/AdminComponets/CrudTable.vue';
import { ref } from 'vue';
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

const crudTableRef = ref(null);
const API_URL = import.meta.env.VITE_API_URL;
const showModal = ref(false);
const selected = ref(null);
const token = localStorage.getItem('token');

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
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
      pedido: order.carrito?.map(item => {
        const partes = [];

        if (item.dish?.nombre) partes.push(`Platillo: ${item.dish.nombre}`);
        if (item.cantidad != null) partes.push(`Cantidad: ${item.cantidad}`);
        if (item.precioUnitario != null) partes.push(`Precio: ${item.precioUnitario}`);

        return partes.join(', ');
      }).filter(str => str).join('\n') || ''
    }));

    return ordersFlattened;

  } catch (error) {
    console.error('Error al hacer fetch:', error);
    return [];
  }
}

const estados = ['pendiente', 'en camino', 'entregado'];

async function cambiarEstado(item) {
  const indexActual = estados.indexOf(item.estado);
  if (indexActual === -1) return;

  const siguienteEstado = indexActual < estados.length - 1 ? estados[indexActual + 1] : estados[indexActual];

  if (siguienteEstado === item.estado) return;

  const confirmar = await proxy.$swal({
    title: `¿Estás seguro de cambiar el pedido de "${item.clienteName}" de "${item.estado}" a "${siguienteEstado}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, cambiar el estado',
    cancelButtonText: 'No',
    confirmButtonColor: '#d33',
  });

  if (!confirmar.isConfirmed) {
    // El usuario canceló
    return;
  }

  try {
    const response = await fetch(`${API_URL}/orders/${item._id}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ estado: siguienteEstado }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar el estado');
    }

    item.estado = siguienteEstado;
  } catch (error) {
    console.error('Error al cambiar estado:', error.message);
  }
}


async function eliminarPedido(item) {
  const result = await proxy.$swal({
    title: '¿Estás seguro que deseas eliminar este pedido?',
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
    const response = await fetch(`${API_URL}/orders/${item._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar el pedido');
    }

    // Recargar la tabla
    crudTableRef.value?.loadData();

  } catch (error) {
    console.error('Error al eliminar pedido:', error.message);
  }
}

function onSaved() {
  crudTableRef.value?.loadData();
  closeModal();
}
</script>

<template>
  <CrudTable ref="crudTableRef" title="Gestión de Pedidos" :columns="[
    { label: 'Cliente', key: 'clienteName' },
    { label: 'Contacto', key: 'contacto' },
    { label: 'Dirección', key: 'direccion' },
    { label: 'Pedido', key: 'pedido' },
    { label: 'Total ($)', key: 'total' },
    { label: 'Indicaciones', key: 'indicaciones' },
    { label: 'Estado', key: 'estado' },
    { label: 'Fecha', key: 'createdAt' }
  ]" :fetchData="fetchOrders" :statusItem="cambiarEstado" :deleteItem="eliminarPedido"
    :searchKeys="['clienteName', 'direccion', 'contacto', 'platosNombres']" :showDelete="true" :showAddButton="false"
    :showStatus="true" @open-modal="openModal" />
</template>
