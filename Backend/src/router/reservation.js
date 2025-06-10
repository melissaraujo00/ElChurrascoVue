import { Router } from 'express';
import { reservationCreate, reservationGet, reservationList, reservationUpdate, reservationDelete } from '../controllers/reservationController.js';

const router = Router();
// Endpoint to create a new reservation
router.post('/', reservationCreate);
router.get('/', reservationList);
router.get('/:id', reservationGet);
router.put('/:id', reservationUpdate);
router.delete('/:id', reservationDelete);

export default router;