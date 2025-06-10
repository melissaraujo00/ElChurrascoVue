import express from 'express';
import { 
  specialtyList, 
  specialtyCreate, 
  specialtyGet, 
  specialtyUpdate, 
  specialtyDelete 
} from '../controllers/specialtyController.js';
import { saveImage } from '../middleware/storage.js';

const router = express.Router();

router.get('/', specialtyList);
router.post('/', saveImage.single('imagen'), specialtyCreate);
router.get('/:id', specialtyGet);
router.put('/:id', saveImage.single('imagen'), specialtyUpdate);
router.delete('/:id', specialtyDelete);

export default router;
