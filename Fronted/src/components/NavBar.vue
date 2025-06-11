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
  <nav class=" text-white p-4 bg-linear-65 from-black to-red-700">
    <ul class="flex flex-col md:flex-row md:justify-between items-center text-center space-y-4 md:space-y-0">
      <li class="font-bold text-lg">
        <img src="/img/logochurrasco.png" alt="logo classico" class="w-25 h-15 mx-auto md:mx-0 ">
      </li>
    
      <li>
          <ul class="flex space-x-4">
            <li v-for="pagina in paginas" :key="pagina.name" class="hover:bg-gray-100 hover:text-black p-2">
              <router-link :to="{ name: pagina.name }" class="transition-colors duration-200">
                {{ pagina.page }}
              </router-link>
            </li>
            <button class="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">
                <router-link :to="{name: 'Register'}" class="transition-colors duration-200">
                  Registrarse
                </router-link>
            </button>
            <button>
                <router-link :to="{name: 'Cart'}" >
                  <img src="/img/carro-de-la-compra.png" alt="" class="w-8 h-8">
                </router-link>
            </button>
        </ul>
      </li>
    </ul>
  </nav>
</header>  
</template>
