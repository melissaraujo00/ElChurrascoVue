<script setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { watch, ref, onMounted } from 'vue';

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

    alert(data.message || (isEdit ? 'Plato actualizado correctamente' : 'Plato creado correctamente'));
    emit('saved');
  } catch (error) {
    console.error(error);
    alert('Ocurrió un error al guardar el plato.');
  }
});
</script>


<template>
    <div class="relative w-full col-span-2 overflow-hidden h-[800px]">
        <div class="absolute inset-0 flex flex-col items-center justify-center m-3 px-4">
            <div class="p-8 bg-white rounded-xl w-full max-w-[690px] h-auto flex flex-col shadow-xl mx-4 sm:mx-5">
                <h2 class="text-5xl text-black font-bold mb-8 mt-5 text-center">
                    {{ initialData && initialData._id ? 'Editar Plato' : 'Agregar Plato' }}
                </h2>
                <form @submit.prevent="onSubmit" class="w-full flex flex-col gap-6">
                    <div>
                        <label for="nombre" class="block text-black mb-1 font-semibold">Nombre</label>
                        <input v-model="nombre" id="nombre" name="nombre" type="text" placeholder="Ingrese el nombre"
                            class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100" />
                        <span class="text-sm text-red-500">{{ errors.nombre }}</span>
                    </div>

                    <div>
                        <label for="descripcion" class="block text-black mb-1 font-semibold">Descripción</label>
                        <textarea v-model="descripcion" id="descripcion" name="descripcion"
                            placeholder="Ingrese una descripción" rows="4"
                            class="w-full p-3 rounded-md text-gray-800 text-sm resize-none bg-gray-100"></textarea>
                        <span class="text-sm text-red-500">{{ errors.descripcion }}</span>
                    </div>

                    <div>
                        <label for="precio" class="block text-black mb-1 font-semibold">Precio</label>
                        <input v-model="precio" id="precio" name="precio" type="number" min="0"
                            placeholder="Ingrese el precio"
                            class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100" />
                        <span class="text-sm text-red-500">{{ errors.precio }}</span>
                    </div>

                    <input id="imagen" name="imagen" type="file" accept="image/*" @change="onFileChange"
                        class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100" />
                    <span class="text-sm text-red-500">{{ errors.imagen }}</span>

                    <div>
                        <label for="especialidad" class="block text-black mb-1 font-semibold">Especialidad</label>
                        <select v-model="especialidad" id="especialidad" name="especialidad"
                            class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100">
                            <option value="" disabled>Seleccione una especialidad</option>
                            <option v-for="esp in especialidades" :key="esp._id" :value="esp._id">
                                {{ esp.nombre }}
                            </option>
                        </select>
                        <span class="text-sm text-red-500">{{ errors.especialidad }}</span>
                    </div>

                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="imprescindible" id="imprescindible" name="imprescindible"
                            class="w-4 h-4 text-black rounded" />
                        <label for="imprescindible" class="text-black font-medium">¿Es imprescindible?</label>
                    </div>

                    <div>
                        <label for="offer" class="block text-black mb-1 font-semibold">Oferta</label>
                        <input v-model="offer" id="offer" name="offer" type="text" placeholder="Ej: 2x1 en bebidas"
                            class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100" />
                        <span class="text-sm text-red-500">{{ errors.offer }}</span>
                    </div>

                    <button type="submit"
                        class="w-full py-2 bg-black text-white rounded-md hover:bg-amber-400 transition duration-300 text-lg font-semibold">
                        {{ initialData && initialData._id ? 'Actualizar' : 'Guardar' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>
