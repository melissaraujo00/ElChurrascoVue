import { check, body } from "express-validator";

const reservationValidation = [
    check("nombre")
        .notEmpty()
        .withMessage("El nombre del cliente no debe estar vacío")
        .isLength({ min: 3, max: 255 })
        .withMessage("El nombre del cliente debe contener entre 3 y 255 caracteres"),

    check("telefono")
        .notEmpty()
        .withMessage("El teléfono no debe estar vacío")
        .isMobilePhone("any")
        .withMessage("El teléfono debe ser un número de teléfono válido"),

    check("fecha")
        .notEmpty()
        .withMessage("La fecha de la reserva no debe estar vacía")
        .isISO8601()
        .toDate()
        .withMessage("La fecha debe ser una fecha válida en formato ISO 8601"),

    check("hora")
        .notEmpty()
        .withMessage("La hora de la reserva no debe estar vacía")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("La hora debe estar en formato HH:mm"),

    check("numeroPersonas")
        .notEmpty()
        .withMessage("El número de personas no debe estar vacío")
        .isInt({ min: 1 })
        .withMessage("El número de personas debe ser un entero positivo"),
    
    body("contactos")
        .notEmpty()
        .withMessage("El numero de contacto no deben estar vacíos")
        .isLength({ min: 8 })
        .withMessage("El numero de contacto deben tener al menos 8 caracteres")
        .isNumeric()
        .withMessage("Los contactos deben ser numéricos"),
    

];

export default reservationValidation;