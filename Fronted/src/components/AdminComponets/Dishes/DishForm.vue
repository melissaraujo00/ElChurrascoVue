<script setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { watch, ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const API_URL = import.meta.env.VITE_API_URL;
const emit = defineEmits(['saved', 'cancel']);
const imagenFile = ref(null);
const especialidades = ref([]);

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({}),
  }
});

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/specialty`, {
      credentials: 'include'
    });
    especialidades.value = await res.json();
  } catch (error) {
    console.error('Error al cargar especialidades:', error);
  }
});

const validationSchema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio'),
  descripcion: yup.string(),
  precio: yup.number().min(0, 'El precio no puede ser negativo').required('El precio es obligatorio'),
  imagen: yup.string(),
  especialidad: yup.string().required('La especialidad es obligatoria'),
  imprescindible: yup.boolean(),
  offer: yup.string()
});

const { handleSubmit, errors, setValues } = useForm({
  validationSchema,
  initialValues: {
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: 0,
    especialidad: '',
    imprescindible: false,
    offer: ''
  }
});

const { value: nombre } = useField('nombre');
const { value: descripcion } = useField('descripcion');
const { value: precio } = useField('precio');
const { value: especialidad } = useField('especialidad');
const { value: imprescindible } = useField('imprescindible');
const { value: offer } = useField('offer');

watch(() => props.initialData, (data) => {
  if (data && Object.keys(data).length) {
    setValues({
      nombre: data.nombre || '',
      descripcion: data.descripcion || '',
      imagen: data.imagen || '',
      precio: data.precio || 0,
      especialidad: data.especialidad || '',
      imprescindible: data.imprescindible || false,
      offer: data.offer || ''
    });
  } else {
    setValues({
      nombre: '',
      descripcion: '',
      imagen: '',
      precio: 0,
      especialidad: '',
      imprescindible: false,
      offer: ''
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
    const url = `${API_URL}/dishes${isEdit ? `/${props.initialData._id}` : ''}`;
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

    if (!res.ok) {
      throw new Error(data.message || 'Error en la solicitud');
    }
    toast.success(isEdit ? 'Plato actualizado correctamente' : 'Plato creado correctamente');
    emit('saved');
  } catch (error) {
    toast.error(isEdit ? 'Plato actualizado correctamente' : 'Plato creado correctamente');
  }
});
</script>



<template>
  <div class="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
    <div class="bg-white rounded-xl w-full max-w-2xl shadow-xl overflow-hidden">
      <div class="p-4 sm:p-6 max-h-screen overflow-y-auto" style="scrollbar-width: none; -ms-overflow-style: none;">
        <h2 class="text-lg sm:text-xl text-black font-bold mb-4 text-center">
          {{ initialData && initialData._id ? 'Editar Plato' : 'Agregar Plato' }}
        </h2>
        
        <form @submit.prevent="onSubmit" class="w-full space-y-4">
          <!-- Nombre -->
          <div>
            <label for="nombre" class="block text-black mb-1 font-semibold text-sm">Nombre</label>
            <input v-model="nombre" id="nombre" name="nombre" type="text" placeholder="Ingrese el nombre"
              class="w-full p-2.5 rounded-md text-gray-800 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            <span class="text-xs text-red-500" v-if="errors.nombre">{{ errors.nombre }}</span>
          </div>

          <!-- Descripción -->
          <div>
            <label for="descripcion" class="block text-black mb-1 font-semibold text-sm">Descripción</label>
            <textarea v-model="descripcion" id="descripcion" name="descripcion" placeholder="Ingrese una descripción"
              rows="3" class="w-full p-2.5 rounded-md text-gray-800 text-sm resize-none bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"></textarea>
            <span class="text-xs text-red-500" v-if="errors.descripcion">{{ errors.descripcion }}</span>
          </div>

          <!-- Precio y Imagen en una fila en pantallas medianas y grandes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="precio" class="block text-black mb-1 font-semibold text-sm">Precio</label>
              <input v-model="precio" id="precio" name="precio" type="number" min="0" step="0.01" placeholder="0.00"
                class="w-full p-2.5 rounded-md text-gray-800 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300" />
              <span class="text-xs text-red-500" v-if="errors.precio">{{ errors.precio }}</span>
            </div>

            <div>
              <label for="imagen" class="block text-black mb-1 font-semibold text-sm">Imagen</label>
              <input id="imagen" name="imagen" type="file" accept="image/*" @change="onFileChange"
                class="w-full p-2.5 rounded-md text-gray-800 text-sm bg-gray-100 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
              <span class="text-xs text-red-500" v-if="errors.imagen">{{ errors.imagen }}</span>
            </div>
          </div>

          <!-- Especialidad -->
          <div>
            <label for="especialidad" class="block text-black mb-1 font-semibold text-sm">Especialidad</label>
            <select v-model="especialidad" id="especialidad" name="especialidad"
              class="w-full p-2.5 rounded-md text-gray-800 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
              <option value="" disabled>Seleccione una especialidad</option>
              <option v-for="esp in especialidades" :key="esp._id" :value="esp._id">
                {{ esp.nombre }}
              </option>
            </select>
            <span class="text-xs text-red-500" v-if="errors.especialidad">{{ errors.especialidad }}</span>
          </div>

          <!-- Checkbox y Oferta en una fila en pantallas medianas y grandes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div class="flex items-center gap-2 pt-6">
              <input type="checkbox" v-model="imprescindible" id="imprescindible" name="imprescindible"
                class="w-4 h-4 text-black rounded focus:ring-2 focus:ring-gray-300" />
              <label for="imprescindible" class="text-black font-medium text-sm">¿Es imprescindible?</label>
            </div>

            <div>
              <label for="offer" class="block text-black mb-1 font-semibold text-sm">Oferta</label>
              <input v-model="offer" id="offer" name="offer" type="text" placeholder="Ej: 2x1 en bebidas"
                class="w-full p-2.5 rounded-md text-gray-800 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300" />
              <span class="text-xs text-red-500" v-if="errors.offer">{{ errors.offer }}</span>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <button type="submit"
              class="flex-1 py-2.5 bg-black text-white rounded-md hover:bg-gray-700 transition duration-300 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
              {{ initialData && initialData._id ? 'Actualizar' : 'Guardar' }}
            </button>

            <button type="button" @click="emit('cancel')"
              class="flex-1 py-2.5 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>