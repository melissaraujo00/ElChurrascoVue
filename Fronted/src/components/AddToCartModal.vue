<script setup>
import { computed } from 'vue'
const API_URL = import.meta.env.VITE_API_URL;

const props = defineProps({
    show: Boolean,
    dish: Object,
    quantity: Number,
    isAuthenticated: Boolean
})

const emit = defineEmits(['close', 'update:quantity', 'add', 'login'])

const closeModal = () => {
    emit('close')
}

const updateQuantity = (newQuantity) => {
    emit('update:quantity', newQuantity)
}

const increaseQuantity = () => {
    emit('update:quantity', props.quantity + 1)
}

const decreaseQuantity = () => {
    if (props.quantity > 1) {
        emit('update:quantity', props.quantity - 1)
    }
}

const addToCart = () => {
    emit('add')
}

const handleLogin = () => {
    emit('login')
}

const totalPrice = computed(() => {
    return props.dish ? (props.dish.precio * props.quantity).toFixed(2) : '0.00'
})
</script>

<template>
    <!-- Modal Backdrop -->
    <div v-if="show" @click="closeModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        
        <!-- Modal Content -->
        <div @click.stop
            class="bg-gray-900 text-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            
            <!-- Header -->
            <div class="relative">
                <img v-if="dish" :src="`${API_URL}${dish.imagen}`" :alt="dish.nombre"
                    class="w-full h-48 object-cover rounded-t-2xl" />
                
                <!-- Close Button -->
                <button @click="closeModal"
                    class="absolute top-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="p-6">
                <!-- Title and Price -->
                <div class="mb-4">
                    <h2 class="text-2xl font-bold mb-2">{{ dish?.nombre }}</h2>
                    <p class="text-2xl font-semibold text-green-400">${{ dish?.precio?.toFixed(2) || '0.00' }}</p>
                </div>


                <!-- Quantity Selector -->
                <div class="mb-6">
                    <label class="block text-lg font-semibold mb-3">Cantidad</label>
                    <div class="flex items-center gap-4">
                        <button @click="decreaseQuantity" :disabled="quantity <= 1"
                            class="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                            </svg>
                        </button>
                        
                        <span class="text-xl font-semibold w-8 text-center">{{ quantity }}</span>
                        
                        <button @click="increaseQuantity"
                            class="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>


                <!-- Auth Warning (if not authenticated) -->
                <div v-if="!isAuthenticated" class="mb-4 p-3 bg-blue-600/20 border border-blue-500 rounded-lg">
                    <div class="flex items-center mb-2">
                        <svg class="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                        <span class="text-blue-200 font-medium">Inicia sesión requerido</span>
                    </div>
                    <p class="text-blue-300 text-sm">Para agregar productos al carrito necesitas iniciar sesión primero.</p>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <button @click="closeModal"
                        class="flex-1 px-4 py-3 border border-gray-600 hover:border-gray-500 text-white rounded-lg font-medium transition-colors">
                        Cancelar
                    </button>
                    
                    <!-- Add to Cart Button (cuando está autenticado) -->
                    <button v-if="isAuthenticated" @click="addToCart"
                        class="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h11.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                        </svg>
                        Agregar al Carrito
                    </button>
                    
                    <!-- Login Button (cuando NO está autenticado) -->
                    <button v-else @click="handleLogin"
                        class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>