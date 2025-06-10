import express from 'express';
import {
  createDish,
  getDishes,
  getDishById,
  updateDish,
  deleteDish
} from '../controllers/dishController.js';
import { saveImage } from '../middleware/storage.js';

const router = express.Router();

router.post('/', saveImage.single('imagen'), createDish);
router.get('/', getDishes);
router.get('/:id', getDishById);
router.put('/:id', saveImage.single('imagen'), updateDish);
router.delete('/:id', deleteDish);

export default router;
