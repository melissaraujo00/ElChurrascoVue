import Dish from '../models/dishModel.js';
import Specialty from '../models/specialtyModel.js';
import dishValidation from '../validations/dishValidation.js';
import specialtyValidation from '../validations/specialtyValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';

export const createDish = [ 
    dishValidation, 
    authMiddleware,
    async (req, res) => {
    try {
        const { nombre, precio, descripcion, especialidad, imprescindible, offer } = req.body;
        let imagen = null;

        if (req.file) {
        imagen = `/uploads/${req.file.filename}`;
      } else {
        return res.status(400).json({ message: 'Se requiere una imagen.' });
      }

        // Validar que la especialidad exista
        const foundSpecialty = await Specialty.findById(especialidad);
        if (!foundSpecialty) {
          return res.status(404).json({ error: 'Especialidad no encontrada' });
        }

        // Verificar si el plato ya existe
        const existingDish = await Dish.findOne({ nombre, especialidad });
        if (existingDish) {
          return res.status(400).json({ error: 'El plato ya existe en esta especialidad' });
        }

        // Crear el nuevo plato
        const newDish = new Dish({
          nombre,
          precio,
          descripcion,
          imagen,
          especialidad,
          imprescindible: imprescindible || false,
          offer: offer || null
        });

        const savedDish = await newDish.save();
        res.status(201).json(savedDish);
    } catch (error) {
        
    }
}]
  


// Obtener todos los platos
export const getDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().populate('especialidad', 'nombre descripcion');
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un plato por ID
export const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('especialidad');
    if (!dish) return res.status(404).json({ error: 'Plato no encontrado' });
    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateDish = [ 
    specialtyValidation,
    authMiddleware,
    async (req, res) => {
        try {
            const { nombre, precio, descripcion, especialidad, imprescindible, offer } = req.body;
            let updateData = { nombre, precio, descripcion, especialidad, imprescindible: imprescindible || false, offer: offer || null };
            if (req.file) {
                updateData.imagen = `/uploads/${req.file.filename}`;
            }

            const updatedDish = await Dish.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('especialidad');
            if (!updatedDish) {
                return res.status(404).json({ error: 'Plato no encontrado' });
            }

            res.json({
                message: 'Plato actualizado correctamente',
                dish: updatedDish
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al actualizar el plato' });            
        }
    }


]


export const deleteDish = [
  async (req, res) => {
    try {
      const dish = await Dish.findById(req.params.id);
      if (!dish) return res.status(404).json({ error: 'Plato no encontrado' });

      // Ruta absoluta a la imagen
      try {
        if (dish.imagen && !dish.imagen.startsWith('http')) {
          const imagePath = path.join(__dirname, '..', 'uploads', dish.imagen); // Ajusta esto a tu carpeta real
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      } catch (err) {
        console.error('Error al eliminar la imagen:', err.message);
      }

      await Dish.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Plato eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el plato:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
];