<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import AddToCartModal from '@/components/AddToCartModal.vue'
import { useAuth } from '@/composables/useAuth.js' // Importar el composable
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()

// Usar el composable de autenticación
const { isAuthenticated, user, checkAuthStatus } = useAuth()

const dishes = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = 6
const activeFilter = ref("todos")

// Modal state
const showModal = ref(false)
const selectedDish = ref(null)
const quantity = ref(1)

// Notification state
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success') // 'success' o 'error'

const filteredDishes = computed(() => {
    if (activeFilter.value === "todos") return dishes.value
    return dishes.value.filter(dish => dish.type === activeFilter.value)
})

const paginatedDishes = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredDishes.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredDishes.value.length / itemsPerPage))

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

const getAlldishes = async () => {
    try {
        loading.value = true
        error.value = null

        const res = await fetch(`${API_URL}/dishes/`)

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()
        dishes.value = data
    } catch (err) {
        error.value = err.message
        console.error("Error al cargar los productos:", err)
    } finally {
        loading.value = false
    }
}

const openModal = (dish) => {
    selectedDish.value = dish
    quantity.value = 1
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedDish.value = null
    quantity.value = 1
}

const updateQuantity = (newQuantity) => {
    quantity.value = newQuantity
}

const addToCart = () => {
    // Si no está autenticado, mostrar notificación pero no agregar al carrito
    if (!isAuthenticated.value) {
        showNotification.value = true
        notificationMessage.value = 'Debes iniciar sesión para agregar productos al carrito'
        notificationType.value = 'error'
        setTimeout(() => {
            showNotification.value = false
        }, 4000)
        return
    }

    if (selectedDish.value) {
        const cartItem = {
            id: selectedDish.value._id,
            nombre: selectedDish.value.nombre,
            precio: selectedDish.value.precio,
            imagen: selectedDish.value.imagen,
            cantidad: quantity.value,
            total: selectedDish.value.precio * quantity.value
        }
        try {
            // Obtener carrito existente
            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
            const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id)
            
            if (existingItemIndex > -1) {
                // Si el item ya existe, actualizar cantidad y total
                existingCart[existingItemIndex].cantidad += cartItem.cantidad
                existingCart[existingItemIndex].total = existingCart[existingItemIndex].precio * existingCart[existingItemIndex].cantidad
            } else {
                // Si es un item nuevo, agregarlo al carrito
                existingCart.push(cartItem)
            }
            
            // Guardar carrito actualizado
            localStorage.setItem('cart', JSON.stringify(existingCart))
            
            // Mostrar notificación de éxito
            showSuccessNotification(`${cartItem.nombre} agregado al carrito!`, 'success')
            
            // Cerrar modal
            closeModal()
        } catch (error) {
            console.error('Error al agregar al carrito:', error)
            showSuccessNotification('Error al agregar al carrito', 'error')
        }
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

// Función corregida para redireccionar
const redirectToLogin = () => {
    router.push('/register')
}

onMounted(async () => {
    await checkAuthStatus() // Usar el método del composable
    await getAlldishes()
})
</script>

<template>
    <div class="flex flex-col text-white ">
        <!-- Header -->
        <section class="flex flex-col md:flex-row w-full text-white bg-black/10">
            <div class="flex items-center justify-start w-full md:w-1/2 p-6 ml-20%">
                <h1 class="text-2xl sm:text-3xl md:text-5xl font-bold tracking-wider leading-snug">
                    Echa un vistazo a nuestro menú gourmet
                </h1>
            </div>

            <div class="relative w-full md:w-70% h-60 sm:h-80 md:h-96 lg:h-[20rem] xl:h-[22rem]">
                <img src="../../public/img/imagenMenu.jpg" alt="Imagen negocio"
                    class="absolute inset-0 w-full h-full object-cover object-center z-0" />
                <div class="absolute inset-0 bg-gray-950/50 z-10"></div>
            </div>
        </section>

        <div class="w-[90%] h-px bg-white my-6 mx-auto"></div>

        <!-- Filtros -->
        <section>
            <h1 class="text-center text-4xl font-bold">¡Nuestros platillos imperdibles!</h1>

            <div class="flex flex-wrap gap-10 justify-center text-center text-white mt-10">
                <button
                    class="flex flex-col items-center space-y-1 transform transition duration-300 ease-in-out hover:scale-[1.15]"
                    @click="() => { activeFilter = 'todos'; currentPage = 1 }">
                    <img src="../../public/img/campanita.png" alt="Todos" class="w-10 h-10 ">
                    <span class="text-sm font-medium">Todos</span>
                </button>

                <button
                    class="flex flex-col items-center space-y-1 transform transition duration-300 ease-in-out hover:scale-[1.15]"
                    @click="() => { activeFilter = 'entradas'; currentPage = 1 }">
                    <img src="../../public/img/tenedor.png" alt="Entradas" class="w-10 h-10">
                    <span class="text-sm font-medium">Entradas</span>
                </button>

                <button
                    class="flex flex-col items-center space-y-1 transform transition duration-300 ease-in-out hover:scale-[1.15]"
                    @click="() => { activeFilter = 'plato fuerte'; currentPage = 1 }">
                    <img src="../../public/img/dosTenedores.png" alt="Platos Fuertes" class="w-10 h-10">
                    <span class="text-sm font-medium text-center">Platos Fuertes</span>
                </button>

                <button
                    class="flex flex-col items-center space-y-1 transform transition duration-300 ease-in-out hover:scale-[1.15]"
                    @click="() => { activeFilter = 'bebida'; currentPage = 1 }">
                    <img src="../../public/img/botellita.png" alt="Bebidas" class="w-10 h-10">
                    <span class="text-sm font-medium">Bebidas</span>
                </button>

                <button
                    class="flex flex-col items-center space-y-1 transform transition duration-300 ease-in-out hover:scale-[1.15]"
                    @click="() => { activeFilter = 'menu infantil'; currentPage = 1 }">
                    <img src="../../public/img/hamburguesita.png" alt="Menú infantil" class="w-10 h-10">
                    <span class="text-sm font-medium text-center">Menú infantil</span>
                </button>
            </div>
        </section>

        <!-- Listado de platillos -->
        <section class="mt-12 px-4">
            <div v-if="loading" class="text-center text-white">
                <div class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-2"></div>
                    <p>Cargando platillos...</p>
                </div>
            </div>

            <div v-else-if="error" class="text-center text-red-400">
                <p>Error al cargar platillos: {{ error }}</p>
                <button @click="getAlldishes()"
                    class="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                    Reintentar
                </button>
            </div>

            <div v-else-if="filteredDishes.length === 0" class="text-center text-white">
                <p>No hay platillos disponibles para este filtro</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
                <div v-for="dish in paginatedDishes" :key="dish._id"
                    class="flex flex-col bg-gray-900 text-white rounded-2xl shadow-[0_4px_10px_rgba(107,114,128,0.5)] overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer relative"
                    @click="openModal(dish)">
                    
                    <!-- Badge de "Inicia sesión" si no está autenticado -->
                    <div v-if="!isAuthenticated" class="absolute top-3 right-3 z-10">
                        <div class="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                            </svg>
                            Inicia sesión
                        </div>
                    </div>

                    <img :src="`${API_URL}${dish.imagen}`" :alt="dish.nombre"
                        class="w-full h-52 object-cover shadow-2xl" />
                    <div class="flex flex-col p-4 gap-2">
                        <h3 class="text-xl font-bold">{{ dish.nombre }}</h3>
                        <p class="text-lg text-white font-semibold text-right">
                            ${{ dish.precio?.toFixed(2) || "0.00" }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Controles de paginación -->
            <div v-if="totalPages > 1" class="flex justify-center items-center gap-6 mt-10">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="flex items-center px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                </button>

                <span class="text-white font-semibold">Página {{ currentPage }} de {{ totalPages }}</span>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="flex items-center px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                    Siguiente
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </section>

        <!-- Modal -->
        <AddToCartModal 
            :show="showModal" 
            :dish="selectedDish" 
            :quantity="quantity" 
            :isAuthenticated="isAuthenticated"
            @close="closeModal"
            @update:quantity="updateQuantity" 
            @add="addToCart" 
            @login="redirectToLogin" />

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
            <button v-if="notificationType === 'error'" @click="redirectToLogin" 
                class="mt-2 w-full bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm font-medium transition-colors">
                Ir a Iniciar Sesión
            </button>
        </div>
    </div>
</template>