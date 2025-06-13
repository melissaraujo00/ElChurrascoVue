<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-center">
      <h2 class="text-xl font-bold mb-4">¿Eliminar Usuario?</h2>
      <p class="mb-4">Esta acción no se puede deshacer.</p>
      <div class="flex justify-center gap-4">
        <button @click="$emit('close')" class="btn btn-cancel">Cancelar</button>
        <button @click="confirmar" class="btn btn-confirm">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close', 'confirmar'])
defineProps({
  visible: Boolean
})

function confirmar() {
  emit('confirmar')
  emit('close')
}
</script>

