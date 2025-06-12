<script setup>
import { ref } from 'vue'

const paginas = ref([
  { page: 'Inicio', name: 'Home' },
  { page: 'Menú', name: 'Menu' },
  { page: 'Reservar', name: 'Reserve' },
  { page: 'Eventos', name: 'Events' },
])


import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth.js' // Importar el composable

// Usar el composable de autenticación
const { isAuthenticated, user, userRole, checkAuthStatus, logout } = useAuth()

// Estado menú
const menuOpen = ref(false)
const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const userMenuOpen = ref(false)
const toggleUserMenu = () => { userMenuOpen.value = !userMenuOpen.value }
const closeUserMenu = () => { userMenuOpen.value = false }

// Menús por rol
const menus = {
  admin: [
    { label: 'User', path: 'User' },

  ],
  user: [
    { label: 'Inicio', path: 'Home' },
    { label: 'Menú', path: 'Menu' },
    { label: 'Reservar', path: 'Reserve' },
    { label: 'Eventos', path: 'Events' }
  ]
}
const menuItems = computed(() => menus[userRole.value] || menus.user)

// Función logout mejorada
const handleLogout = async () => {
  const success = await logout()
  if (success) {
    closeUserMenu()
  }
}

// Al montar el componente comprobamos la sesión
onMounted(() => {
  checkAuthStatus()
})
</script>

<template>
<header class="relative w-full ">
  <nav class=" text-white p-4 bg-linear-65 from-black to-red-700">
    <ul class="flex flex-col md:flex-row md:justify-between items-center text-center space-y-4 md:space-y-0">
      <li class="font-bold text-lg">
        <img src="/img/logochurrasco.png" alt="logo classico" class="w-25 h-15 mx-auto md:mx-0 ">
      </li>
    
      <li>
          <ul class="flex space-x-4">
            <li v-for="pagina in paginas" :key="pagina.name" class="hover:bg-gray-100 hover:text-black p-2">
              <router-link :to="{ name: pagina.name }" class="transition-colors duration-200">
                {{ pagina.page }}
              </router-link>
            </li>
            <button >
                <router-link :to="{name: 'Login'}" class="transition-colors duration-200">
                  <img src="/img/cuenta.png" alt="" class="w-12 h-12">
                </router-link>
            </button>
            <button>
                <router-link :to="{name: 'Cart'}" >
                  <img src="/img/carro-de-la-compra.png" alt="" class="w-8 h-8">
                </router-link>
            </button>
        </ul>
      </li>
    </ul>
  </nav>
</header>  
</template>
