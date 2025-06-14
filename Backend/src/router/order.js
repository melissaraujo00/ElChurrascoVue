import {createOrder, getOrderById, getOrders, updateOrder, deleteOrder, updateOrderEstado } from '../controllers/orderController.js';
import express from 'express';

const router = express.Router();
// Endpoint to create a new order
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.patch('/:id/estado', updateOrderEstado);

export default router;
