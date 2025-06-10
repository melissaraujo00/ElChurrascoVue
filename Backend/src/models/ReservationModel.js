import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  numeroPersonas: {
    type: Number,
    required: true,
    min: 1,
  },
  fecha: {
    type: Date,
    required: true,
  },
  hora: {
    type: String, // Puedes usar String (e.g. "19:30") o Date si prefieres guardar fecha+hora juntos
    required: true,
  },
  contactos: {
    type: String,
    required: true,
    minim: 8,

  },
  datosAdicionales: {
    type: String,
    default: '',
  },
}, {
  timestamps: true, // Para crear campos createdAt y updatedAt automáticos
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
