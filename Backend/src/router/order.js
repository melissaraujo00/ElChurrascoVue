import {createOrder, getOrderById, getOrders, updateOrder, deleteOrder } from '../controllers/orderController.js';
import express from 'express';

const router = express.Router();
// Endpoint to create a new order
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
