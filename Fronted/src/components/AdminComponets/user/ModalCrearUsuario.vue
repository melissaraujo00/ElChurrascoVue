<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div class="bg-white/95 rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-red-200">
      <h2 class="text-2xl font-extrabold text-red-700 mb-2 text-center drop-shadow">Agregar Usuario</h2>
      <p class="text-center text-gray-600 mb-6">Completa los datos para crear un nuevo usuario</p>
      <form @submit.prevent="crear" class="space-y-4">
        <div v-if="errores.length" class="mb-2">
          <p v-for="(error, i) in errores" :key="i" class="text-red-600 text-sm font-semibold mb-1">{{ error }}</p>
        </div>
        <div class="w-full">
          <label for="name" class="block text-sm font-semibold text-gray-800 mb-1">Nombre</label>
          <input
            id="name"
            v-model.trim="form.name"
            placeholder="Nombre"
            class="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
            required
          />
        </div>
        <div class="w-full">
          <label for="lastName" class="block text-sm font-semibold text-gray-800 mb-1">Apellido</label>
          <input
            id="lastName"
            v-model.trim="form.lastName"
            placeholder="Apellido"
            class="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
            required
          />
        </div>
        <div>
          <label for="user" class="block text-sm font-semibold text-gray-800 mb-1">Usuario</label>
          <input
            id="user"
            v-model.trim="form.user"
            placeholder="Usuario"
            class="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
            required
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-800 mb-1">Correo electrónico</label>
          <input
            id="email"
            v-model.trim="form.email"
            placeholder="Correo electrónico"
            type="email"
            class="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
            required
          />
        </div>
        <div>
          <label for="phone" class="block text-sm font-semibold text-gray-800 mb-1">Teléfono</label>
          <input
            id="phone"
            v-model.trim="form.phone"
            placeholder="Teléfono"
            class="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-800 mb-1">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            placeholder="Contraseña"
            type="password"
            class="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
            required
          />
        </div>
        <div>
          <label for="roles" class="block text-sm font-semibold text-gray-800 mb-1">Rol</label>
          <select
            id="roles"
            v-model="form.roles"
            class="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
            required
          >
            <option value="" disabled>Selecciona un rol</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition shadow"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold transition shadow"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'

// Eventos personalizados
const emit = defineEmits(['close', 'usuario-creado'])
defineProps({ visible: Boolean })

const API_URL = import.meta.env.VITE_API_URL

// Formulario reactivo
const form = reactive({
  name: '',
  lastName: '',
  user: '',
  email: '',
  phone: '',
  password: '',
  roles: ''
})

// Lista de errores
const errores = ref([])

// Función para validar todos los campos del formulario
function validarCampos() {
  errores.value = [] // ✅ Limpiamos errores anteriores antes de validar

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Validación: campos obligatorios
  if (
    !form.name || !form.lastName || !form.user ||
    !form.email || !form.phone || !form.password || !form.roles
  ) {
    errores.value.push('Todos los campos son obligatorios.')
  }

  // Validación: email válido
  if (form.email && !emailRegex.test(form.email)) {
    errores.value.push('El correo electrónico no es válido.')
  }

  // Validación: contraseña mínima 6 caracteres
  if (form.password && form.password.length < 6) {
    errores.value.push('La contraseña debe tener al menos 6 caracteres.')
  }

  // Validación: teléfono mínimo 8 caracteres
  if (form.phone && form.phone.length < 8) {
    errores.value.push('El teléfono debe tener al menos 8 caracteres.')
  }

  // Si ya existe el error de email o phone duplicado (por backend), lo mantenemos
  if (errores.value.includes('El correo electrónico ya está registrado.')) {
    // Ya está en la lista
  }
  if (errores.value.includes('El teléfono ya está registrado.')) {
    // Ya está en la lista
  }

  return errores.value.length === 0
}

// Función para crear el usuario
async function crear() {
  errores.value = [] // ✅ Limpiamos errores antes de comenzar

  // Validación inicial
  if (!validarCampos()) return

  try {
    // Enviamos los datos al backend
    const res = await fetch(`${API_URL}/login/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form })
    })

    // ✅ Si se creó exitosamente
    if (res.ok) {
      emit('usuario-creado')
      emit('close')
      Object.keys(form).forEach(key => (form[key] = key === 'roles' ? '' : ''))
    } else {
      // ❌ Si hubo error desde el backend
      let data = {}
      try {
        data = await res.json()
      } catch (_) {
        // Si no se pudo parsear, mantenemos data vacío
      }

      if (data.message) {
        const mensaje = data.message.toLowerCase()

        if (mensaje.includes('email')) {
          errores.value.push('El correo electrónico ya está registrado.')
        }
        if (mensaje.includes('phone')) {
          errores.value.push('El teléfono ya está registrado.')
        }

        // Otro tipo de error
        if (!mensaje.includes('email') && !mensaje.includes('phone')) {
          errores.value.push(data.message || 'No se pudo crear el usuario.')
        }
      } else {
        errores.value.push('No se pudo crear el usuario.')
      }
    }
  } catch (e) {
    console.error('Error al crear usuario:', e) // Para depurar en consola
    errores.value.push('Error al crear usuario.') // Solo si fetch falla completamente
  }
}
</script>
