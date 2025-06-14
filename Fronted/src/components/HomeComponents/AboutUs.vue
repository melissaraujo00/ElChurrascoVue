<script setup>
import { ref } from 'vue';
const images = ref([
  '/img/imagen_2.jpg',
  '/img/imagen_1.jpg',
  '/img/imagen_3.jpg',
  'img/imagen_4.jpg'
]);
</script>


<template>

  <section class="flex flex-col md:flex-row gap-4 p-4 bg-neutral-950">
    <!-- Galería de imágenes a la izquierda, en grid 2x2 en desktop -->
    <div class="p-3 m-2 w-full md:w-[55%] lg:w-[45%] shadow-md transition-transform duration-300 hover:scale-105">
      <div class="grid grid-cols-2 grid-rows-2 gap-4 h-full ">
        <img
          v-for="(img, index) in images"
          :key="index"
          :src="img"
          alt="evento"
          class="w-full h-60 md:h-52 object-cover rounded transition-transform duration-300 hover:scale-110 shadow-md  shadow-white/60"
        />
      </div>
    </div>
    <!-- Texto y botones a la derecha, centrados -->
    <div class="flex flex-col justify-center items-center w-full md:w-[45%] lg:w-[55%] shadow-md text-center">
      <article class="w-full p-2">
        <h1 class="text-3xl font-bold p-2 text-center text-red-700">Eventos Especiales</h1>
        <p class="text-center p-5 text-white">
          Ofrecemos el espacio perfecto para tus eventos sociales, corporativos o privados. Agenda con nosotros y convierte tu ocasión especial en una experiencia inolvidable.
        </p>
      </article>
      <div class="flex flex-col sm:flex-row justify-center items-center gap-4 p-4 w-full">
        <router-link
          :to="{ name: 'Reserve' }"
          class="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors duration-200 flex items-center justify-center shadow-md shadow-amber-50 w-full sm:w-auto"
        >
          Reservar Evento
        </router-link>
        <router-link
          :to="{ name: 'Menu' }"
          class="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center shadow-md shadow-red-400 w-full sm:w-auto"
        >
          Hacer Pedido
        </router-link>
      </div>
    </div>
  </section>
</template>