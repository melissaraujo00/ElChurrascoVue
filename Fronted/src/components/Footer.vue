<script setup>
import { ref } from 'vue';

const paginas = ref([
  { page: 'Inicio', name: 'Home' },
  { page: 'Menú', name: 'Menu' },
  { page: 'Reservar', name: 'Reserve' },
  { page: 'Eventos', name: 'Events' },
]);
const openWhatsApp = () => {
  const whatsappNumber = '50379565203';
  const whatsappLink = `https://wa.me/${encodeURIComponent(whatsappNumber)}`;
  window.open(whatsappLink, '_blank', 'noopener,noreferrer');
};
</script>

<template>
  <footer class="bg-black text-white pt-6 pb-2 px-4">
    <div class="w-full h-px bg-white mb-6"></div>
    <div class="w-full flex flex-col md:flex-row md:justify-between gap-8">
      <!-- Logo y nombre -->
      <div class="flex flex-col items-center md:items-start gap-2">
        <img src="/img/logochurrasco.png" alt="logo churrasco" class="w-20 h-14" />
        <h4 class="font-bold text-lg">El Churrasco Restaurante</h4>
        <!-- Redes sociales -->
      <div class="flex flex-col items-center gap-2 md:items-end">
        <span class="font-bold">Síguenos</span>
        <div class="flex gap-3">
          <a @click="openWhatsApp" class="cursor-pointer">
            <img src="/img/whatsapp.png" alt="WhatsApp" width="25" />
          </a>
          <a href="https://www.facebook.com/people/El-Churrasco/61554004262366/?_rdr" target="_blank" rel="noopener noreferrer">
            <img src="/img/facebook.png" alt="Facebook" width="25" />
          </a>
        </div>
      </div>
      </div>
      <!-- Horario -->
      <div class="text-center md:text-left">
        <h4 class="font-bold mb-1">Horario</h4>
        <p class="text-sm">Lunes a Domingo<br />11:00 am a 9:00 pm</p>
      </div>
      <!-- Enlaces rápidos -->
      <div>
        <h4 class="font-bold mb-1">Enlaces rápidos</h4>
        <ul>
          <li v-for="pagina in paginas" :key="pagina.name" class="mb-1">
            <router-link
              :to="{ name: pagina.name }"
              class="hover:text-red-700 transition-colors duration-200"
            >
              {{ pagina.page }}
            </router-link>
          </li>
        </ul>
      </div>
      <!-- Contactos -->
      <div>
        <h4 class="font-bold mb-1">Contactos</h4>
        <ul class="text-sm">
          <li>
            <a @click="openWhatsApp" class="cursor-pointer hover:text-red-700 transition-colors duration-200">
              +503 7956 5203
              <img src="/img/whatsapp.png" alt="WhatsApp" width="18" class="inline ml-1 align-text-bottom" />
            </a>
          </li>
          <li>
            <a href="mailto:elchurrascosv@outlook.com" class="hover:text-red-700 transition-colors duration-200">
              elchurrascosv@outlook.com
            </a>
          </li>
          <li>Cantón San Matías, Distrito de Ciudad Barrios San Miguel Norte</li>
          <li class="mt-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30998.35482681424!2d-88.29983382568355!3d13.791267100000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f64db001f8596fb%3A0x53f539e7e88bea84!2sEl%20Churrasco!5e0!3m2!1ses-419!2ssv!4v1738968992720!5m2!1ses-419!2ssv"
              style="border:0;" allowfullscreen="" loading="lazy"
              class="w-full h-24 rounded mt-1"
            ></iframe>
          </li>
        </ul>
      </div>
      
    </div>
    <div class="w-full h-px bg-white my-4"></div>
    <div class="text-center text-xs text-gray-400">
      Copyright © 2025 El Churrasco Restaurante. All rights reserved.
    </div>
  </footer>
</template>