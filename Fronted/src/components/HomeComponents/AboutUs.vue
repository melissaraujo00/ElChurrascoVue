<template>




  <section class="flex flex-col md:flex-row gap-4 p-4 bg-neutral-950">
    
    <!-- Galería de imágenes a la izquierda, en grid 2x2 en desktop -->
    <div class="p-3 m-2 w-full md:w-2/5 lg:w-1/3 shadow-md">
      <div class="grid grid-cols-2 grid-rows-2 gap-2 h-full">
        <img src="../../../public/img/imagen_1.jpg" alt="evento" class="w-full h-45 md:h-40 object-cover rounded" />
        <img src="../../../public/img/imagen_1.jpg" alt="evento" class="w-full h-24 md:h-32 object-cover rounded" />
        <img src="../../../public/img/imagen_1.jpg" alt="evento" class="w-full h-24 md:h-32 object-cover rounded" />
        <img src="../../../public/img/imagen_1.jpg" alt="evento" class="w-full h-24 md:h-32 object-cover rounded" />
      </div>
    </div>
    <!-- Texto y botones a la derecha -->
    <div class="flex flex-col justify-center items-center w-full md:w-3/5 lg:w-2/3 shadow-md md:items-start md:pl-8">
      <article class="w-full p-2">
        <h1 class="text-3xl font-bold p-2 text-center md:text-left text-red-700">Eventos Especiales</h1>
        <p class="text-center md:text-left p-5 text-white">
          Ofrecemos el espacio perfecto para tus eventos sociales, corporativos o privados. Agenda con nosotros y convierte tu ocasión especial en una experiencia inolvidable.
        </p>
      </article>
      <div class="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 p-4 w-full">
        <router-link
          :to="{ name: 'Menu' }"
          class="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors duration-200 flex items-center justify-center shadow-md w-full sm:w-auto"
        >
          Menú
        </router-link>
        <router-link
          :to="{ name: 'Menu' }"
          class="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center shadow-md w-full sm:w-auto"
        >
          Menú
        </router-link>
      </div>
    </div>
  </section>
</template>