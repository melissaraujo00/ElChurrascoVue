import orderValidation from '../validations/orderValidation.js';
import Order from '../models/orderModel.js';
import Dish from '../models/dishModel.js';
import authMiddleware from '../middleware/authMiddleware.js';

export const createOrder = [
    orderValidation,
    authMiddleware,
    async (req, res) => {
  try {
    const { carrito, direccion, indicaciones, contacto } = req.body;
    const cliente = req.user; 
    console.log(req.user);


    // Validar que el carrito no esté vacío
    if (!carrito || carrito.length === 0) {
      return res.status(400).json({ error: 'El carrito no puede estar vacíooo' });
    }

    // Validar que los platos existen y agregar precios actuales desde la BD
    const carritoValidado = [];
    for (const item of carrito) {
      const dish = await Dish.findById(item.dish);
      if (!dish) {
        return res.status(404).json({ error: `Plato con ID ${item.dish} no encontrado` });
      }

      carritoValidado.push({
        dish: dish._id,
        cantidad: item.cantidad,
        precioUnitario: dish.precio, // Se toma desde la base de datos
      });
    }

    // Crear pedido
    const nuevoPedido = new Order({
      cliente: {
        id: cliente.id_user,
        name: cliente.name
        },
      carrito: carritoValidado,
      direccion,
      indicaciones,
      contacto,
    });

    // Guarda y calcula el total automáticamente
    const pedidoGuardado = await nuevoPedido.save();
    res.status(201).json(pedidoGuardado);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
];

export const getOrders = [
  authMiddleware,
  async (req, res) => {
    try {
      const user = req.user; // { id_user, name, roles }

      let orders;

      if (user.roles.includes('admin')) {
        // Si es admin, trae todas las órdenes
        orders = await Order.find().populate('carrito.dish');
      } else {
        // Si no es admin, solo trae las órdenes del usuario
        orders = await Order.find({ 'cliente.id': user.id_user }).populate('carrito.dish');
      }

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

export const getOrderById = [
  authMiddleware,
  async (req, res) => {
    try {
      const user = req.user; // { id_user, name, roles }
      const orderId = req.params.id;

      const order = await Order.findById(orderId).populate('carrito.dish');

      if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }

      // Si no es admin y no es el cliente, no puede ver la orden
      if (!user.roles.includes('admin') && order.cliente.id.toString() !== user.id_user) {
        return res.status(403).json({ error: 'No autorizado para ver esta orden' });
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

export const updateOrder = [
  authMiddleware,
  async (req, res) => {
    try {
      const user = req.user; // { id_user, name, roles }
      const orderId = req.params.id;
      const { carrito, direccion, indicaciones, contacto } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }

      // Verificar permisos
      if (!user.roles.includes('admin') && order.cliente.id.toString() !== user.id_user) {
        return res.status(403).json({ error: 'No autorizado para actualizar esta orden' });
      }

      // Validar y actualizar carrito si viene en la petición
      if (carrito) {
        if (!Array.isArray(carrito) || carrito.length === 0) {
          return res.status(400).json({ error: 'El carrito no puede estar vacío' });
        }

        const carritoValidado = [];
        for (const item of carrito) {
          const dish = await Dish.findById(item.dish);
          if (!dish) {
            return res.status(404).json({ error: `Plato con ID ${item.dish} no encontrado` });
          }
          carritoValidado.push({
            dish: dish._id,
            cantidad: item.cantidad,
            precioUnitario: dish.precio,
          });
        }
        order.carrito = carritoValidado;
      }

      // Actualizar otros campos
      if (direccion) order.direccion = direccion;
      if (indicaciones) order.indicaciones = indicaciones;
      if (contacto) order.contacto = contacto;

      const updatedOrder = await order.save();

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

export const deleteOrder = [
  authMiddleware,
  async (req, res) => {
    try {
      const user = req.user; // { id_user, name, roles }
      const orderId = req.params.id;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }

      // Verificar permisos
      if (!user.roles.includes('admin') && order.cliente.id.toString() !== user.id_user) {
        return res.status(403).json({ error: 'No autorizado para eliminar esta orden' });
      }

      await order.deleteOne();

      res.status(200).json({ message: 'Orden eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];