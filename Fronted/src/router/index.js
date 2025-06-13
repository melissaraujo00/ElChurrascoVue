import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth' // <-- importante

// Importa tus componentes
import Home from '../components/Home.vue'
import Menu from '../components/Menu.vue'
import Reserve from '../components/Reserve.vue'
import Events from '../components/Events.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Cart from '../components/Cart.vue'
import Users from '@/components/AdminComponets/user/Users.vue'
import UserCreate from '@/components/AdminComponets/user/ModalCrearUsuario.vue'
import CrudSpecialities from "@/components/AdminComponets/Specialties/CrudSpecialities.vue"
import CrudReservations from "@/components/AdminComponets/Reservations/CrudReservations.vue"
import CrudDishes  from "@/components/AdminComponets/Dishes/CrudDishes.vue";


const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/menu', component: Menu, name: 'Menu' },
  { path: '/reserve', component: Reserve, name: 'Reserve' },
  { path: '/events', component: Events, name: 'Events' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/cart', component: Cart, name: 'Cart' },
  { path: '/user', component: Users, name: 'User', meta: { requiresAuth: true, role: 'admin' } },
  { path: '/user/create', component: UserCreate, name: 'UserCreate', meta: { requiresAuth: true, role: 'admin' } },
  { path: '/CrudSpecialities', component: CrudSpecialities, name: 'CrudSpecialities', meta: { requiresAuth: true, role: 'admin' } },
  { path: '/CrudReservations', component: CrudReservations, name: 'CrudReservations', meta: { requiresAuth: true, role: 'admin' } },
  { path: '/CrudDishes', component: CrudDishes, name: 'CrudDishes' , meta: { requiresAuth: true, role: 'admin' } },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🛡️ Protección de rutas
router.beforeEach(async (to, from, next) => {
  const { checkAuthStatus, isAuthenticated, userRole } = useAuth()

  // Verifica sesión si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      await checkAuthStatus()
    }

    if (!isAuthenticated.value) {
      // No autenticado, redirige a login
      return next({ name: 'Login' })
    }

    // Verifica rol si es necesario
    if (to.meta.role && userRole.value !== to.meta.role) {
      return next({ name: 'Menu' }) // o la ruta que quieras para usuarios sin permiso
    }
  }

  // Si no requiere autenticación, permite siempre
  next()
})


export default router
