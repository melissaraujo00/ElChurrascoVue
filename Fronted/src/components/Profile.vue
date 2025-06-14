<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-red-900 to-red-700 flex items-center justify-center py-8">
    <div class="bg-white/90 rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center">
      <img
        src="/img/cuenta.png"
        alt="Foto de perfil"
        class="w-28 h-28 rounded-full border-4 border-red-700 shadow mb-4 object-cover"
      />
      <h2 class="text-2xl font-bold text-red-700 mb-1">{{ user.name || 'Usuario' }}</h2>
      <p class="text-gray-700 mb-4">{{ user.email }}</p>
      <div class="w-full space-y-3">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-800 w-28">Nombre:</span>
          <span class="text-gray-700">{{ user.name }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-800 w-28">Apellido:</span>
          <span class="text-gray-700">{{ user.lastName }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-800 w-28">Usuario:</span>
          <span class="text-gray-700">{{ user.user }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-800 w-28">Teléfono:</span>
          <span class="text-gray-700">{{ user.phone }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-800 w-28">Rol:</span>
          <span class="text-red-700 font-semibold capitalize">{{ user.roles }}</span>
        </div>
      </div>
      <button
        class="mt-8 bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        @click="editarPerfil"
      >
        Editar Perfil
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth.js'
import { useRouter } from 'vue-router'

const { checkAuthStatus, user } = useAuth()
const router = useRouter()

onMounted(async () => {
  await checkAuthStatus()
})

function editarPerfil() {
  // Puedes redirigir a un formulario de edición o abrir un modal
  router.push({ name: 'ProfileEdit' }) // Cambia 'ProfileEdit' por la ruta de edición si la tienes
}
</script>