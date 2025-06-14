<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const {
  title,
  columns,
  fetchData,
  editItem,
  deleteItem,
  searchKeys,
  addButtonText,
  showDelete,
  showAddButton,
  showStatus
} = defineProps({
  title: String,
  columns: Array,
  fetchData: Function,
  editItem: Function,
  deleteItem: Function,
  statusItem: Function,
  searchKeys: Array,
  addButtonText: {
    type: String,
    default: 'Agregar'
  },
  renderImage: Function,
  showDelete: {
    type: Boolean,
    default: false
  },
  showAddButton: {
    type: Boolean,
    default: true
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
  showEdit:{
     type: Boolean,
    default: false,
  }
});


const emit = defineEmits(['open-modal']);

const searchText = ref('');
const items = ref([]);
const loading = ref(false);

async function loadData() {
  loading.value = true;
  try {
    const data = await fetchData();
    items.value = data;
  } catch (err) {
    console.error('Error loading data:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
defineExpose({ loadData });

const filteredItems = computed(() => {
  if (!searchText.value.trim()) return items.value;
  const search = searchText.value.toLowerCase();
  return items.value.filter(item =>
    searchKeys.some(key =>
      item[key]?.toString().toLowerCase().includes(search)
    )
  );
});
</script>

<template>
  <div class="p-6 text-gray-900">
    <div class="relative overflow-x-auto shadow-xl rounded-2xl bg-gray-300/80 max-w-7xl mx-auto p-2 m-2">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-3 px-2 sm:px-4 pt-4 gap-4">
        <h1 class="text-4xl font-extrabold mb-6 text-center drop-shadow-lg">
          {{ title }}
        </h1>
        <div class="flex items-center gap-4">
          <input v-model="searchText" type="text" placeholder="Buscar..."
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 w-full sm:w-auto" />
          <button v-if="showAddButton" @click="$emit('open-modal')"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300">
            {{ addButtonText }}
          </button>
        </div>
      </div>

      <div class="p-4 shadow-inner rounded-b-2xl max-w-7xl mx-auto">
        <table
          class="min-w-full w-full text-sm text-left text-gray-900 border border-gray-600 rounded-2xl overflow-hidden shadow-2xl">
          <thead class="text-xs uppercase bg-red-800 text-white hidden sm:table-header-group ...">
            <tr>
              <th v-for="col in columns" :key="col.key" class="px-5 py-3">{{ col.label }}</th>
              <th class="px-5 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item._id"
              class="sm:table-row flex flex-col sm:flex-row odd:bg-gray-300 even:bg-gray-200 border-b-gray-50 text-gray-950 mb-4 sm:mb-0 bg-white rounded-xl p-4 sm:p-0 shadow-md">
              <td v-for="col in columns" :key="col.key" class="px-5 py-3  sm:table-cell flex justify-between border-b border-gray-200 sm:border-0"> 
                <template v-if="renderImage && col.key === 'imagen'">
                  <img :src="renderImage(item[col.key])" alt="Imagen" class="h-16 w-24 object-cover rounded-md" />
                </template>
                <template v-else>
                  {{ item[col.key] || '-' }}
                </template>
              </td>
              <td class="px-5 py-3">
                <div class="flex gap-2">
                  <button v-if="showEdit" @click="editItem(item)"
                    class="text-white bg-orange-700 hover:bg-orange-800 font-medium text-sm rounded-md px-5 py-1.5 shadow-md border-2 border-orange-600">
                    Editar
                  </button>
                  <button v-if="showDelete" @click="deleteItem(item)"
                    class="text-white bg-red-700 hover:bg-red-800 font-medium text-sm rounded-md px-5 py-1.5 shadow-md border-2 border-red-600">
                    Eliminar
                  </button>
                  <button v-if="showStatus" @click="statusItem(item)"
                    class="text-white bg-orange-700 hover:bg-orange-800 font-medium text-sm rounded-md px-5 py-1.5 shadow-md border-2 border-orange-600">
                    Estado
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td :colspan="columns.length + 1" class="text-center py-4 text-gray-700">
                No se encontraron registros.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
