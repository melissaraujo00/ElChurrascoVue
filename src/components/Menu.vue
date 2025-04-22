<script setup>
import { ref } from "vue";

const specialties = ref([
    { id: 1, name: 'Entradas', image: '/img/medio-nacho.jpg' },
    { id: 2, name: 'Platos Fuertes', image: '/img/medio-nacho.jpg' },
    { id: 3, name: 'Bebidas', image: '/img/medio-nacho.jpg' },
    { id: 4, name: 'Postres', image: '/img/medio-nacho.jpg' }
]);

const dishes = ref([
    { id: 1, name: 'Medio Nacho', image: '/img/medio-nacho.jpg', price: 3.00, specialtyId: 1 },
    { id: 2, name: 'Taco', image: '/img/medio-nacho.jpg', price: 4.00, specialtyId: 1 },
    { id: 3, name: 'Carne Asada', image: '/img/medio-nacho.jpg', price: 6.00, specialtyId: 2 },
    { id: 4, name: 'Pollo Empanizado', image: '/img/medio-nacho.jpg', price: 5.50, specialtyId: 2 },
    { id: 5, name: 'Coca-Cola', image: '/img/medio-nacho.jpg', price: 1.25, specialtyId: 3 },
    { id: 6, name: 'Limonada', image: '/img/medio-nacho.jpg', price: 1.00, specialtyId: 3 },
    { id: 7, name: 'Pastel de Chocolate', image: '/img/medio-nacho.jpg', price: 2.50, specialtyId: 4 },
    { id: 2, name: 'Taco', image: '/img/medio-nacho.jpg', price: 4.00, specialtyId: 1 },
    { id: 2, name: 'Taco', image: '/img/medio-nacho.jpg', price: 4.00, specialtyId: 1 },
    { id: 2, name: 'Taco', image: '/img/medio-nacho.jpg', price: 4.00, specialtyId: 1 },
]);
</script>

<template>
  <section v-for="specialty in specialties" :key="specialty.id" class="relative w-full h-auto shadow-xl">
    <div class="relative w-full h-auto">
      <div class="absolute inset-0 bg-gray-950/65 shadow-lg"></div>
      <img :src="specialty.image" alt="Imagen especialidad" class="w-full min-h-[30px] sm:h-[80px] md:h-[120px] lg:h-[150px] object-cover " />
    </div>
    <div class="absolute inset-0 p-2 sm:p-4 md:p-5 flex flex-col justify-start overflow-hidden">
      <div class="p-1 rounded-md">
        <h2 class="sm:text-3xl md:text-5xl text-lg font-serif text-white font-bold">
          {{ specialty.name }}
        </h2>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2 ">
      <div v-for="dish in dishes.filter(d => d.specialtyId === specialty.id)" :key="dish.id" class="rounded-md shadow-lg p-3 bg-white flex items-start gap-4 " >
        <img :src="dish.image" alt="Imagen del plato" class="w-[80px] h-[80px] object-cover rounded-md" />
        <div>
          <h3 class="text-lg font-semibold text-gray-800">{{ dish.name }}</h3>
          <p class="text-sm text-gray-600">${{ dish.price.toFixed(2) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>