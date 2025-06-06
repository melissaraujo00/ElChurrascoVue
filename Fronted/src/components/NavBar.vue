<script setup>
import { ref } from 'vue'

const paginas = ref([
  { page: 'Inicio', name: 'Home' },
  { page: 'Menú', name: 'Menu' },
  { page: 'Reservar', name: 'Reserve' },
  { page: 'Eventos', name: 'Events' },
])
</script>

<template>
<header class="relative w-full ">
  <nav class="bg-black text-white p-4">
    <ul class="flex flex-col md:flex-row md:justify-between items-center text-center space-y-4 md:space-y-0">
      <li class="font-bold text-lg">
        <span class="text-red-500">EL CHURRASCO</span> <span class="text-white">RESTAURANTE</span>
      </li>
    
      <li>
          <ul class="flex space-x-4">
            <li v-for="pagina in paginas" :key="pagina.name" class="hover:bg-red-500 p-2">
              <router-link :to="{ name: pagina.name }" class="transition-colors duration-200">
                {{ pagina.page }}
              </router-link>
            </li>
        </ul>
      </li>
    </ul>
  </nav>
</header>  
</template>
