<template>
  <section class="relative w-full h-auto border border-black shadow-md mb-2 overflow-hidden">
    <div class="relative w-full">
      <div class="absolute inset-0 bg-gray-950/70"></div>
      <img 
        src="../../../public/img/banner-home.jpg" 
        alt="Imagen negocio"
        class="w-full h-60 sm:h-80 md:h-[28rem] lg:h-[34rem] xl:h-[40rem] object-cover object-center"
      >
    </div>

    <div class="absolute inset-0 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
      <h2 class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-extrabold text-center mb-6 sm:mb-6 md:mb-8 max-w-4xl mx-auto leading-tight drop-shadow-lg">
        RESTAURANTE EL CHURRASCO
      </h2>
      <div class="w-full max-w-lg sm:max-w-lg md:max-w-xl lg:max-w-3xl mx-auto">
        <p class="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white text-center mb-6 sm:mb-8 md:mb-10 leading-relaxed drop-shadow">
          Sabor, frescura y momentos inolvidables
        </p>
      </div>
      <router-link
          :to="{ name: 'Register' }"
          class="bg-white text-black px-6 py-3 mt-4 rounded hover:bg-gray-200 transition-colors duration-200 text-lg sm:text-xl md:text-2xl font-bold shadow-white/50 shadow-md"
        >
          ¡Unite a la Familia!
        </router-link>

    </div>
  </section>
</template>