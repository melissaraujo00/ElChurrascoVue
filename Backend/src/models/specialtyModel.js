import mongoose from 'mongoose';

const SpecialtySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  imagen: {
    type: String,
    required: true, // solo verificamos que exista una ruta
    trim: true // opcional, para eliminar espacios
  }
});

const Specialty = mongoose.model('Specialty', SpecialtySchema);

export default Specialty;
