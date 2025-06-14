<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth.js'
import { useRoute } from 'vue-router'
import { useCart } from '@/composables/useCart.js'


const { isAuthenticated, user, userRole, checkAuthStatus, logout } = useAuth()
const { cartItems, cartTotal, cartItemsCount, loadUserCart } = useCart()

const menuOpen = ref(false)
const toggleMenu = () => { menuOpen.value = !menuOpen.value }

const userMenuOpen = ref(false)
const toggleUserMenu = () => { userMenuOpen.value = !userMenuOpen.value }
const closeUserMenu = () => { userMenuOpen.value = false }

const userMenuRef = ref(null) // 👈 ref al menú de usuario

const menus = {
  admin: [
    { label: 'Inicio', path: 'Home' },
    { label: 'Menú', path: 'Menu' },
    { label: 'Reservar', path: 'Reserve' },
    { label: 'Eventos', path: 'Events' },
    { label: 'Usuarios', path: 'User' },
    { label: 'Especialidades', path: 'CrudSpecialities' },
    { label: 'Reservaciones', path: 'CrudReservations' },
    { label: 'Platillos', path: 'CrudDishes' }
  ],
  user: [
    { label: 'Inicio', path: 'Home' },
    { label: 'Menú', path: 'Menu' },
    { label: 'Reservar', path: 'Reserve' },
    { label: 'Eventos', path: 'Events' }
  ]
}

const menuItems = computed(() => menus[userRole.value] || menus.user)
const route = useRoute()

const handleLogout = async () => {
  const success = await logout()
  if (success) closeUserMenu()
}

watch(isAuthenticated, (newValue) => {
  if (newValue) {
    loadUserCart()
  }
})

onMounted(async () => {
  await checkAuthStatus()
  if (isAuthenticated.value) {
    loadUserCart()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

function handleOutsideClick(event) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    closeUserMenu()
  }
}
</script>


<template>
  <nav class="bg-gradient-to-r from-black to-red-700 shadow-md px-4 py-3 flex justify-between items-center relative"
    @click="closeFromNavbar">
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
    <div v-if="menuOpen" class="fixed inset-0 bg-black/70 z-20 md:hidden transition-opacity duration-300"
      @click="toggleMenu"></div>

    <!-- Menú navegación -->
    <ul :class="[
      'md:flex md:space-x-6 md:static absolute left-0 w-full md:w-auto transition-all duration-300 ease-in z-30 bg-black md:bg-transparent',
      menuOpen ? 'top-16' : 'top-[-300px]'
    ]">
      <li v-for="(item, index) in menuItems" :key="index" class="px-4 py-2 md:py-0 hover:scale-120 transition-trasnform duration-300">
        <router-link :to="{ name: item.path }" @click="menuOpen = false" :class="[
          'relative text-white font-medium transition-transform duration-200',
          route.name === item.path
            ? 'after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-white'
            : '',

        ]">
          {{ item.label }}
        </router-link>
      </li>
    </ul>

    <!-- Acciones usuario -->
    <div class="flex items-center space-x-4">
      <div class="relative  " ref="userMenuRef">
        <template v-if="isAuthenticated">
          <img src="/img/cuenta.png" alt="Usuario"
            class="w-10 h-10 cursor-pointer rounded-full hover:scale-120 transition-trasnform duration-300"
            @click="toggleUserMenu" />
          <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow z-50 p-2">
            <p class="px-4 py-1 font-semibold border-b border-gray-300">
              {{ user?.name || 'Usuario' }}<br />
              <small class="text-gray-600">{{ user?.email || '' }}</small>
            </p>
            <router-link :to="{ name: 'Profile' }" class="block px-4 py-2 hover:bg-gray-200" @click="closeUserMenu">
              Editar perfil
            </router-link>
            <button @click="handleLogout" class="block w-full text-left px-4 py-2 hover:bg-gray-200">Cerrar
              sesión</button>
          </div>
        </template>
        <template v-else>
          <router-link :to="{ name: 'Login' }">
            <img src="/img/cuenta.png" alt="Login" class="w-10 h-10" />
          </router-link>
        </template>
      </div>

      <div class="relative hover:scale-110 transition-trasnform duration-300">
        <router-link :to="{ name: 'Cart' }">
          <img src="/img/carro-de-la-compra.png" alt="Carrito" class="w-8 h-8 " />
          <span v-if="cartItems.length > 0"
            class="absolute -top-2 -right-2 bg-white text-black text-[10px] font-semibold px-1.5 py-px rounded-full shadow">
            {{ cartItems.length }}
          </span>
        </router-link>
      </div>

    </div>
  </nav>
</template>
