<script setup>
import { ref } from "vue";

const paginas = ref([
  { name: 'Inicio', enlaceHTML: '#' },
  { name: 'Menú', enlaceHTML: '#' },
  { name: 'Reservar', enlaceHTML: '#' },
  { name: 'Eventos', enlaceHTML: '#' },
])
</script>

<template>
  <nav class="bg-black text-white p-4">
    <ul class="flex justify-between items-center">
      <li class="text-red-500 font-bold text-lg">
        <span class="text-red-500">EL CHURRASCO</span> <span class="text-white">RESTAURANTE</span>
      </li>

      <li>
        <ul class="flex space-x-4">
          <li
            v-for="pagina in paginas"
            :key="pagina.name"
            class="hover:bg-red-500 p-2"
          >
            <a
              :href="pagina.enlaceHTML"
              class=" transition-colors duration-200"
            >
              {{ pagina.name }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
