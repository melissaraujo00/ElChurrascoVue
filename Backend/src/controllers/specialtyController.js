import Specialty from '../models/specialtyModel.js';
import specialtyValidation from '../validations/specialtyValidation.js';

// Obtener todas las especialidades
export const specialtyList = async (req, res) => {
  try {
    const specialties = await Specialty.find();
    res.json(specialties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener las especialidades.' });
  }
};

// Crear una especialidad
export const specialtyCreate = [
  specialtyValidation,
  async (req, res) => {
    try {
      const { nombre, descripcion } = req.body;
      let imagen = null;

      if (req.file) {
        imagen = `/uploads/${req.file.filename}`;
      } else {
        return res.status(400).json({ message: 'Se requiere una imagen.' });
      }

      const existe = await Specialty.findOne({ nombre });
      if (existe) {
        return res.status(400).json({ message: 'La especialidad ya existe.' });
      }

      const nueva = new Specialty({ nombre, descripcion, imagen });
      await nueva.save();

      res.status(201).json({
        message: 'Especialidad creada correctamente.',
        especialidad: nueva,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear la especialidad.' });
    }
  },
];

// Obtener una especialidad por ID
export const specialtyGet = async (req, res) => {
  try {
    const specialty = await Specialty.findById(req.params.id);
    if (!specialty) {
      return res.status(404).json({ message: 'Especialidad no encontrada.' });
    }
    res.json(specialty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la especialidad.' });
  }
};

// Actualizar una especialidad
export const specialtyUpdate = [
  specialtyValidation,
  async (req, res) => {
    try {
      const { nombre, descripcion } = req.body;
      let updateData = { nombre, descripcion };

      if (req.file) {
        updateData.imagen = `/uploads/${req.file.filename}`;
      }

      const updated = await Specialty.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: 'Especialidad no encontrada.' });
      }

      res.json({
        message: 'Especialidad actualizada correctamente.',
        especialidad: updated,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar la especialidad.' });
    }
  },
];

// Eliminar una especialidad
export const specialtyDelete = async (req, res) => {
  try {
    const deleted = await Specialty.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Especialidad no encontrada.' });
    }
    res.json({ message: 'Especialidad eliminada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la especialidad.' });
  }
};
