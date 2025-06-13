<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'

const { user, checkAuthStatus, updateProfile } = useAuth()
const router = useRouter()

const form = ref({
  name: '',
  lastName: '',
  user: '',
  email: '',
  phone: ''
})

onMounted(async () => {
  await checkAuthStatus()
  form.value = {
    name: user.value?.name || '',
    lastName: user.value?.lastName || '',
    user: user.value?.user || '',
    email: user.value?.email || '',
    phone: user.value?.phone || ''
  }
})

async function guardarCambios() {
  try {
    await updateProfile(form.value)
    await router.push({ name: 'Profile' })
  } catch (e) {
    alert('No se pudo actualizar el perfil.')
  }
}

function cancelar() {
  router.push({ name: 'Profile' })
}
</script>


<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-red-900 to-red-700 flex items-center justify-center py-8">
    <div class="bg-white/95 rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-red-200">
      <h2 class="text-3xl font-extrabold text-red-700 mb-2 text-center drop-shadow">Editar Perfil</h2>
      <p class="text-center text-gray-600 mb-6">Actualiza tus datos personales</p>
      <form @submit.prevent="guardarCambios" class="space-y-5">
        <div class="w-full">
            <label class="block text-gray-800 font-semibold mb-1">Nombre</label>
            <input v-model="form.name" type="text"
              class="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
              required />
          </div>
        <div class="w-full">
            <label class="block text-gray-800 font-semibold mb-1">Apellido</label>
            <input v-model="form.lastName" type="text"
              class="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
              required />
          </div>
        <div>
          <label class="block text-gray-800 font-semibold mb-1">Usuario</label>
          <input v-model="form.user" type="text"
            class="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
            required />
        </div>
        <div>
          <label class="block text-gray-800 font-semibold mb-1">Correo electrónico</label>
          <input v-model="form.email" type="email"
            class="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
            required />
        </div>
        <div>
          <label class="block text-gray-800 font-semibold mb-1">Teléfono</label>
          <input v-model="form.phone" type="text"
            class="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
            required />
        </div>
        <div class="flex justify-end gap-3 mt-8">
          <button type="button"
            @click="cancelar"
            class="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition shadow"
          >
            Cancelar
          </button>
          <button type="submit"
            class="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold transition shadow"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

