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
  }
});

const Specialty = mongoose.model('Specialty', SpecialtySchema);

export default Specialty;
