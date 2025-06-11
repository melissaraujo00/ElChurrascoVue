<script setup>
import { ref, reactive, defineProps } from 'vue'
import axios from 'axios'

// Prop para determinar si es login o register
const props = defineProps({
  isLogin: Boolean
})

const form = reactive({
  name: '',
  lastName: '',
  user: '',
  email: '',
  phone: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    if (props.isLogin) {
      const res = await axios.post('http://localhost:3000/login/signin', {
        email: form.email,
        password: form.password
      })
      alert('Login exitoso')
      console.log(res.data)
    } else {
      const res = await axios.post('http://localhost:3000/login/register', form)
      alert('Registro exitoso')
      console.log(res.data)
    }
  } catch (err) {
    alert('Error: ' + (err.response?.data?.message || err.message))
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
            <div v-if="!isLogin" class="grid grid-cols-1 ">
              <div>
                <label class="text-sm font-medium text-gray-950">Nombre</label>
                <input v-model="form.name" type="text" required
                  class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white" />
                  <label class="text-sm font-medium text-gray-950">Apellido</label>
                <input v-model="form.lastName" type="text" required
                  class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white" />
              </div>
              <div>
                
              </div>
            </div>

            <div v-if="!isLogin">
              <label class="text-sm font-medium text-gray-950">Usuario</label>
              <input v-model="form.user" type="text" required
                class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white" />
            </div>

            <div>
              <label class="text-sm font-medium text-gray-950">Correo</label>
              <input v-model="form.email" type="email" required
                class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white" />
            </div>

            <div v-if="!isLogin">
              <label class="text-sm font-medium text-gray-950">Teléfono</label>
              <input v-model="form.phone" type="text" required minlength="8"
                class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white" />
            </div>

            <div>
              <label class="text-sm font-medium text-gray-950">Contraseña</label>
              <input v-model="form.password" type="password" required minlength="8"
                class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 bg-white" />
            </div>

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




