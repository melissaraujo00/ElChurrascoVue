<script setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { watch } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({}),
  }
});
const emit = defineEmits(['saved', 'cancel']);

const API_URL = import.meta.env.VITE_API_URL;

const validationSchema = yup.object({
  name: yup.string().required('El nombre es obligatorio').matches(/^[a-zA-Z\s]+$/, 'Solo se permiten letras y espacios'),
  peopleCount: yup
    .number()
    .transform((curr, orig) => orig === '' ? null : curr)
    .required('La cantidad de personas es obligatoria')
    .positive('Debe ser un número positivo')
    .integer('Debe ser un número entero'),
  date: yup
    .date()
    .transform((curr, orig) => orig === '' ? null : curr)
    .required('La fecha es obligatoria')
    .min(new Date(), 'La fecha debe ser futura'),
  hour: yup.string().required('La hora es obligatoria'),
  contactEmail: yup.string().required('El contacto es obligatorio').email('Debe ser un correo válido'),
  additionalInfo: yup.string().nullable()
});

const { handleSubmit, errors, setValues } = useForm({
  validationSchema,
  initialValues: {
    name: '',
    peopleCount: '',
    date: '',
    hour: '',
    contactEmail: '',
    additionalInfo: ''
  }
});

const { value: name } = useField('name');
const { value: peopleCount } = useField('peopleCount');
const { value: date } = useField('date');
const { value: hour } = useField('hour');
const { value: contactEmail } = useField('contactEmail');
const { value: additionalInfo } = useField('additionalInfo');

watch(() => props.initialData, (newData) => {
  if (newData && Object.keys(newData).length) {
    setValues({
      name: newData.nombre || '',
      peopleCount: newData.numeroPersonas || '',
      date: newData.fecha ? newData.fecha.slice(0, 10) : '',
      hour: newData.hora || '',
      contactEmail: newData.contactos || '',
      additionalInfo: newData.datosAdicionales || ''
    });
  } else {
    setValues({
      name: '',
      peopleCount: '',
      date: '',
      hour: '',
      contactEmail: '',
      additionalInfo: ''
    });
  }
}, { immediate: true });

const onSubmit = handleSubmit(async (formValues) => {
  try {
    if (props.initialData && props.initialData._id) {
      const response = await axios.put(`${API_URL}/reservations/${props.initialData._id}`, {
        nombre: formValues.name,
        numeroPersonas: formValues.peopleCount,
        fecha: formValues.date,
        hora: formValues.hour,
        contactos: formValues.contactEmail,
        datosAdicionales: formValues.additionalInfo
      });
      toast.success('Reservacion actualizada correctamente');
    } else {
      const response = await axios.post(`${API_URL}/reservations`, {
        nombre: formValues.name,
        numeroPersonas: formValues.peopleCount,
        fecha: formValues.date,
        hora: formValues.hour,
        contactos: formValues.contactEmail,
        datosAdicionales: formValues.additionalInfo
      });
      toast.success('Reservacion guardada correctamente');
    }

    emit('saved');
  } catch (error) {
    console.error(error);
    alert('Ocurrió un error al guardar la reservación.');
  }
});
</script>
<template>
  <div class="relative w-full col-span-2 overflow-hidden h-[800px] rounded-2xl">
    <div class="absolute inset-0 flex flex-col items-center justify-center m-3 px-4">
      <div class="p-8 bg-white rounded-xl w-full max-w-[690px] h-auto flex flex-col shadow-xl mx-4 sm:mx-5">
        <h2 class="text-3xl text-black font-bold mb-8 mt-5 text-center">
          {{ initialData && initialData._id ? 'Editar Reservación' : 'Agregar Reservación' }}
        </h2>
        <form @submit.prevent="onSubmit" class="w-full flex flex-col gap-6">
          <div>
            <label for="name" class="block text-black mb-1 font-semibold">Nombre</label>
            <input v-model="name" id="name" name="name" type="text" placeholder="Ingrese su nombre"
              class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100" />
            <span class="text-sm text-red-500">{{ errors.name }}</span>
          </div>

          <div>
            <label for="peopleCount" class="block text-black mb-1 font-semibold">Número de personas</label>
            <input v-model="peopleCount" id="peopleCount" name="peopleCount" type="number" min="1" placeholder="7"
              class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100" />
            <span class="text-sm text-red-500">{{ errors.peopleCount }}</span>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 min-w-0">
              <label for="date" class="block text-black mb-1 font-semibold">Fecha</label>
              <input v-model="date" id="date" name="date" type="date"
                class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100" />
              <span class="text-sm text-red-500">{{ errors.date }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <label for="hour" class="block text-black mb-1 font-semibold">Hora</label>
              <input v-model="hour" id="hour" name="hour" type="time"
                class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100" />
              <span class="text-sm text-red-500">{{ errors.hour }}</span>
            </div>
          </div>

          <div>
            <label for="contactEmail" class="block text-black mb-1 font-semibold">Contacto</label>
            <input v-model="contactEmail" id="contactEmail" name="contactEmail" type="text"
              placeholder="ejemplo@ejemplo.com" class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100" />
            <span class="text-sm text-red-500">{{ errors.contactEmail }}</span>
          </div>

          <div>
            <label for="additionalInfo" class="block text-black mb-1 font-semibold">Datos Adicionales (Opcional)</label>
            <textarea v-model="additionalInfo" id="additionalInfo" name="additionalInfo" placeholder="Comentario..."
              rows="4" class="w-full p-3 rounded-md text-gray-800 text-sm resize-none bg-gray-100"></textarea>
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
