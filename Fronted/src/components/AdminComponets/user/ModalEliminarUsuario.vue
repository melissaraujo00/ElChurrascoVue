<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div class="bg-white/95 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-red-200 text-center">
      <h2 class="text-2xl font-extrabold text-red-700 mb-2 drop-shadow">¿Eliminar Usuario?</h2>
      <p class="mb-6 text-gray-700">Esta acción no se puede deshacer.<br>¿Estás seguro que deseas eliminar este usuario?</p>
      <div class="flex justify-center gap-4 mt-4">
        <button
          @click="$emit('close')"
          class="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition shadow"
        >
          Cancelar
        </button>
        <button
          @click="confirmar"
          class="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold transition shadow"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close', 'confirmar'])

const props = defineProps({
  visible: Boolean,
  usuario: Object
})

function confirmar() {
  // Emitir el ID del usuario al componente padre
  emit('confirmar', props.usuario._id)
  emit('close')
}
</script>


