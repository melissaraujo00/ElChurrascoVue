// composables/useCart.js
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth.js'

const cart = ref([])

export function useCart() {
  const { user, isAuthenticated } = useAuth()

  // Generar clave única para el carrito del usuario
  const getCartKey = () => {
    if (!isAuthenticated.value || !user.value) return null
    return `cart_${user.value._id || user.value.id}`
  }

  // Cargar carrito del usuario desde localStorage
  const loadUserCart = () => {
    const cartKey = getCartKey()
    if (!cartKey) {
      cart.value = []
      return
    }

    try {
      const savedCart = localStorage.getItem(cartKey)
      cart.value = savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error('Error al cargar carrito del usuario:', error)
      cart.value = []
    }
  }

  // Guardar carrito del usuario en localStorage
  const saveUserCart = () => {
    const cartKey = getCartKey()
    if (!cartKey) return

    try {
      localStorage.setItem(cartKey, JSON.stringify(cart.value))
    } catch (error) {
      console.error('Error al guardar carrito del usuario:', error)
    }
  }

  // Agregar producto al carrito
  const addToCart = (product) => {
    if (!isAuthenticated.value) {
      throw new Error('Debes iniciar sesión para agregar productos al carrito')
    }

    const existingItemIndex = cart.value.findIndex(item => item.id === product.id)
    
    if (existingItemIndex > -1) {
      // Si el producto ya existe, actualizar cantidad
      cart.value[existingItemIndex].cantidad += product.cantidad
      cart.value[existingItemIndex].total = 
        cart.value[existingItemIndex].precio * cart.value[existingItemIndex].cantidad
    } else {
      // Si es nuevo, agregar al carrito
      cart.value.push({
        ...product,
        total: product.precio * product.cantidad
      })
    }

    saveUserCart()
  }

  // Remover producto del carrito
  const removeFromCart = (productId) => {
    const index = cart.value.findIndex(item => item.id === productId)
    if (index > -1) {
      cart.value.splice(index, 1)
      saveUserCart()
    }
  }

  // Actualizar cantidad de producto
  const updateQuantity = (productId, newQuantity) => {
    const item = cart.value.find(item => item.id === productId)
    if (item && newQuantity > 0) {
      item.cantidad = newQuantity
      item.total = item.precio * newQuantity
      saveUserCart()
    }
  }

  // Limpiar carrito
  const clearCart = () => {
    cart.value = []
    const cartKey = getCartKey()
    if (cartKey) {
      localStorage.removeItem(cartKey)
    }
  }

  // Limpiar carritos de otros usuarios (opcional - para limpieza)
  const cleanOldCarts = () => {
    const currentCartKey = getCartKey()
    const keysToRemove = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('cart_') && key !== currentCartKey) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
  }

  // Migrar carrito temporal (si existe uno sin usuario)
  const migrateTemporaryCart = () => {
    const tempCart = localStorage.getItem('cart')
    if (tempCart && isAuthenticated.value) {
      try {
        const tempItems = JSON.parse(tempCart)
        if (tempItems.length > 0) {
          // Agregar items del carrito temporal al carrito del usuario
          tempItems.forEach(item => {
            addToCart(item)
          })
          // Limpiar carrito temporal
          localStorage.removeItem('cart')
        }
      } catch (error) {
        console.error('Error al migrar carrito temporal:', error)
      }
    }
  }

  // Computed properties
  const cartItems = computed(() => cart.value)
  const cartTotal = computed(() => 
    cart.value.reduce((total, item) => total + item.total, 0)
  )
  const cartItemsCount = computed(() => 
    cart.value.reduce((count, item) => count + item.cantidad, 0)
  )

  return {
    // Estado
    cartItems,
    cartTotal,
    cartItemsCount,
    
    // Métodos
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadUserCart,
    saveUserCart,
    migrateTemporaryCart,
    cleanOldCarts
  }
}