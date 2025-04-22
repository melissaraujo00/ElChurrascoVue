<script setup>
import { ref } from 'vue'

const paginas = ref([
  { name: 'Inicio', enlaceHTML: '#/' },
  { name: 'Menú', enlaceHTML: '#/menu' },
  { name: 'Reservar', enlaceHTML: '#/reserve' },
  { name: 'Eventos', enlaceHTML: '#/events' },
])
</script>

<template>
<header class="relative w-full h-screen">
  <nav class="bg-black text-white p-4">
    <ul class="flex flex-col md:flex-row md:justify-between items-center text-center space-y-4 md:space-y-0">
      <!-- Título centrado arriba en pantallas pequeñas -->
      <li class="text-red-500 font-bold text-lg">
        <span class="text-red-500 block">EL CHURRASCO</span>
        <span class="text-white block">RESTAURANTE</span>
      </li>
      
      <!-- Navegación -->
      <li>
          <ul class="flex space-x-4">
            <li v-for="pagina in paginas" :key="pagina.name" class="hover:bg-red-500 p-2">
              <a :href="pagina.enlaceHTML" class="transition-colors duration-200">
                {{ pagina.name }}
              </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</header>  
</template>
