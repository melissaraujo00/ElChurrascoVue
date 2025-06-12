<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const cartItems = ref([])
const user = ref(null)
const isAuthenticated = ref(false)
const showModal = ref(false)

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success')

// Datos del formulario de entrega
const deliveryForm = ref({
    direccion: '',
    contacto: '',
    indicaciones: ''
})

const loadCart = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    cartItems.value = storedCart
}

const checkAuthStatus = async () => {
    try {
        const response = await axios.get('http://localhost:3000/login/profile', {
            withCredentials: true
        })

        if (response.data) {
            isAuthenticated.value = true
            user.value = response.data
        }
    } catch (error) {
        console.log('Usuario no autenticado:', error)
        isAuthenticated.value = false
        user.value = null
    }
}

const totalCarrito = computed(() => {
    return cartItems.value.reduce((acc, item) => acc + item.total, 0)
})

const removeFromCart = (id) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id)
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

const openModal = () => {
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    // Limpiar formulario al cerrar
    deliveryForm.value = {
        direccion: '',
        contacto: '',
        indicaciones: ''
    }
}

 const showSuccessNotification = (message, type = 'success') => {
    notificationMessage.value = message
    notificationType.value = type
    showNotification.value = true
    setTimeout(() => {
        showNotification.value = false
    }, 3000)
}

const procesarCompra = async () => {
    // Validar que todos los campos requeridos estén llenos
    if (!deliveryForm.value.direccion || !deliveryForm.value.contacto) {
        alert('Por favor, completa todos los campos requeridos.')
        return
    }

    // Validar que el usuario esté autenticado
    if (!isAuthenticated.value || !user.value) {
        alert('Debes iniciar sesión para realizar una compra.')
        return
    }

    try {
        // Transformar los items del carrito al formato esperado por el backend
        const carritoFormateado = cartItems.value.map(item => ({
            dish: item.id, // Asumiendo que item.id es el ObjectId del plato
            cantidad: item.cantidad,
            precioUnitario: item.precio
        }))

        // Crear el objeto de datos para enviar al servidor
        const pedidoData = {
            cliente: {
                id: user.value.id || user.value._id, // Usar el ID del usuario autenticado
                name: user.value.name || user.value.nombre
            },
            carrito: carritoFormateado,
            direccion: deliveryForm.value.direccion,
            total: totalCarrito.value,
            indicaciones: deliveryForm.value.indicaciones,
            contacto: deliveryForm.value.contacto

        }

        console.log('Enviando pedido:', pedidoData)

        // Enviar la petición POST al servidor
        const response = await axios.post('http://localhost:3000/orders/', pedidoData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })


        cartItems.value = []
        localStorage.removeItem('cart')
        
        // Cerrar modal
        closeModal()
        showSuccessNotification('¡Pedido realizado con éxito!')

    } catch (error) {
        console.error('Error al procesar la compra:', error)

        // Mostrar mensaje de error más específico
        if (error.response) {
            alert(`Error del servidor: ${error.response.data.message || 'Error desconocido'}`)
        } else if (error.request) {
            alert('No se pudo conectar con el servidor. Verifica tu conexión.')
        } else {
            alert('Error al procesar el pedido. Inténtalo de nuevo.')
        }
    }

}

onMounted(async () => {
    loadCart()
    await checkAuthStatus()
})
</script>

<template>
    <div class="p-6 text-white">
        <h1 class="text-3xl font-bold mb-6">Tu carrito de compras</h1>

        <div v-if="cartItems.length === 0"
            class="text-gray-300 w-full h-80 text-3xl font-bold flex justify-center items-center">
            Tu carrito está vacío.
        </div>

        <div v-else class="space-y-4">
            <div v-for="item in cartItems" :key="item.id"
                class="bg-gray-100/20 rounded-lg p-4 flex justify-between items-center">
                <div class="flex items-center space-x-4">
                    <img :src="`http://localhost:3000${item.imagen}`" alt="Producto"
                        class="w-20 h-20 object-cover rounded-md">
                    <div>
                        <h2 class="text-lg font-semibold">{{ item.nombre }}</h2>
                        <p class="text-sm">Cantidad: {{ item.cantidad }}</p>
                        <p class="text-sm">Precio unitario: ${{ item.precio }}</p>
                        <p class="text-sm font-bold">Total: ${{ item.total }}</p>
                    </div>
                </div>
                <button @click="removeFromCart(item.id)" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
                    Eliminar
                </button>
            </div>

            <div class="text-right text-xl font-bold mt-6">
                <h1> Total a pagar: ${{ totalCarrito.toFixed(2) }}</h1>

                <button @click="openModal" class="bg-gray-600 hover:bg-gray-700 px-3 rounded transition-colors my-3">
                    Comprar
                </button>
            </div>
        </div>

        <!-- Notificaciones -->
        <div v-if="showNotification"
            :class="[
                'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 text-white',
                notificationType === 'success' ? 'bg-green-600' : 'bg-red-600'
            ]">
            <div class="flex items-center">
                <svg v-if="notificationType === 'success'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                </svg>
                <svg v-else class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ notificationMessage }}
            </div>
           
        </div>

        <!-- Modal de información de entrega -->
        <div v-if="showModal" class="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-white">Información de Entrega</h2>
                    <button @click="closeModal" class="text-gray-400 hover:text-white text-2xl">×</button>
                </div>

                <form @submit.prevent="procesarCompra" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">
                            Dirección de Entrega *
                        </label>
                        <textarea v-model="deliveryForm.direccion" required
                            class="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3" placeholder="Ingresa tu dirección completa..."></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">
                            Teléfono de Contacto *
                        </label>
                        <input v-model="deliveryForm.contacto" type="tel" required
                            class="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Número de teléfono...">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">
                            Indicaciones Adicionales
                        </label>
                        <textarea v-model="deliveryForm.indicaciones"
                            class="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3" placeholder="Referencias, indicaciones especiales, etc..."></textarea>
                    </div>

                    <div class="bg-gray-700 p-3 rounded-md">
                        <p class="text-xl font-bold text-white">Total: ${{ totalCarrito.toFixed(2) }}</p>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button type="button" @click="closeModal"
                            class="flex-1 bg-red-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors">
                            Cancelar
                        </button>
                        <button type="submit"
                            class="flex-1 bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors">
                            Confirmar Pedido
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>