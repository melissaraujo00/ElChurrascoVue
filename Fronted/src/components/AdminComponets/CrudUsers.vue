<script setup>
import { ref, computed, onMounted } from 'vue';
const API_URL = import.meta.env.VITE_API_URL;

const usuarios = ref([])
const textoBusqueda = ref('')

onMounted(async () => {
    try {
        const respuesta = await fetch(`${API_URL}/login`)
        if (!respuesta.ok) {
            throw new Error('Error al obtener los usuarios')
        }
        const datos = await respuesta.json();
        usuarios.value = datos;
        console.log(usuarios.value);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        console.log(usuarios.value);
    }
})

const usuariosFiltrados = computed(() => {
    if (!textoBusqueda.value.trim()) {
        return usuarios.value
    }
    const busqueda = textoBusqueda.value.toLowerCase()
    return usuarios.value.filter(u =>
        u.name.toLowerCase().includes(busqueda) ||
        u.lastName.toLowerCase().includes(busqueda) ||
        u.user.toLowerCase().includes(busqueda)
    )
})
</script>


<template>
    <div class="p-6 text-gray-900">
        <div class="relative overflow-x-auto shadow-xl rounded-2xl bg-gray-300 max-w-[108rem] mx-auto p-2 m-2">
            <div class="flex justify-between items-center mb-3 px-4 pt-4">
                <h1 class="text-4xl font-extrabold mb-6 text-center drop-shadow-lg ">
                    Gestión de Usuarios
                </h1>
                <div class="flex items-center gap-4">
                    <input v-model="textoBusqueda" type="text" placeholder="Buscar usuario..."
                        class="px-3 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900" />
                    <button
                        class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300">
                        Agregar
                    </button>
                </div>
            </div>
            <div class="bg-gray-300 p-4 shadow-inner rounded-b-2xl max-w-7xl mx-auto">
                <table
                    class="w-full text-sm text-left text-white border border-gray-600 rounded-2xl overflow-hidden shadow-2xl">
                    <thead class="text-xs uppercase bg-red-800 text-white">
                        <tr>
                            <th class="px-5 py-3">Nombre</th>
                            <th class="px-5 py-3">Apellido</th>
                            <th class="px-5 py-3">Usuario</th>
                            <th class="px-5 py-3">Email</th>
                            <th class="px-5 py-3">Teléfono</th>
                            <th class="px-5 py-3">Rol</th>
                            <th class="px-5 py-3">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="usuario in usuariosFiltrados" :key="usuario._id"
                            class="odd:bg-gray-300 even:bg-gray-200 border-b-gray-50 text-gray-950">
                            <td class="px-5 py-3">{{ usuario.name }}</td>
                            <td class="px-5 py-3">{{ usuario.lastName }}</td>
                            <td class="px-5 py-3">{{ usuario.user }}</td>
                            <td class="px-5 py-3">{{ usuario.email }}</td>
                            <td class="px-5 py-3">{{ usuario.phone }}</td>
                            <td class="px-5 py-3">{{ usuario.roles.join(', ') }}</td>
                            <td class="px-5 py-3">
                                <div class="flex gap-3">
                                    <button type="button"
                                        class="text-white bg-orange-600 hover:bg-orange-700 font-medium text-sm rounded-md px-5 py-1.5 shadow-md transition duration-200 border-2 border-orange-500">
                                        Editar
                                    </button>

                                    <button type="button"
                                        class="text-white bg-red-700 hover:bg-red-800 font-semibold rounded-md px-6 py-2 shadow-lg transition duration-300 border-2 border-red-600">
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
</template>
