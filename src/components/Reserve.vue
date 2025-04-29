<script setup>
import { ref } from "vue";

const formNames = ref([
    { id: 1, name: 'Nombre', for: 'name', type: 'text'},
    { id: 2, name: 'Fecha', for: 'date', type: 'date'},
    { id: 3, name: 'Hora', for: 'hour', type: 'text'},
    { id: 4, name: 'Numero Personas', for: 'people', type: 'number'},
]);

const information = ref([
    { id: 1, title: 'Direccion', content: 'Cantón San Matías, Distrito de Ciudad Barrios'},
    { id: 2, title: 'Telefono', content: '+503 7956 5203'},
    { id: 3, title: 'Correo Electrónico', content: 'elchurrascosv@outlook.com'}
])

</script>

<template>
    <div class="relative h-full grid grid-cols-2">
      <div class="relative w-full col-span-2 h-80 overflow-hidden">
        <div class="absolute inset-0 bg-gray-950/65"></div>
        <img class="w-full h-full object-cover object-top" src="/dist/img/bannerReservation.jpg" alt="">
  
        <div class="absolute w-full inset-0 flex items-center justify-center">
          <h2 class="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold text-center mb-5 sm:mb-4 md:mb-6 leading-tight">
            Déjanos ser parte de tus mejores recuerdos
          </h2>
        </div>
      </div>
  
      <div class="md:col-span-1 col-span-2 mt-3 bg-gray-300">
        <img class="w-full h-auto block p-20" src="/dist/img/reservationImg.jpg" alt="">
      </div>
  
      <div class="p-20 mt-3 bg-gray-300 flex flex-col items-center md:col-span-1 col-span-2">
        <h2 class="text-5xl font-bold mb-7 text-center">¡Reserva Aquí!</h2>
        <form v-for="formName in formNames" :key="formName.id" class="w-full max-w-lg flex flex-col items-center">
          <div class="p-3 m-3 w-full">
            <label :for="formName.for" class="block text-lg mb-1">{{ formName.name }}</label>
            <input
              :type="formName.type"
              :id="formName.for"
              :name="formName.for"
              class="w-full p-2 bg-white text-black rounded-md"
            >
          </div>
        </form>

        <button
          type="submit"
          class="w-1/2 max-w-xs py-2 bg-red-600 text-white rounded-md hover:bg-amber-400 transition duration-300"
        >
          Enviar
        </button>
      </div>
  
      <div class="p-4 m-1 md:col-span-1 col-span-2">
        <ul class="list-none" v-for="infor in information" :key="infor.id">
          <li class="m-3 p-3">
            <p class="text-xl md:text-3xl font-bold">{{ infor.title }}</p>
            <p class="text-xl md:text-3xl">{{ infor.content }}</p>
          </li>
        </ul>
      </div>
  
      <div class="w-full h-[400px] mt-6 pr-3 md:col-span-1 col-span-2">
        <iframe class="w-full h-full" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30998.35482681424!2d-88.29983382568355!3d13.791267100000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f64db001f8596fb%3A0x53f539e7e88bea84!2sEl%20Churrasco!5e0!3m2!1ses-419!2ssv!4v1738968992720!5m2!1ses-419!2ssv" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
      </div>
    </div>
  </template>
  