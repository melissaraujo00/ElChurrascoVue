<script setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
const toast = useToast();

const API_URL = import.meta.env.VITE_API_URL;
const emit = defineEmits(['saved', 'close']);
const imagenFile = ref(null);

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({}),
  }
});

const validationSchema = yup.object({
  title: yup.string().required('El título es obligatorio'),
  description: yup.string().required('La descripción es obligatoria'),
  imagen: yup.string()
});

const { handleSubmit, errors, setValues } = useForm({
  validationSchema,
  initialValues: {
    title: '',
    description: '',
    imagen: ''
  }
});

const { value: title } = useField('title');
const { value: description } = useField('description');

watch(() => props.initialData, (data) => {
  if (data && Object.keys(data).length) {
    setValues({
      title: data.title || '',
      description: data.description || '',
      imagen: data.imagen || ''
    });
  } else {
    setValues({
      title: '',
      description: '',
      imagen: ''
    });
  }
}, { immediate: true });

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    imagenFile.value = file;
  }
}

const onSubmit = handleSubmit(async (formValues) => {
  try {
    const isEdit = props.initialData && props.initialData._id;
    const url = `${API_URL}/gallery${isEdit ? `/${props.initialData._id}` : ''}`;
    const method = isEdit ? 'PUT' : 'POST';

    const formData = new FormData();
    for (const key in formValues) {
      if (key !== 'imagen') {
        formData.append(key, formValues[key]);
      }
    }

    if (imagenFile.value) {
      formData.append('imagen', imagenFile.value);
    }


    const res = await fetch(url, {
      method,
      body: formData,
      credentials: 'include'
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Error en la solicitud');
    toast.success(isEdit ? 'Evento actualizado correctamente' : 'Evento creado correctamente');
    emit('saved');
  } catch (error) {
    console.error(error);
    toast.error(isEdit ? 'Error al actualizar el evento' : 'Error al crear el evento');
  }
});
</script>

<template>
  <div class="relative w-full col-span-2 overflow-hidden h-[600px]">
    <div class="absolute inset-0 flex flex-col items-center justify-center m-3 px-4">
      <div class="p-8 bg-white rounded-xl w-full max-w-[600px] h-[600px] flex flex-col shadow-xl ">
        <h2 class="text-3xl text-black font-bold mb-6 mt-3 text-center">
          {{ initialData && initialData._id ? 'Editar Galería' : 'Agregar Galería' }}
        </h2>
        <form @submit.prevent="onSubmit" class="w-full flex flex-col gap-6">
          <div>
            <label for="title" class="block text-black mb-1 font-semibold">Título</label>
            <input v-model="title" id="title" name="title" type="text" placeholder="Ingrese el título"
              class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100" />
            <span class="text-sm text-red-500">{{ errors.title }}</span>
          </div>

          <div>
            <label for="description" class="block text-black mb-1 font-semibold">Descripción</label>
            <textarea v-model="description" id="description" name="description" rows="4"
              placeholder="Ingrese una descripción"
              class="w-full p-3 rounded-md text-gray-800 text-sm resize-none bg-gray-100"></textarea>
            <span class="text-sm text-red-500">{{ errors.description }}</span>
          </div>

          <div>
            <label for="imagen" class="block text-black mb-1 font-semibold">Imagen</label>
            <input id="imagen" name="imagen" type="file" accept="image/*" @change="onFileChange"
              class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100" />
            <span class="text-sm text-red-500">{{ errors.imagen }}</span>
          </div>

         <div class="flex gap-4">
            <button type="submit"
              class="w-1/2 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition duration-300 text-lg font-semibold">
              {{ initialData && initialData._id ? 'Actualizar' : 'Guardar' }}
            </button>

            <button type="button" @click="emit('cancel')"
              class="w-1/2 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300 text-lg font-semibold">
              Cancelar
            </button>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>
