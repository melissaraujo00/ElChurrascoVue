<script setup>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-black">
    <NavBar />
    <router-view />
    <Footer />
  </div>
</template>