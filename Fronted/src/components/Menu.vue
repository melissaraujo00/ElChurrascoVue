<script setup>
import { ref, onMounted, computed } from "vue"

const dishes = ref([])
const loading = ref(true)
const error = ref(null)

const currentPage = ref(1)
const itemsPerPage = 6

const activeFilter = ref("todos")


const filteredDishes = computed(() => {
    if (activeFilter.value === "todos") return dishes.value
    return dishes.value.filter(dish => dish.tipo === activeFilter.value)
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
        const res = await fetch("http://localhost:3000/dishes/")
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()
        dishes.value = data
        error.value = null
    } catch (err) {
        error.value = err.message
        console.error("Error al cargar los productos:", err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    getAlldishes()
})
</script>

<template>
    <div class="flex flex-col text-white">
        <!-- Header -->
        <section class="flex flex-col md:flex-row w-full text-white">
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
                    <img src="../../public/img/campanita.png" alt="Todos" class="w-10 h-10">
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
                <p>Cargando platillos...</p>
            </div>

            <div v-else-if="error" class="text-center text-red-400">
                <p>Error al cargar platillos: {{ error }}</p>
                <button @click="getAlldishes()" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
                    Reintentar
                </button>
            </div>

            <div v-else-if="filteredDishes.length === 0" class="text-center text-white">
                <p>No hay platillos disponibles</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
                <div v-for="dish in paginatedDishes" :key="dish._id"
                    class="flex flex-col bg-gray-900 text-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                    <img :src="`http://localhost:3000${dish.imagen}`" :alt="dish.nombre"
                        class="w-full h-52 object-cover" />
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
    </div>
</template>
