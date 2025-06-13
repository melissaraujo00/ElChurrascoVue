<script setup>
import { useForm, useField, useFieldArray } from 'vee-validate';
import * as yup from 'yup';
import { ref, watch } from 'vue';

const emit = defineEmits(['saved', 'cancel']);
const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('token');

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({}),
  },
  clientes: Array,
  platos: Array,  // lista de platos para el carrito
});

const validationSchema = yup.object({
  clienteId: yup.string().required('Debe seleccionar un cliente'),
  clienteNombre: yup.string().required('Nombre requerido'),
  direccion: yup.string().required('La dirección es obligatoria'),
  contacto: yup.string().required('El contacto es obligatorio'),
  indicaciones: yup.string(),
  carrito: yup.array().of(
    yup.object({
      dish: yup.string().required('Debe seleccionar un plato'),
      cantidad: yup.number().min(1).required('Cantidad obligatoria'),
      precioUnitario: yup.number().min(0).required('Precio requerido'),
    })
  ).min(1, 'Debe agregar al menos un producto'),
});

const { handleSubmit, errors, setValues, values } = useForm({
  validationSchema,
  initialValues: {
    clienteId: '',
    clienteNombre: '',
    direccion: '',
    contacto: '',
    indicaciones: '',
    carrito: [],
  },
});

const { value: carritoFields, push, remove } = useFieldArray('carrito');

// Al cargar datos iniciales
watch(() => props.initialData, (data) => {
  if (data && Object.keys(data).length) {
    setValues(data);
  }
}, { immediate: true });

function agregarProducto() {
  push({ dish: '', cantidad: 1, precioUnitario: 0 });
}

function eliminarProducto(index) {
  remove(index);
}

const onSubmit = handleSubmit(async (formValues) => {
  try {
    const isEdit = props.initialData && props.initialData._id;
    const url = `${API_URL}/pedido${isEdit ? `/${props.initialData._id}` : ''}`;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formValues),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error en la solicitud');

    alert(data.message || 'Pedido guardado correctamente');
    emit('saved');
  } catch (err) {
    console.error(err);
    alert('Ocurrió un error al guardar el pedido');
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-center">
      {{ initialData && initialData._id ? 'Editar Pedido' : 'Nuevo Pedido' }}
    </h2>

    <form @submit.prevent="onSubmit" class="space-y-6">

      <!-- Selección Cliente -->
      <div>
        <label for="clienteId" class="block font-semibold mb-1">Cliente</label>
        <select
          id="clienteId"
          v-model="values.clienteId"
          class="w-full p-2 border rounded"
        >
          <option value="" disabled>Seleccione un cliente</option>
          <option
            v-for="cliente in clientes"
            :key="cliente._id"
            :value="cliente._id"
          >
            {{ cliente.name }}
          </option>
        </select>
        <p class="text-red-600 text-sm mt-1">{{ errors.clienteId }}</p>
      </div>

      <!-- Nombre Cliente (editable o readonly) -->
      <div>
        <label for="clienteNombre" class="block font-semibold mb-1">Nombre Cliente</label>
        <input
          id="clienteNombre"
          type="text"
          v-model="values.clienteNombre"
          class="w-full p-2 border rounded"
          placeholder="Nombre del cliente"
        />
        <p class="text-red-600 text-sm mt-1">{{ errors.clienteNombre }}</p>
      </div>

      <!-- Dirección -->
      <div>
        <label for="direccion" class="block font-semibold mb-1">Dirección</label>
        <input
          id="direccion"
          type="text"
          v-model="values.direccion"
          class="w-full p-2 border rounded"
          placeholder="Dirección de entrega"
        />
        <p class="text-red-600 text-sm mt-1">{{ errors.direccion }}</p>
      </div>

      <!-- Contacto -->
      <div>
        <label for="contacto" class="block font-semibold mb-1">Contacto</label>
        <input
          id="contacto"
          type="text"
          v-model="values.contacto"
          class="w-full p-2 border rounded"
          placeholder="Teléfono o email"
        />
        <p class="text-red-600 text-sm mt-1">{{ errors.contacto }}</p>
      </div>

      <!-- Indicaciones -->
      <div>
        <label for="indicaciones" class="block font-semibold mb-1">Indicaciones (Opcional)</label>
        <textarea
          id="indicaciones"
          v-model="values.indicaciones"
          rows="3"
          class="w-full p-2 border rounded"
          placeholder="Ej: dejar en la puerta"
        ></textarea>
      </div>

      <!-- Carrito Dinámico -->
      <div>
        <h3 class="font-semibold mb-2">Carrito</h3>
        <table class="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 p-2 text-left">Plato</th>
              <th class="border border-gray-300 p-2 text-left">Cantidad</th>
              <th class="border border-gray-300 p-2 text-left">Precio Unitario</th>
              <th class="border border-gray-300 p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in carritoFields" :key="index">
              <td class="border border-gray-300 p-2">
                <select
                  v-model="values.carrito[index].dish"
                  class="w-full p-1 border rounded"
                >
                  <option value="" disabled>Seleccione un plato</option>
                  <option v-for="plato in platos" :key="plato._id" :value="plato._id">
                    {{ plato.nombre }}
                  </option>
                </select>
                <p class="text-red-600 text-xs mt-1">
                  {{ errors.carrito?.[index]?.dish }}
                </p>
              </td>
              <td class="border border-gray-300 p-2">
                <input
                  type="number"
                  min="1"
                  v-model.number="values.carrito[index].cantidad"
                  class="w-full p-1 border rounded"
                />
                <p class="text-red-600 text-xs mt-1">
                  {{ errors.carrito?.[index]?.cantidad }}
                </p>
              </td>
              <td class="border border-gray-300 p-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  v-model.number="values.carrito[index].precioUnitario"
                  class="w-full p-1 border rounded"
                />
                <p class="text-red-600 text-xs mt-1">
                  {{ errors.carrito?.[index]?.precioUnitario }}
                </p>
              </td>
              <td class="border border-gray-300 p-2 text-center">
                <button
                  type="button"
                  @click="eliminarProducto(index)"
                  class="text-red-600 font-semibold hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
            <tr v-if="carritoFields.length === 0">
              <td colspan="4" class="p-2 text-center text-gray-500">No hay productos agregados</td>
            </tr>
          </tbody>
        </table>
        <button
          type="button"
          @click="agregarProducto"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Agregar Producto
        </button>
        <p class="text-red-600 text-sm mt-1" v-if="errors.carrito">{{ errors.carrito }}</p>
      </div>

      <!-- Botones -->
      <div class="flex gap-4 justify-center mt-6">
        <button
          type="submit"
          class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
        >
          {{ initialData && initialData._id ? 'Actualizar Pedido' : 'Guardar Pedido' }}
        </button>

        <button
          type="button"
          @click="emit('cancel')"
          class="px-6 py-2 bg-gray-400 rounded hover:bg-gray-500 font-semibold"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>
