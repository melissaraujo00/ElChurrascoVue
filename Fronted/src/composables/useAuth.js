// composables/useAuth.js
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const API_URL = import.meta.env.VITE_API_URL

  const checkAuthStatus = async () => {
    if (authStore.isAuthenticated && authStore.user) return authStore.user

    try {
      const response = await fetch(`${API_URL}/login/profile`, { credentials: 'include' })

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        authStore.setAuth(data)
        await loadUserCartOnAuth()
        return data
      } else {
        authStore.clearAuth()
        return null
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error)
      authStore.clearAuth()
      return null
    }
  }

  const loadUserCartOnAuth = async () => {
    try {
      const { useCart } = await import('@/composables/useCart.js')
      const { loadUserCart, migrateTemporaryCart } = useCart()
      migrateTemporaryCart()
      loadUserCart()
    } catch (error) {
      console.log('Error al cargar carrito del usuario:', error)
    }
  }

  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/login/logout`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        authStore.clearAuth()

        const { useCart } = await import('@/composables/useCart.js')
        const { clearCart } = useCart()
        clearCart?.()

        router.push({ name: 'Menu' })
        return true
      } else {
        const msg = await response.text()
        console.error('Error al cerrar sesión:', msg)
        return false
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      return false
    }
  }

  const login = async (token) => {
    if (token) {
      await checkAuthStatus()
    }
  }

async function updateProfile(data) {
  const response = await fetch(`${API_URL}/login/actualizarUsuarioLogeado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })

  if (!response.ok) throw new Error('Error al actualizar el perfil')

  // Refrescar datos del usuario y actualizar el store
  const updated = await checkAuthStatus()
  return updated
}




  return {
    isAuthenticated: computed(() => authStore.isAuthenticated),
    user: computed(() => authStore.user),
    userRole: computed(() => authStore.userRole),
    checkAuthStatus,
    updateProfile,
    logout,
    login
  }
}
