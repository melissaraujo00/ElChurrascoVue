<script setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { watch, ref } from 'vue';

const API_URL = import.meta.env.VITE_API_URL;
const emit = defineEmits(['saved', 'cancel']);
const imagenFile = ref(null);
const token = localStorage.getItem('token');

const props = defineProps({
    initialData: {
        type: Object,
        default: () => ({}),
    }
});


const validationSchema = yup.object({
    nombre: yup.string().required('El nombre es obligatorio'),
    descripcion: yup.string(),
    type: yup.string()
        .oneOf(['Entradas', 'Platos Fuertes', 'Bebidas', 'Menu Infantil'], 'Tipo inválido')
        .required('El tipo es obligatorio')
});

const { handleSubmit, errors, setValues } = useForm({
    validationSchema,
    initialValues: {
        nombre: '',
        descripcion: '',
        imagen: '',
        type: 'Entradas'
    }
});

const { value: nombre } = useField('nombre');
const { value: descripcion } = useField('descripcion');
const { value: type } = useField('type');

watch(() => props.initialData, (data) => {
    if (data && Object.keys(data).length) {
        setValues({
            nombre: data.nombre || '',
            descripcion: data.descripcion || '',
            imagen: data.imagen || '',
            type: data.type || 'Entradas'
        });
    } else {
        setValues({
            nombre: '',
            descripcion: '',
            imagen: '',
            type: 'Entradas'
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
        const url = `${API_URL}/specialty${isEdit ? `/${props.initialData._id}` : ''}`;
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
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Error en la solicitud');
        }

        alert(data.message || (isEdit ? 'Especialidad actualizada correctamente' : 'Especialidad creada correctamente'));
        emit('saved');
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al guardar la especialidad.');
    }
});


</script>
<template>
    <div class="relative w-full col-span-2 overflow-hidden h-[800px]">
        <div class="absolute inset-0 flex flex-col items-center justify-center m-3 px-4">
            <div class="p-8 bg-white rounded-xl w-full max-w-[690px] h-auto flex flex-col shadow-xl mx-4 sm:mx-5">
                <h2 class="text-5xl text-black font-bold mb-8 mt-5 text-center">
                    {{ initialData && initialData._id ? 'Editar Especialidad' : 'Agregar Especialidad' }}
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
                    <input id="imagen" name="imagen" type="file" accept="image/* " @change="onFileChange"
                        class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100" />
                    <span class="text-sm text-red-500">{{ errors.imagen }}</span>

                    <div>
                        <label for="type" class="block text-black mb-1 font-semibold">Tipo</label>
                        <select v-model="type" id="type" name="type"
                            class="w-full p-3 rounded-md text-gray-800 text-sm bg-gray-100">
                            <option value="" disabled>Seleccione un tipo</option>
                            <option value="Entradas">Entradas</option>
                            <option value="Platos Fuertes">Platos Fuertes</option>
                            <option value="Bebidas">Bebidas</option>
                            <option value="Menu Infantil">Menú Infantil</option>
                        </select>
                        <span class="text-sm text-red-500">{{ errors.type }}</span>
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
