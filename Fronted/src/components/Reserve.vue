<script setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;


const schema = yup.object({
  name: yup
    .string()
    .required('El nombre es obligatorio')
    .matches(/^[a-zA-Z\s]+$/, 'Solo se permiten letras y espacios'),
  people: yup
    .number()
    .required('Este campo es obligatorio')
    .min(1, 'Debe ser al menos 1 persona'),
  date: yup
    .date()
    .required('La fecha es obligatoria')
    .min(new Date(), 'La fecha debe ser futura'),
  hour: yup.string().required('La hora es obligatoria'),
  contacts: yup
    .string()
    .required('El contacto es obligatorio')
    .email('Debe ser un correo válido'),
  additional: yup.string().nullable()
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema
});


const { value: name } = useField('name');
const { value: people } = useField('people');
const { value: date } = useField('date');
const { value: hour } = useField('hour');
const { value: contacts } = useField('contacts');
const { value: additional } = useField('additional');


const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await axios.post('${API_URL}/reservations', {
      nombre: values.name,
      numeroPersonas: values.people,
      fecha: values.date,
      hora: values.hour,
      contactos: values.contacts,
      datosAdicionales: values.additional
    });

    alert(response.data.message);

    name.value = '';
    people.value = '';
    date.value = '';
    hour.value = '';
    contacts.value = '';
    additional.value = '';
  } catch (error) {
    console.error(error);
    alert('Ocurrió un error al enviar la reserva.');
  }
});
</script>

<template>
  <div class="relative w-full col-span-2 overflow-hidden h-[800px]">
    <img class="w-full h-full object-cover blur-xs" src="/img/bannerReservation.jpg" alt="">
    <div class="absolute inset-0 bg-gray-950/65"></div>

    <div class="absolute inset-0 flex flex-col items-center justify-center m-3 px-4">
      <h2 class="text-5xl text-white font-bold mb-8 mt-5 text-center">Haz tú Reservación</h2>

      <div class="p-8 bg-white/20 backdrop-blur-md rounded-xl w-full max-w-[690px] h-auto flex flex-col shadow-xl mx-4 sm:mx-5">
        <form @submit.prevent="onSubmit" class="w-full flex flex-col gap-6">
          <div>
            <label for="name" class="block text-white mb-1 font-semibold">Nombre</label>
            <input v-model="name" id="name" name="name" type="text" placeholder="Ingrese su nombre"
              class="w-full p-3 rounded-md text-black text-sm bg-white" />
            <span class="text-sm text-red-500">{{ errors.name }}</span>
          </div>

          <div>
            <label for="people" class="block text-white mb-1 font-semibold">Número de personas</label>
            <input v-model="people" id="people" name="people" type="number" min="1" placeholder="7"
              class="w-full p-3 rounded-md text-black text-sm bg-white" />
            <span class="text-sm text-red-500">{{ errors.people }}</span>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 min-w-0">
              <label for="date" class="block text-white mb-1 font-semibold">Fecha</label>
              <input v-model="date" id="date" name="date" type="date"
                class="w-full p-3 rounded-md text-black text-sm bg-white" />
              <span class="text-sm text-red-500">{{ errors.date }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <label for="hour" class="block text-white mb-1 font-semibold">Hora</label>
              <input v-model="hour" id="hour" name="hour" type="time"
                class="w-full p-3 rounded-md text-black text-sm bg-white" />
              <span class="text-sm text-red-500">{{ errors.hour }}</span>
            </div>
          </div>

          <div>
            <label for="contacts" class="block text-white mb-1 font-semibold">Contacto</label>
            <input v-model="contacts" id="contacts" name="contacts" type="text" placeholder="ejemplo@ejemplo.com"
              class="w-full p-3 rounded-md text-black text-sm bg-white" />
            <span class="text-sm text-red-500">{{ errors.contacts }}</span>
          </div>

          <div>
            <label for="additional" class="block text-white mb-1 font-semibold">Datos Adicionales (Opcional)</label>
            <textarea v-model="additional" id="additional" name="additional" placeholder="Comentario..."
              rows="4" class="w-full p-3 rounded-md text-black text-sm resize-none bg-white"></textarea>
          </div>

          <button type="submit"
            class="w-full py-2 bg-black text-white rounded-md hover:bg-amber-400 transition duration-300 text-lg font-semibold">
            Reservar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
