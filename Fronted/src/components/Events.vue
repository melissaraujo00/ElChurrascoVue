<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import AddToCartModal from '@/components/AddToCartModal.vue'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const dishes = ref([])
const gallery = ref([])
const error = ref(null)
const currentIndex = ref(0)
const carouselContainer = ref(null)

// Variables para auto-play del carrusel
const autoPlayInterval = ref(null)
const isHovered = ref(false)
const autoPlayDelay = 4000 // 4 segundos

// Variables para la paginación de la galería (3 columnas x 2 filas = 6 imágenes por página)
const currentPage = ref(1)
const itemsPerPage = 6 // 3 columnas x 2 filas
const selectedImage = ref(null)
const showModal = ref(false)

const getDishes = async () => {
    try {
        const res = await fetch(`${API_URL}/dishes/`)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()
        dishes.value = data
    } catch (err) {
        error.value = err.message
        console.error("Error al cargar los productos:", err)
    }
}

const getGallery = async () => {
    try {
        const res = await fetch(`${API_URL}/gallery/`)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()
        gallery.value = data
    } catch (err) {
        error.value = err.message
        console.error("Error al cargar la galería:", err)
    }
}

onMounted(() => {
    getDishes()
    getGallery()
    // Iniciar auto-play después de cargar los datos
    setTimeout(() => {
        if (offerDishes.value.length > 1) {
            startAutoPlay()
        }
    }, 1000)
})

onUnmounted(() => {
    stopAutoPlay()
})

const offerDishes = computed(() => {
    return dishes.value.filter(dish => dish.offer && dish.offer.trim() !== '')
})

// Computed para la paginación de la galería
const totalPages = computed(() => {
    return Math.ceil(gallery.value.length / itemsPerPage)
})

const paginatedGallery = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return gallery.value.slice(start, end)
})

// Funciones de paginación estilo Menu.vue
const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

// Funciones del carrusel mejoradas con auto-play
const nextSlide = () => {
    if (offerDishes.value.length === 0) return
    
    if (currentIndex.value < offerDishes.value.length - 1) {
        currentIndex.value++
    } else {
        // Volver al inicio cuando llegue al final
        currentIndex.value = 0
    }
    scrollToCard()
}

const prevSlide = () => {
    if (offerDishes.value.length === 0) return
    
    if (currentIndex.value > 0) {
        currentIndex.value--
    } else {
       
        currentIndex.value = offerDishes.value.length - 1
    }
    scrollToCard()
}

const goToSlide = (index) => {
    currentIndex.value = index
    scrollToCard()
}

const scrollToCard = () => {
    if (carouselContainer.value) {
        const cardWidth = carouselContainer.value.children[0]?.offsetWidth || 300
        const gap = 16
        const scrollPosition = currentIndex.value * (cardWidth + gap)
        carouselContainer.value.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        })
    }
}


const startAutoPlay = () => {
    if (offerDishes.value.length <= 1) return
    
    autoPlayInterval.value = setInterval(() => {
        if (!isHovered.value) {
            nextSlide()
        }
    }, autoPlayDelay)
}

const stopAutoPlay = () => {
    if (autoPlayInterval.value) {
        clearInterval(autoPlayInterval.value)
        autoPlayInterval.value = null
    }
}

const handleMouseEnter = () => {
    isHovered.value = true
}

const handleMouseLeave = () => {
    isHovered.value = false
}


const openImageModal = (image) => {
    selectedImage.value = image
    showModal.value = true
}

const closeImageModal = () => {
    showModal.value = false
    selectedImage.value = null
}
</script>

<template>
    <div class="flex flex-col text-white">
        <!-- header -->
        <section class="inset-0 bg-gray-200">
            <div class="relative w-full h-60 sm:h-80">
                <img src="/img/bannerEvent.jpg" alt=""
                    class="absolute inset-0 w-full h-full object-cover object-[50%_10%] shadow-lg" />
                <div class="absolute inset-0 bg-gray-950/75"></div>
                <div class="absolute w-full inset-0 flex items-center justify-center">
                    <h2
                        class="text-lg sm:text-2xl md:text-4xl lg:text-5xl text-white font-bold text-center px-4 leading-tight">
                        Nuestros eventos y promociones
                    </h2>
                </div>
            </div>
        </section>
        
        <div class="w-[90%] h-px bg-white my-6 mx-auto"></div>

        <!-- Sección del carrusel -->
        <section class="p-4 flex flex-col items-center">
          <div class="flex items-center justify-between mb-6 w-full max-w-5xl mx-auto">
          <h3 class="text-2xl font-bold text-center w-full animate-scale-bounce">Platos en oferta</h3>
        </div>

          <!-- Contenedor del carrusel con controles -->
          <div 
            class="relative overflow-hidden w-full max-w-5xl mx-auto"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <!-- Botón anterior -->
            <button 
              v-if="offerDishes.length > 1"
              @click="prevSlide"
              class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Contenedor de tarjetas -->
            <div 
              ref="carouselContainer"
              class="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
              style="scrollbar-width: none; -ms-overflow-style: none;"
            >
              <div 
                v-for="dish in offerDishes" 
                :key="dish.id" 
                class="flex-shrink-0 w-80 bg-white text-black rounded-lg shadow-gray-500 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div class="relative h-48 overflow-hidden ">
                  <img 
                    :src="`${API_URL}${dish.imagen}`"
                    :alt="dish.nombre"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300 "
                    @error="$event.target.src = '/img/default-dish.jpg'"
                  />
                  <!-- Badge de oferta -->
                  <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold animate-pulse">
                    {{ dish.offer }}
                  </div>
                </div>
                <div class="p-4">
                  <h4 class="text-xl font-semibold mb-2 text-gray-800">{{ dish.nombre }}</h4>
                  <p class="text-gray-600 mb-3 text-sm line-clamp-2">{{ dish.descripcion }}</p>
                </div>
              </div>
            </div>

            <!-- Botón siguiente -->
            <button 
              v-if="offerDishes.length > 1"
              @click="nextSlide"
              class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Indicadores de posición mejorados -->
          <div v-if="offerDishes.length > 1" class="flex justify-center mt-6 gap-2">
            <div 
              v-for="(dish, index) in offerDishes" 
              :key="index"
              @click="goToSlide(index)"
              class="w-3 h-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-125"
              :class="index === currentIndex ? 'bg-red-500 scale-110' : 'bg-gray-400 hover:bg-gray-300'"
            ></div>
          </div>

          

          <!-- Mensaje si no hay ofertas -->
          <div v-if="offerDishes.length === 0" class="text-center py-8">
            <p class="text-gray-400">No hay platos en oferta disponibles en este momento.</p>
          </div>
        </section>

        <div class="w-[90%] h-px bg-white my-6 mx-auto"></div>

        <!-- Sección de galería -->
        <section class="p-4">
            <h3 class="text-2xl font-bold text-center mb-8">Galería de Fotos</h3>
            
            <!-- Mensaje si no hay imágenes -->
            <div v-if="gallery.length === 0" class="text-center py-12">
                <div class="text-gray-400">
                    <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-lg">No hay imágenes en la galería</p>
                </div>
            </div>

            <!-- Grid de galería - 3 columnas x 2 filas -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div 
                    v-for="image in paginatedGallery" 
                    :key="image._id"
                    class="group relative bg-gray-900 rounded-2xl shadow-[0_4px_10px_rgba(107,114,128,0.5)] overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                    @click="openImageModal(image)"
                >
                    <!-- Imagen con aspecto cuadrado -->
                    <div class="aspect-square overflow-hidden">
                        <img 
                            :src="`${API_URL}${image.imagen}`"
                            :alt="image.title"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            @error="$event.target.src = '/img/default-gallery.jpg'"
                        />
                    </div>
                    
                    <!-- Overlay con información -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40  flex items-end">
                        <div class="p-4 text-white  ">
                            <h4 class="text-lg font-semibold mb-1">{{ image.title }}</h4>
                            <p class="text-sm opacity-90 line-clamp-2">{{ image.description }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Controles de paginación estilo Menu.vue -->
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

        <!-- Modal para imagen ampliada -->
        <div v-if="showModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click="closeImageModal">
            <div class="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden" @click.stop>
                <button @click="closeImageModal" class="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 z-10">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <img :src="`${API_URL}${selectedImage.imagen}`" :alt="selectedImage.title" class="w-full h-auto max-h-[90vh] object-contain" />
                <div class="p-4 bg-white">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">{{ selectedImage.title }}</h3>
                    <p class="text-gray-600">{{ selectedImage.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Ocultar scrollbar pero mantener funcionalidad */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Animación para el badge de oferta */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: .7;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes scaleBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.animate-scale-bounce {
  animation: scaleBounce 1.5s ease-in-out infinite;
}

</style>