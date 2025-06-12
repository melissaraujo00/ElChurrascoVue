<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../../composables/useAuth.js'
import ModalAgregarUsuario from '../user/ModalCrearUsuario.vue'

const { checkAuthStatus, userRole } = useAuth()
const usuarios = ref([])
const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL
const textoBusqueda = ref('')
const mostrarModal = ref(false)

async function cargarUsuarios() {
  try {
    const response = await fetch(`${API_URL}/login/usuario`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const text = await response.text()
    try {
      const data = JSON.parse(text)
      usuarios.value = data
    } catch (err) {
      console.error('No es JSON válido:', err)
    }
  } catch (error) {
    console.error('Error al obtener los usuarios:', error)
  }
}

onMounted(async () => {
  const profile = await checkAuthStatus()
  if (!profile || userRole.value !== 'admin') {
    router.push({ name: 'Home' })
    return
  }
  await cargarUsuarios()
})

async function eliminarUsuario(id) {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return
  try {
    const response = await fetch(`${API_URL}/login/usuario/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.ok) {
      usuarios.value = usuarios.value.filter(u => u._id !== id)
    } else {
      alert('No se pudo eliminar el usuario.')
    }
  } catch (error) {
    alert('Error al eliminar el usuario.')
  }
}

const usuariosFiltrados = computed(() => {
  if (!textoBusqueda.value) return usuarios.value
  const texto = textoBusqueda.value.toLowerCase()
  return usuarios.value.filter(u =>
    (u.name && u.name.toLowerCase().includes(texto)) ||
    (u.lastName && u.lastName.toLowerCase().includes(texto)) ||
    (u.user && u.user.toLowerCase().includes(texto)) ||
    (u.email && u.email.toLowerCase().includes(texto)) ||
    (u.phone && u.phone.toLowerCase().includes(texto)) ||
    (u.roles && u.roles.toString().toLowerCase().includes(texto))
  )
})
</script>

<template>
  <div class="p-2 sm:p-4 text-gray-900 min-h-screen bg-neutral-950">
    <ModalAgregarUsuario
      :visible="mostrarModal"
      @close="mostrarModal = false"
      @usuario-creado="cargarUsuarios"
    />
    <div class="relative overflow-x-auto shadow-xl rounded-2xl bg-gray-300/80 max-w-7xl mx-auto p-2 m-2">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-3 px-2 sm:px-4 pt-4 gap-4">
        <h1 class="text-2xl sm:text-4xl font-extrabold mb-2 md:mb-6 text-center drop-shadow-lg">
          Gestión de Usuarios
        </h1>
        <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <input
            v-model="textoBusqueda"
            type="text"
            placeholder="Buscar usuario..."
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 w-full sm:w-auto"
          />
          <button
            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 w-full sm:w-auto"
            @click="mostrarModal = true"
          >
            Agregar Usuario
          </button>
        </div>
      </div>
      <div class="p-2 sm:p-4 shadow-inner rounded-b-2xl max-w-7xl mx-auto">
        <div class="overflow-x-auto">
          <table class="w-full text-xs sm:text-sm text-left text-white border border-gray-600 rounded-2xl overflow-hidden shadow-2xl min-w-[600px]">
            <thead class="text-xs uppercase bg-red-800 text-white">
              <tr>
                <th class="px-2 sm:px-5 py-2 sm:py-3">Nombre</th>
                <th class="px-2 sm:px-5 py-2 sm:py-3">Apellido</th>
                <th class="px-2 sm:px-5 py-2 sm:py-3">Usuario</th>
                <th class="px-2 sm:px-5 py-2 sm:py-3">Email</th>
                <th class="px-2 sm:px-5 py-2 sm:py-3">Teléfono</th>
                <th class="px-2 sm:px-5 py-2 sm:py-3">Rol</th>
                <th class="px-2 sm:px-5 py-2 sm:py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="usuario in usuariosFiltrados"
                :key="usuario._id"
                class="odd:bg-gray-300 even:bg-gray-200 border-b-gray-50 text-gray-950"
              >
                <td class="px-2 sm:px-5 py-2 sm:py-3">{{ usuario.name }}</td>
                <td class="px-2 sm:px-5 py-2 sm:py-3">{{ usuario.lastName }}</td>
                <td class="px-2 sm:px-5 py-2 sm:py-3">{{ usuario.user }}</td>
                <td class="px-2 sm:px-5 py-2 sm:py-3">{{ usuario.email }}</td>
                <td class="px-2 sm:px-5 py-2 sm:py-3">{{ usuario.phone }}</td>
                <td class="px-2 sm:px-5 py-2 sm:py-3">{{ usuario.roles }}</td>
                <td class="px-2 sm:px-5 py-2 sm:py-3">
                  <div class="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      class="text-white bg-red-700 hover:bg-red-800 font-semibold rounded-md px-4 sm:px-6 py-2 shadow-lg transition duration-300 border-2 border-red-600"
                      @click="eliminarUsuario(usuario._id)"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="usuariosFiltrados.length === 0">
                <td colspan="7" class="text-center py-4 text-gray-700">
                  No se encontraron usuarios.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
