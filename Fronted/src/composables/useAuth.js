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
  // Si ya tenemos usuario autenticado, evitamos hacer petición
  if (isAuthenticated.value && user.value) return user.value

  try {
    const response = await fetch(`${API_URL}/login/profile`, {
      credentials: 'include'
    })

    if (response.ok) {
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await response.json()
        isAuthenticated.value = true
        user.value = data
        userRole.value = data.roles || 'user'

        await loadUserCartOnAuth()
        return data
      } else {
        console.error('Respuesta no es JSON:', await response.text())
        clearAuthState()
        return null
      }
    } else if (response.status === 401) {
      // Usuario no autenticado, limpiar estado y no hacer más peticiones
      clearAuthState()
      return null
    } else {
      // Otros errores HTTP
      console.error('Error HTTP al verificar auth:', response.status)
      clearAuthState()
      return null
    }
  } catch (error) {
    console.error('Error al verificar autenticación:', error)
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
      clearAuthState()
      
      // Recargar el estado global del carrito (si es necesario)
      const { useCart } = await import('@/composables/useCart.js')
      const { clearCart } = useCart()
      clearCart?.() // limpia el carrito si existe esa función

      // Redirigir a Menu sin recargar toda la página
      router.push({ name: 'Menu' })
      return true
    } else {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json()
        console.error('Error al cerrar sesión:', errorData.message)
      } else {
        const errorText = await response.text()
        console.error('Respuesta inesperada al cerrar sesión:', errorText)
      }
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