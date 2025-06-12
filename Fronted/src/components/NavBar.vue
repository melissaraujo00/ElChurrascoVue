<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()

// Estado global de sesión
const isAuthenticated = ref(false)
const userRole = ref('user')
const userProfile = ref({ name: '', email: '' })  // <-- info del perfil

// Estado menú
const menuOpen = ref(false)
const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const userMenuOpen = ref(false)
const toggleUserMenu = () => { userMenuOpen.value = !userMenuOpen.value }
const closeUserMenu = () => { userMenuOpen.value = false }

// Menús por rol
const menus = {
  admin: [
    { label: 'Dashboard', path: 'Dashboard' },
    { label: 'Usuarios', path: 'Usuarios' },
    { label: 'Ajustes', path: 'Ajustes' }
  ],
  user: [
    { label: 'Inicio', path: 'Home' },
    { label: 'Menú', path: 'Menu' },
    { label: 'Reservar', path: 'Reserve' },
    { label: 'Eventos', path: 'Events' }
  ]
}
const menuItems = computed(() => menus[userRole.value] || menus.user)

// Función para comprobar sesión y obtener perfil
const checkAuth = async () => {
  try {
    const res = await fetch(`${API_URL}/login/profile`, {
      credentials: 'include' // importante para enviar cookies
    })
    if (res.ok) {
      const data = await res.json()
      isAuthenticated.value = true
      userRole.value = data.roles || 'user'
    } else {
      // No hacer res.json() si no es ok
      isAuthenticated.value = false
      userRole.value = 'user'
    }
  } catch (err) {
    isAuthenticated.value = false
    userRole.value = 'user'
    userProfile.value = { name: '', email: '' }
  }
}

// Al montar el componente comprobamos la sesión y perfil
onMounted(() => {
  checkAuth()
})

// Función logout
const logout = async () => {
  try {
    const res = await fetch(`${API_URL}/login/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    if (res.ok) {
      isAuthenticated.value = false
      userRole.value = 'user'
      userProfile.value = { name: '', email: '' }
      closeUserMenu()
      router.push({ name: 'Menu' })
    } else {
      const errorData = await res.json()
      console.error('Error logout:', errorData.message)
    }
  } catch (err) {
    console.error('Error logout:', err)
  }
}
</script>

<template>
  <nav class="bg-gradient-to-r from-black to-red-700 shadow-md px-4 py-3 flex justify-between items-center relative">
    <!-- Logo -->
    <div class="text-xl font-bold text-blue-600">
      <img src="/img/logochurrasco.png" alt="logo" class="w-25 h-15 mx-auto md:mx-0" />
    </div>

    <!-- Botón menú móvil -->
    <button @click="toggleMenu" class="md:hidden text-white z-30">
      <span v-if="!menuOpen">☰</span>
      <span v-else>✖</span>
    </button>

    <!-- Fondo oscuro menú móvil -->
    <div
      v-if="menuOpen"
      class="fixed inset-0 bg-black/70 z-20 md:hidden transition-opacity duration-300"
      @click="toggleMenu"
    ></div>

    <!-- Menú navegación -->
    <ul
      :class="[
        'md:flex md:space-x-6 md:static absolute left-0 w-full md:w-auto transition-all duration-300 ease-in z-30 bg-black md:bg-transparent',
        menuOpen ? 'top-16' : 'top-[-300px]'
      ]"
    >
      <li v-for="(item, index) in menuItems" :key="index" class="px-4 py-2 md:py-0">
        <router-link :to="{ name: item.path }" class="text-white hover:text-red-950 font-medium" @click="menuOpen = false">
          {{ item.label }}
        </router-link>
      </li>
    </ul>

    <!-- Acciones usuario -->
    <div class="flex items-center space-x-4">
      <div class="relative">
        <template v-if="isAuthenticated">
          <img
            src="/img/cuenta.png"
            alt="Usuario"
            class="w-10 h-10 cursor-pointer rounded-full"
            @click="toggleUserMenu"
          />
          <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow z-50 p-2">
            <p class="px-4 py-1 font-semibold border-b border-gray-300">
              {{ userProfile.name }}<br />
              <small class="text-gray-600">{{ userProfile.email }}</small>
            </p>
            <router-link to="/perfil" class="block px-4 py-2 hover:bg-gray-200" @click="closeUserMenu">
              Editar perfil
            </router-link>
            <button @click="logout" class="block w-full text-left px-4 py-2 hover:bg-gray-200">Cerrar sesión</button>
          </div>
        </template>
        <template v-else>
          <router-link :to="{ name: 'Login' }">
            <img src="/img/cuenta.png" alt="Login" class="w-10 h-10" />
          </router-link>
        </template>
      </div>

      <router-link :to="{ name: 'Cart' }">
        <img src="/img/carro-de-la-compra.png" alt="Carrito" class="w-8 h-8" />
      </router-link>
    </div>
  </nav>
</template>
