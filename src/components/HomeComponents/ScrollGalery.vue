
<script setup>
import { ref, onMounted, computed } from 'vue';

const galery = [
    { name: 'Tacos', imgURL: '/img/taco.jpg' },
    { name: 'Burritos', imgURL: '/img/burritos.jpg' },
    { name: 'Churrasco', imgURL: '/img/churrasco.jpg' },
    { name: 'Mexicano Mixto', imgURL: '/img/platillo1.jpg' },
    { name: 'Alambres', imgURL: '/img/alambre.jpg' },
    { name: 'Fajitas', imgURL: '/img/fajita.jpg' },
];

const scrollContainer = ref(null);
const cardWidth = ref(0);
const currentIndex = ref(0);
const maxIndex = computed(() => galery.length - 2);


//funcion para controlar el cambio de tamaño de las tarjetas de imagenes
onMounted(() => {
    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
});

//funcion para actualizar el tamaño de cada imagen y enfocar dos imagenes 
function updateCardWidth() {
    if (scrollContainer.value) {
        // Dividir el ancho del contenedor por 2 para mostrar exactamente 2 tarjetas
        const containerWidth = scrollContainer.value.clientWidth;
        cardWidth.value = containerWidth / 2;
    }
}

//funcion para hacer un scroll a la izquierda
const scrollLeft = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
        scrollToIndex();
    }
};

//scroll a la derecha
const scrollRight = () => {
    if (currentIndex.value < maxIndex.value) {
        currentIndex.value++;
        scrollToIndex();
    }
};

//funcion que maneja el desplasamiento del scroll para enfocar las dos imagenes
const scrollToIndex = () => {
    if (scrollContainer.value) {
        
        const scrollAmount = currentIndex.value * (cardWidth.value + 16); // 16px por el space-x-4
        scrollContainer.value.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
};
</script>

<template>
    <div class="relative w-full md:w-3/5 lg:w-2/3 px-5">
        <div ref="scrollContainer" class="overflow-x-auto pb-4 scrollbar-hide p-2">
            <button @click="scrollLeft"
                class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black hover:bg-black rounded-full p-2 shadow-md z-10 focus:outline-none transition-all duration-300"
                aria-label="Anterior">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div class="flex space-x-4 px-2">
                <div v-for="(item, index) in galery" :key="index"
                    :style="{ width: `${cardWidth}px` }"
                    class="overflow-hidden flex-shrink-0 flex flex-col p-2 shadow-md">
                    <div class="w-full">
                        <img :src="item.imgURL" :alt="item.name"
                            class="w-full h-40 sm:h-44 md:h-48 object-cover mb-4 rounded" />
                    </div>
                    <h2 class="text-lg md:text-xl font-medium ml-3">{{ item.name }}</h2>
                </div>
            </div>
        </div>

        <button @click="scrollRight"
            class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black hover:bg-black rounded-full p-2 shadow-md z-10 focus:outline-none transition-all duration-300"
            aria-label="Siguiente">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</template>

<!-- estilo para ocultar la borra de scroll horizontal -->
<style scoped>

.scrollbar-hide {
    -ms-overflow-style: none;
    
    scrollbar-width: none;
   
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
    
}
</style>