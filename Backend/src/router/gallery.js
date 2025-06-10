import { Router } from 'express';
import {  getGallery, createGalleryImage, getGalleryImageById, updateGalleryImage, deleteGalleryImage } from '../controllers/galleryController.js';
import { saveImage } from '../middleware/storage.js';

const router = Router();
// Obtener todas las reservas
router.get('/', getGallery);   
// Crear una nueva reserva
router.post('/', saveImage.single('imagen'), createGalleryImage);
// Obtener una reserva por ID
router.get('/:id', getGalleryImageById);
// Actualizar una reserva por ID
router.put('/:id', saveImage.single('imagen'),updateGalleryImage);  
// Eliminar una reserva por ID
router.delete('/:id', deleteGalleryImage);

export default router;