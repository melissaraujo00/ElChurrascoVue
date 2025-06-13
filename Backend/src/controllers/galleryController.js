import Gallery from '../models/galleryModel.js';
import  validationGallery  from '../validations/galleryValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';

//Obtner todas las imágenes de la galería
export const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.status(200).json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//crear una nueva imagen en la galería
export const createGalleryImage = [
    validationGallery,
    authMiddleware,
    async (req, res) => {
        try {
            const { title, description } = req.body;
            let imagen = null;

            if (req.file) {
                imagen = `/uploads/${req.file.filename}`;
            } else {
                return res.status(400).json({ message: 'Se requiere una imagen.' });
            }

            const newImage = new Gallery({
                title,
                description,
                imagen
            });

            const savedImage = await newImage.save();
            res.status(201).json(savedImage);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];

//Obtener una imagen por ID
export const getGalleryImageById = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Imagen no encontrada.' });
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Actualizar una imagen por ID
export const updateGalleryImage = [
  validationGallery,
  authMiddleware,
  async (req, res) => {
    try {
      const { title, description } = req.body;

      const updateData = {
        title,
        description
      };

      if (req.file) {
        updateData.imagen = `/uploads/${req.file.filename}`;
      }

      const updatedImage = await Gallery.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedImage) {
        return res.status(404).json({ message: 'Imagen no encontrada.' });
      }

      res.status(200).json(updatedImage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];


//Eliminar una imagen por ID            
export const deleteGalleryImage = async (req, res) => {
  try {
    const deletedImage = await Gallery.findByIdAndDelete(req.params.id);
    if (!deletedImage) {
      return res.status(404).json({ message: 'Imagen no encontrada.' });
    }
    res.status(200).json({ message: 'Imagen eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};