<script setup>
import { ref } from "vue";

const specialties = ref([
    { id: 1, name: 'Entradas', image: '/img/medio-nacho.jpg' },
    { id: 2, name: 'Tacos', image: '/img/tacos.jpg' },
    { id: 3, name: 'Burritos', image: '/img/burritos.jpg' },
    { id: 4, name: 'Fajitas', image: '/img/fajitas.jpg' },
    { id: 5, name: 'Alambres', image: '/img/alambre.jpg' },
]);

const dishes = ref([
    { name: 'Medio Nacho', image: '/img/medio-nacho.jpg', price: 3.00, specialtyId: 1 },
    { name: 'Media Sopa', image: '/img/medio-nacho.jpg', price: 4.00, specialtyId: 1 },
    { name: 'Mulitas', image: '/img/medio-nacho.jpg', price: 4.00, specialtyId: 1 },
    { name: 'Tacos de Res', image: '/img/taco.jpg', price: 6.00, specialtyId: 2 },
    { name: 'Tacos de Pollo', image: '/img/taco.jpg', price: 6.00, specialtyId: 2 },
    { name: 'Tacos al Pastor', image: '/img/taco.jpg', price: 6.00, specialtyId: 2 },
    { name: 'Tacos de Lengua', image: '/img/taco.jpg', price: 6.00, specialtyId: 2 },
    { name: 'Burrito de Res', image: '/img/burrito.jpg', price: 1.25, specialtyId: 3 },
    { name: 'Burrito de Pollo', image: '/img/burrito.jpg', price: 1.25, specialtyId: 3 },
    { name: 'Burrito Mixto', image: '/img/burrito.jpg', price: 1.25, specialtyId: 3 },
    { name: 'Big Burrito de Res', image: '/img/burrito.jpg', price: 1.25, specialtyId: 3 },
    { name: 'Big Burrito de Pollo', image: '/img/burrito.jpg', price: 1.25, specialtyId: 3 },
    { name: 'Big Burrito Mixto', image: '/img/burrito.jpg', price: 1.25, specialtyId: 3 },
    { name: 'Fajitas de Res', image: '/img/fajita.jpg', price: 2.50, specialtyId: 4 },
    { name: 'Fajitas de Pollo', image: '/img/fajita.jpg', price: 2.50, specialtyId: 4 },
    { name: 'Fajitas Mixtas', image: '/img/fajita.jpg', price: 2.50, specialtyId: 4 },
    { name: 'Fajitas especial de Res', image: '/img/fajita.jpg', price: 2.50, specialtyId: 4 },
    { name: 'Fajitas especial de Pollo', image: '/img/fajita.jpg', price: 2.50, specialtyId: 4 },
    { name: 'Fajitas especial Mixtas', image: '/img/fajita.jpg', price: 2.50, specialtyId: 4 },
    { name: 'Alambre de Res', image: '/img/platillo3.jpg', price: 2.50, specialtyId: 5 },
    { name: 'Alambre de Pollo', image: '/img/platillo3.jpg', price: 2.50, specialtyId: 5 },
    { name: 'Alambre Mixto', image: '/img/platillo3.jpg', price: 2.50, specialtyId: 5 },

]);
</script>

<template >
    <div v-for="specialty in specialties" :key="specialty.id" class="relative w-full h-auto shadow-xl ">
        <div class="relative w-full h-auto ">
            <div class="absolute inset-0 bg-gray-950/55 shadow-lg"></div>
            <img :src="specialty.image" alt="Imagen especialidad" class="w-full min-h-[30px] sm:h-[80px] md:h-[120px] lg:h-[150px] object-cover" />
            </div>

            <div class="absolute inset-0 p-2 sm:p-4 md:p-5 flex flex-col justify-start">
            <div class="p-1 rounded-md">
                <h2 class="sm:text-3xl md:text-5xl text-lg text-white font-bold">
                {{ specialty.name }}
                </h2>
            </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-2 ">
                <div v-for="dish in dishes.filter(d => d.specialtyId === specialty.id)" 
                    :key="dish.id" 
                    class="relative transition transform duration-300 ease-in-out hover:scale-110 z-10">
                    <div class="rounded-md shadow-lg p-3 bg-white flex items-start gap-4">
                        <img :src="dish.image" alt="Imagen del plato" class="w-[100px] h-[100px] object-cover rounded-md"/>
                    <div>
                    <h3 class="text-lg font-semibold text-gray-800">{{ dish.name }}</h3>
                    <p class="text-sm text-gray-600">${{ dish.price.toFixed(2) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>