<script setup>
import { ref } from "vue";
const events = ref([
    { id: 1, eventDate: '10 Mayo', eventName: 'Degustación de postres artesanales', offer: '20% de descuento en todos los postres', image: '/img/evento-1.jpg' },
    { id: 2, eventDate: '15 Mayo', eventName: 'Noche de parrillada', offer: '2x1 en cortes seleccionados', image: '/img/evento-2.jpg' },
    { id: 3, eventDate: '20 Mayo', eventName: 'Festival de bebidas', offer: 'Bebidas gratis con tu comida', image: '/img/evento-3.jpg' },
    { id: 4, eventDate: '25 Mayo', eventName: 'Cena romántica', offer: 'Cena para dos con 30% de descuento', image: '/img/evento-4.jpg' },
]);

</script>

<template>
<div class="inset-0 bg-gray-200">
    <div class="relative w-full h-60 sm:h-80">
        <img src="/img/bannerEvent.jpg" alt="" class="absolute inset-0 w-full h-full object-cover object-[50%_10%] shadow-lg" />
        <div class="absolute inset-0 bg-gray-950/65"></div>
        <div class="absolute w-full inset-0 flex items-center justify-center">
            <h2 class="text-lg sm:text-2xl md:text-4xl lg:text-5xl text-white font-bold text-center px-4 leading-tight">
                Nuestros eventos y promociones
            </h2>
        </div>
    </div>

    <div v-for="event in events" :key="event.id" class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-8 m-5 shadow-lg bg-white">
        <div class="space-y-6 sm:m-5 md:ml-10">
            <h2 class="p-2 mb-2 bg-red-700 w-full sm:w-2/3 text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold">
                {{ event.eventDate }}
            </h2>
            <h2 class="font-bold text-xl sm:text-2xl md:text-3xl">📅 Evento Especial</h2>
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl">
                {{ event.eventName }}
            </p>

            <h3 class="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">🔥 Ofertas Especiales</h3>
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl">
               {{ event.offer }}
            </p>
        </div>

        <div class="relative w-full flex justify-center items-center">
            <img :src="event.image" alt="" class=" w-full sm:w-3/4 h-50 sm:h-70 object-cover shadow-lg" />
        </div>
    </div>
</div>
</template>
