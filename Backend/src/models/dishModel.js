import mongoose from 'mongoose';

const DishSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  descripcion: {
    type: String,
    trim: true
  },
  imagen: {
    type: String,
    required: true,
    trim: true
  },
  especialidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialty',
    required: true
  },
  imprescindible: {
    type: Boolean,
    default: false
  }
});

const Dish = mongoose.model('Dish', DishSchema);

export default Dish;
