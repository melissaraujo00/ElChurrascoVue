<script setup>
import ScrollGalery from './ScrollGalery.vue';
import CardMenu from './CardMenu.vue';
</script>

<template>
    <section class="flex flex-col md:flex-row bg-gray-200 gap-4 md:gap-8 p-4  mb-2">
      <cardMenu></cardMenu>
      <ScrollGalery></ScrollGalery>
    </section>
  </template>