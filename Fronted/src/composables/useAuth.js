// composables/useAuth.js
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Estado global compartido
const isAuthenticated = ref(false)
const user = ref(null)
const userRole = ref('user')

const API_URL = import.meta.env.VITE_API_URL

export function useAuth() {
  const router = useRouter()

  // Función para verificar el estado de autenticación
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/login/profile`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        isAuthenticated.value = true
        user.value = data
        userRole.value = data.roles || 'user'
        
        // Después de verificar autenticación, cargar carrito del usuario
        await loadUserCartOnAuth()
        
        return data
      } else {
        // Si la respuesta no es ok, limpiar el estado
        clearAuthState()
        return null
      }
    } catch (error) {
      console.log('Error al verificar autenticación:', error)
      clearAuthState()
      return null
    }
  }

  // Función para cargar carrito cuando se autentica
  const loadUserCartOnAuth = async () => {
    try {
      // Importar dinámicamente para evitar dependencias circulares
      const { useCart } = await import('@/composables/useCart.js')
      const { loadUserCart, migrateTemporaryCart } = useCart()
      
      // Migrar carrito temporal si existe
      migrateTemporaryCart()
      
      // Cargar carrito del usuario
      loadUserCart()
    } catch (error) {
      console.log('Error al cargar carrito del usuario:', error)
    }
  }

  // Función para limpiar el estado de autenticación
  const clearAuthState = () => {
    isAuthenticated.value = false
    user.value = null
    userRole.value = 'user'
    
    // Ya no limpiar TODO el localStorage, solo el carrito genérico
    localStorage.removeItem('cart')
  }

  // Función para cerrar sesión
  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/login/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        // El carrito del usuario se mantiene en localStorage con su clave única
        clearAuthState()
        window.location.href = '/menu' 
        router.push({ name: 'Menu' })
        return true
      } else {
        const errorData = await response.json()
        console.error('Error al cerrar sesión:', errorData.message)
        return false
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      return false
    }
  }

  // Función para iniciar sesión (usando token directamente)
  const login = (token) => {
    if (token) {
      // Aquí podrías guardar el token si lo necesitas
      // Para este caso, simplemente verificamos el estado
      checkAuthStatus()
    }
  }

  // Computed properties
  const isLoggedIn = computed(() => isAuthenticated.value)
  const currentUser = computed(() => user.value)
  const currentUserRole = computed(() => userRole.value)

  return {
    // Estado
    isAuthenticated: isLoggedIn,
    user: currentUser,
    userRole: currentUserRole,
    
    // Métodos
    checkAuthStatus,
    clearAuthState,
    logout,
    login
  }
}