<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-xl font-bold mb-4 text-center text-red-700">Agregar Usuario</h2>
      <form @submit.prevent="crear" class="space-y-4">
        
        <!-- Nombre -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            id="name"
            v-model="form.name"
            placeholder="Nombre"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <!-- Apellido -->
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          <input
            id="lastName"
            v-model="form.lastName"
            placeholder="Apellido"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <!-- Usuario -->
        <div>
          <label for="user" class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <input
            id="user"
            v-model="form.user"
            placeholder="Usuario"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            placeholder="Correo electrónico"
            type="email"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <!-- Teléfono -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            id="phone"
            v-model="form.phone"
            placeholder="Teléfono"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <!-- Contraseña -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            placeholder="Contraseña"
            type="password"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <!-- Rol -->
        <div>
          <label for="roles" class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
          <select
            id="roles"
            v-model="form.roles"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          >
            <option value="" disabled>Selecciona un rol</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-2 mt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white font-semibold transition"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['close', 'usuario-creado'])
defineProps({ visible: Boolean })

const API_URL = import.meta.env.VITE_API_URL

const form = reactive({
  name: '',
  lastName: '',
  user: '',
  email: '',
  phone: '',
  password: '',
  roles: ''
})

function validarCampos() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.name || !form.lastName || !form.user || !form.email || !form.phone || !form.password || !form.roles) {
    alert('Todos los campos son obligatorios.')
    return false
  }

  if (!emailRegex.test(form.email)) {
    alert('El correo electrónico no es válido.')
    return false
  }

  if (form.password.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres.')
    return false
  }

  return true
}

async function crear() {
  if (!validarCampos()) return

  try {
    const res = await fetch(`${API_URL}/login/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    })

    if (res.ok) {
      emit('usuario-creado')
      emit('close')
    } else {
      alert('No se pudo crear el usuario.')
    }
  } catch (e) {
    alert('Error al crear usuario.')
  }
}
</script>
