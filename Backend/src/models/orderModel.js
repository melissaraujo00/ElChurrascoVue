import mongoose from 'mongoose';

const carritoSchema = new mongoose.Schema({
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',       // referencia a modelo Dish
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0,
  },
});

const pedidoSchema = new mongoose.Schema({
  cliente: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Login',     // asumiendo que tienes un modelo User para clientes
    },
    name: {
      type: String,
      required: true,
    }
  },
  carrito: [carritoSchema],    // array de platos con cantidad y precio
  direccion: {
    type: String,
    required: true,
    trim: true,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  indicaciones: {
    type: String,
    trim: true,
  },
  contacto: {
    type: String,
    required: true,
    trim: true,
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en camino', 'entregado'],
    default: 'pendiente'
  },
}, {
  timestamps: true,
});

// Middleware para calcular total antes de guardar
pedidoSchema.pre('save', function(next) {
  this.total = this.carrito.reduce((acc, item) => {
    return acc + (item.precioUnitario * item.cantidad);
  }, 0);
  next();
});

const Order = mongoose.model('Pedido', pedidoSchema);

export default Order;
