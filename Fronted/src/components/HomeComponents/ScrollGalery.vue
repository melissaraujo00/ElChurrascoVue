<script setup>
import axios from 'axios';
import { ref, onMounted, computed, onBeforeUnmount, nextTick } from 'vue';
const API_URL = import.meta.env.VITE_API_URL;

const productos = ref([]);
const scrollContainer = ref(null);
const cardWidth = ref(0);
const currentIndex = ref(0);

const updateCardWidth = () => {
  if (scrollContainer.value) {
    const containerWidth = scrollContainer.value.clientWidth;
    // Mostrar 2 tarjetas en pantallas medianas y grandes, 1 en móviles
    cardWidth.value = window.innerWidth < 768 ? containerWidth : containerWidth / 2;
  }
};

const fetchProductos = async () => {
  try {
    const res = await axios(`${API_URL}/dishes/`);
    productos.value = res.data.filter(p => p.imprescindible === true);
    await nextTick();
    updateCardWidth();
  } catch (error) {
    console.error('Error al cargar los productos', error);
  }
};

onMounted(() => {
  fetchProductos();
  window.addEventListener('resize', updateCardWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCardWidth);
});

const maxIndex = computed(() => {
  // Si en móvil, solo una tarjeta visible, si no, dos
  const visibleCards = window.innerWidth < 768 ? 1 : 2;
  return Math.max(productos.value.length - visibleCards, 0);
});

const scrollLeft = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    scrollToIndex();
  }
};

const scrollRight = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++;
    scrollToIndex();
  }
};

const scrollToIndex = () => {
  if (scrollContainer.value) {
    const scrollAmount = currentIndex.value * (cardWidth.value + 16); // 16px = space-x-4
    scrollContainer.value.scrollTo({ left: scrollAmount, behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="relative w-full md:w-3/5 lg:w-2/3 px-5 mx-auto">
  <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl  text-white font-bold text-center mb-5 sm:mb-4 md:mb-6 max-w-4xl mx-auto leading-tight">
¡Nuestros platillos imperdibles!</h2>
  <div class="w-full h-px bg-white mb-6"></div>
    <template v-if="productos.length > 0">
      <!-- Botón izquierdo -->
      <button
        @click="scrollLeft"
        :disabled="currentIndex === 0"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-gray-800 rounded-full p-2 shadow-md z-10 focus:outline-none transition-all duration-300 disabled:opacity-50"
        aria-label="Anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Contenedor con scroll -->
      <div ref="scrollContainer" class="overflow-x-auto pb-4 scrollbar-hide p-2">
        <div class="flex space-x-4 px-2">
          <div
            v-for="(item, index) in productos"
            :key="item._id || index"
            :style="{ width: cardWidth + 'px' }"
            class="overflow-hidden flex-shrink-0 flex flex-col p-2 shadow-red-500/50 shadow-md bg-black text-white rounded hover:shadow-lg duration-300 transition-transform transform hover:scale-105"
          >
            <div class="w-full">
              <img
                :src="` ${API_URL}0${item.imagen}`"
                :alt="item.nombre"
                class="w-full h-40 sm:h-44 md:h-48 object-cover mb-4 rounded"
              />
            </div>
            <h2 class="text-lg md:text-xl font-medium ml-3">{{ item.nombre }}</h2>
            <p>{{ item.descripcion }}</p>
          </div>
        </div>
      </div>

      <!-- Botón derecho -->
      <button
        @click="scrollRight"
        :disabled="currentIndex === maxIndex"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800 rounded-full p-2 shadow-md z-10 focus:outline-none transition-all duration-300 disabled:opacity-50"
        aria-label="Siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </template>

    <!-- Mensaje si no hay productos -->
    <template v-else>
      <div class="text-center text-gray-500 py-10">
        No hay productos imprescindibles disponibles en este momento.
      </div>
    </template>

    <div class="flex justify-center mt-4">
      <router-link
        :to="{ name: 'Menu' }"
        class="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center shadow-white/50 shadow-md"
      >
        Menú
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;    /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
</style>
