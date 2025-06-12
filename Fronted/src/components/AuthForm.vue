<script setup>
import { ref, reactive, defineProps } from 'vue'
import { useRouter } from 'vue-router'
<<<<<<< HEAD
import { useAuth } from '@/composables/useAuth.js' // Importar el composable
=======
import { useAuthStore } from '@/stores/auth'
>>>>>>> 5e7101e42e7d3feb1bf4d3819bf224b9f37a7ce9
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()

// Usar el composable de autenticación
const { login, checkAuthStatus } = useAuth()

// Prop para determinar si es login o register
const props = defineProps({
  isLogin: Boolean
})

// Datos del formulario
const form = reactive({
  name: '',
  lastName: '',
  user: '',
  email: '',
  phone: '',
  password: ''
})

// Errores por campo
const formErrors = reactive({
  name: '',
  lastName: '',
  user: '',
  email: '',
  phone: '',
  password: ''
})

// Error general
const generalError = ref('')

// Validar campos
const validateForm = () => {
  Object.keys(formErrors).forEach((key) => formErrors[key] = '')
  generalError.value = ''
  let isValid = true

  if (!form.email.includes('@')) {
    formErrors.email = 'El correo no es válido'
    isValid = false
  }

  if (form.password.length < 8) {
    formErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    isValid = false
  }

  if (!props.isLogin) {
    if (!form.name.trim()) {
      formErrors.name = 'El nombre es obligatorio'
      isValid = false
    }

    if (!form.lastName.trim()) {
      formErrors.lastName = 'El apellido es obligatorio'
      isValid = false
    }

    if (!form.user.trim()) {
      formErrors.user = 'El nombre de usuario es obligatorio'
      isValid = false
    }

    if (!/^[0-9]{8,}$/.test(form.phone)) {
      formErrors.phone = 'El teléfono debe tener al menos 8 dígitos'
      isValid = false
    }
  }

  return isValid
}

// Enviar datos
const handleSubmit = async () => {
  const isValid = validateForm()
  if (!isValid) return

  try {
    if (props.isLogin) {
<<<<<<< HEAD
      // Usar el método login del composable
      const result = await login({
        email: form.email,
        password: form.password
      })
      
      if (result.success) {
        await router.push({ name: 'Menu' })
      } else {
        generalError.value = result.message || 'Error al iniciar sesión'
      }
=======
      const res = await axios.post(
        `${API_URL}/login/signin`,
        {
          email: form.email,
          password: form.password
        },
        { withCredentials: true }
    )
      const token = res.data.token
      if (token) authStore.login(token) // ✅ GUARDADO REACTIVO
      await router.push({ name: 'Menu' })
>>>>>>> 5e7101e42e7d3feb1bf4d3819bf224b9f37a7ce9
    } else {
      // Para registro, mantener la lógica original pero actualizar el estado después
      const res = await axios.post(`${API_URL}/login/register`, form)
      const token = res.data.token
<<<<<<< HEAD
      if (token) localStorage.setItem('token', token)

      // Después del registro exitoso, verificar el estado de autenticación
      await checkAuthStatus()
=======
      if (token) authStore.login(token) // ✅ GUARDADO REACTIVO
>>>>>>> 5e7101e42e7d3feb1bf4d3819bf224b9f37a7ce9
      await router.push({ name: 'Menu' })
    }
  } catch (err) {
    generalError.value = err.response?.data?.message || 'Ocurrió un error inesperado'
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-t from-neutral-900 to-red-800">
    <div class="flex flex-col md:flex-row bg-white/40 rounded-lg shadow-lg overflow-hidden shadow-amber-50">
      
      <!-- Columna izquierda: formulario -->
      <div class="flex items-center justify-center p-8 bg-white/40">
        <div class="w-72 sm:w-80 max-w-md">
          <h2 class="text-3xl font-bold mb-6 text-center">
            {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
          </h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            
            <!-- Solo en modo registro -->
            <div v-if="!isLogin" class="grid grid-cols-1 gap-2">
              <div>
                <label class="text-sm font-medium text-gray-950">Nombre</label>
                <input v-model="form.name" type="text"
                  class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white" />
                <p v-if="formErrors.name" class="text-red-600 text-sm">{{ formErrors.name }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-950">Apellido</label>
                <input v-model="form.lastName" type="text"
                  class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white" />
                <p v-if="formErrors.lastName" class="text-red-600 text-sm">{{ formErrors.lastName }}</p>
              </div>
            </div>

            <div v-if="!isLogin">
              <label class="text-sm font-medium text-gray-950">Usuario</label>
              <input v-model="form.user" type="text"
                class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white" />
              <p v-if="formErrors.user" class="text-red-600 text-sm">{{ formErrors.user }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-950">Correo</label>
              <input v-model="form.email" type="email"
                class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white" />
              <p v-if="formErrors.email" class="text-red-600 text-sm">{{ formErrors.email }}</p>
            </div>

            <div v-if="!isLogin">
              <label class="text-sm font-medium text-gray-950">Teléfono</label>
              <input v-model="form.phone" type="text"
                class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white" />
              <p v-if="formErrors.phone" class="text-red-600 text-sm">{{ formErrors.phone }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-950">Contraseña</label>
              <input v-model="form.password" type="password"
                class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white" />
              <p v-if="formErrors.password" class="text-red-600 text-sm">{{ formErrors.password }}</p>
            </div>

            <!-- Mostrar error general si existe -->
            <p v-if="generalError" class="text-sm text-red-600 text-center">{{ generalError }}</p>

            <button
              type="submit"
              class="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              {{ isLogin ? 'Iniciar sesión' : 'Registrarse' }}
            </button>

            <p class="text-sm text-center text-gray-600">
              {{ isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?' }}
              <router-link
                :to="{ name: isLogin ? 'Register' : 'Login' }"
                class="text-red-600 hover:underline"
              >
                {{ isLogin ? 'Regístrate' : 'Inicia sesión' }}
              </router-link>
            </p>
          </form>
        </div>
      </div>

      <!-- Imagen: misma altura que el formulario -->
      <div class="hidden md:flex items-stretch justify-center bg-white/40">
        <img
          src="/img/evento-3.jpg"
          alt="Auth background"
          class="object-cover h-full w-64 max-w-xs rounded-r-lg"
        />
      </div>
    </div>
  </div>
</template>
