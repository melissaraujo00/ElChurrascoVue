import Reservation  from "../models/ReservationModel.js";
import reservationValidation from "../validations/reservationValidation.js";

//Obtener todas las reservas
export const reservationList = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener las reservas.' });
  }
};

//Crear una reserva 
export const reservationCreate = [
  reservationValidation,
  async (req, res) => {
    try {
      const { nombre, numeroPersonas, fecha, hora, contactos, datosAdicionales } = req.body;

      const nuevaReserva = new Reservation({
        nombre,
        numeroPersonas,
        fecha,
        hora,
        contactos,
        datosAdicionales
      });

      await nuevaReserva.save();

      res.status(201).json({
        message: 'Reserva creada correctamente.',
        reserva: nuevaReserva
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear la reserva.' });
    }
  }
];

//Obtener una reserva por ID
export const reservationGet = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }
    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la reserva.' });
  }
};

//Actualizar una reserva por ID
export const reservationUpdate = [
  reservationValidation,
  async (req, res) => {
    try {
      const { nombre, numeroPersonas, fecha, hora, contactos, datosAdicionales } = req.body;

      const updatedReservation = await Reservation.findByIdAndUpdate(
        req.params.id,
        { nombre, numeroPersonas, fecha, hora, contactos, datosAdicionales },
        { new: true }
      );

      if (!updatedReservation) {
        return res.status(404).json({ message: 'Reserva no encontrada.' });
      }

      res.json({
        message: 'Reserva actualizada correctamente.',
        reserva: updatedReservation
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar la reserva.' });
    }
  }
];

//Eliminar una reserva por ID
export const reservationDelete = async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }
    res.json({ message: 'Reserva eliminada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la reserva.' });
  }
};
