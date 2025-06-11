<script setup>
import { ref } from "vue";
import axios from 'axios'; 

const formValues = ref({
  name: '',
  people: '',
  date: '',
  hour: '',
  contacts: '',
  additional: ''
});

const clearForm = () => {
  formValues.value = {
    name: '',
    people: '',
    date: '',
    hour: '',
    contacts: '',
    additional: ''
  };
};

const submitForm = async () => {
  try {
    const response = await axios.post('http://localhost:3000/reservations', {
      nombre: formValues.value.name,
      numeroPersonas: formValues.value.people,
      fecha: formValues.value.date,
      hora: formValues.value.hour,
      contactos: formValues.value.contacts,
      datosAdicionales: formValues.value.additional
    });

    alert(response.data.message);
    clearForm();
  } catch (error) {
    console.error(error);
    alert('Ocurrió un error al enviar la reserva.');
  }
};

</script>

<template>
  <div class="relative w-full col-span-2 overflow-hidden h-[800px]">
    <img class="w-full h-full object-cover blur-xs" src="/img/bannerReservation.jpg" alt="">
    <div class="absolute inset-0 bg-gray-950/65"></div>

    <div class="absolute inset-0 flex flex-col items-center justify-center m-3 px-4">
      <h2 class="text-5xl text-white font-bold mb-8 mt-5 text-center">Haz tú Reservación</h2>

      <div
        class="p-8 bg-white/20 backdrop-blur-md rounded-xl w-full max-w-[690px] h-auto flex flex-col shadow-xl mx-4 sm:mx-5">
        <form @submit.prevent="submitForm" class="w-full flex flex-col gap-6">
          <div>
            <label for="name" class="block text-white mb-1 font-semibold">Nombre</label>
            <input v-model="formValues.name" id="name" name="name" type="text" placeholder="Ingrese su nombre"
              class="w-full p-3 rounded-md text-black text-sm bg-white" required />
          </div>

          <div>
            <label for="people" class="block text-white mb-1 font-semibold">Número de personas</label>
            <input v-model="formValues.people" id="people" name="people" type="number" min="1" placeholder="7"
              class="w-full p-3 rounded-md text-black text-sm bg-white" required />
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 min-w-0">
              <label for="date" class="block text-white mb-1 font-semibold">Fecha</label>
              <input v-model="formValues.date" id="date" name="date" type="date"
                class="w-full p-3 rounded-md text-black text-sm bg-white" required />
            </div>
            <div class="flex-1 min-w-0">
              <label for="hour" class="block text-white mb-1 font-semibold">Hora</label>
              <input v-model="formValues.hour" id="hour" name="hour" type="time"
                class="w-full p-3 rounded-md text-black text-sm bg-white" required />
            </div>
          </div>
          <div>
            <label for="name" class="block text-white mb-1 font-semibold">Contacto</label>
            <input v-model="formValues.contacts" id="name" name="contact" type="text" placeholder="ejemplo@ejemplo.com"
              class="w-full p-3 rounded-md text-black text-sm bg-white" required />
          </div>
          <div>
            <label for="additional" class="block text-white mb-1 font-semibold">Datos Adicionales (Opcional)</label>
            <textarea v-model="formValues.additional" id="additional" name="additional"
              placeholder="Comentario..." rows="4"
              class="w-full p-3 rounded-md text-black text-sm resize-none bg-white"></textarea>
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
