<script setup>
import { ref, computed, onMounted } from 'vue';
import ReservationForm from './ReservationForm.vue';
const API_URL = import.meta.env.VITE_API_URL;

const reservations = ref([]);
const searchText = ref('');
const showModal = ref(false);
const selectedReservation = ref(null);

function openModal() {
  selectedReservation.value = null; 
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedReservation.value = null;
}

async function loadReservations() {
  try {
    const response = await fetch(`${API_URL}/reservations`);
    if (!response.ok) {
      throw new Error('Error fetching reservations');
    }
    const data = await response.json();
    reservations.value = data;
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

function editReservation(reservation) {
  selectedReservation.value = { ...reservation };
  showModal.value = true;
}

onMounted(loadReservations);

const filteredReservations = computed(() => {
  if (!searchText.value.trim()) {
    return reservations.value;
  }
  const search = searchText.value.toLowerCase();
  return reservations.value.filter(r =>
    r.nombre.toLowerCase().includes(search) ||
    r.contactos.toLowerCase().includes(search) ||
    (r.datosAdicionales && r.datosAdicionales.toLowerCase().includes(search))
  );
});
</script>

<template>
  <div class="p-6 text-gray-900">
    <div class="relative overflow-x-auto shadow-xl rounded-2xl bg-gray-300 max-w-[108rem] mx-auto p-2 m-2">
      <div class="flex justify-between items-center mb-3 px-4 pt-4">
        <h1 class="text-4xl font-extrabold mb-6 text-center drop-shadow-lg ">
          Gestión de Reservaciones
        </h1>
        <div class="flex items-center gap-4">
          <input v-model="searchText" type="text" placeholder="Buscar reservación..."
            class="px-3 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900" />
          <button @click="openModal"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300">
            Agregar
          </button>
          <div v-if="showModal" class="fixed inset-0 flex justify-center items-center z-50">
            <button @click="closeModal"
              class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl">&times;</button>
            <ReservationForm
              :initialData="selectedReservation"
              @close="closeModal"
              @saved="() => { closeModal(); loadReservations(); }"
            />
          </div>
        </div>
      </div>
      <div class="bg-gray-300 p-4 shadow-inner rounded-b-2xl max-w-7xl mx-auto">
        <table
          class="w-full text-sm text-left text-gray-900 border border-gray-600 rounded-2xl overflow-hidden shadow-2xl">
          <thead class="text-xs uppercase bg-red-800 text-white">
            <tr>
              <th class="px-5 py-3">Nombre</th>
              <th class="px-5 py-3">Número de Personas</th>
              <th class="px-5 py-3">Fecha</th>
              <th class="px-5 py-3">Hora</th>
              <th class="px-5 py-3">Contacto</th>
              <th class="px-5 py-3">Datos Adicionales</th>
              <th class="px-5 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in filteredReservations" :key="reservation._id"
              class="odd:bg-gray-300 even:bg-gray-200 border-b-gray-50 text-gray-950">
              <td class="px-5 py-3">{{ reservation.nombre }}</td>
              <td class="px-5 py-3">{{ reservation.numeroPersonas }}</td>
              <td class="px-5 py-3">{{ new Date(reservation.fecha).toLocaleDateString() }}</td>
              <td class="px-5 py-3">{{ reservation.hora }}</td>
              <td class="px-5 py-3">{{ reservation.contactos }}</td>
              <td class="px-5 py-3">{{ reservation.datosAdicionales || '-' }}</td>
              <td class="px-5 py-3">
                <div class="flex gap-3">
                  <button
                    @click="editReservation(reservation)"
                    type="button"
                    class="text-white bg-orange-600 hover:bg-orange-700 font-medium text-sm rounded-md px-5 py-1.5 shadow-md transition duration-200 border-2 border-orange-500"
                  >
                    Editar
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredReservations.length === 0">
              <td colspan="7" class="text-center py-4 text-gray-700">
                No se encontraron reservaciones.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
