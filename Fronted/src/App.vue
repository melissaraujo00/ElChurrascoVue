<script setup>
import { ref, computed } from 'vue'
import NavBar from './components/NavBar.vue'
import Home from './components/Home.vue'
import Menu from './components/Menu.vue'
import Reserve from './components/Reserve.vue'
import Events from './components/Events.vue'
import Footer from './components/Footer.vue'

const routes = {
  '/': Home,
  '/menu': Menu,
  '/reserve': Reserve,
  '/events': Events,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || Home
})
</script>

<template>
  <NavBar />
  <component :is="currentView" />

  <Footer/>
</template>
