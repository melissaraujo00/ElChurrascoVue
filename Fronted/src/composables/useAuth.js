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

  // Función para limpiar el estado de autenticación
  const clearAuthState = () => {
    isAuthenticated.value = false
    user.value = null
    userRole.value = 'user'
    // Limpiar también el localStorage del carrito si es necesario
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
        clearAuthState()
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

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/login/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      })

      if (response.ok) {
        // Verificar el estado después del login exitoso
        await checkAuthStatus()
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, message: errorData.message }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      return { success: false, message: 'Error de conexión' }
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