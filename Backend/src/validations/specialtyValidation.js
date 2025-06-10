import { check, body } from 'express-validator';

const specialtyValidation = [
    check('nombre')
        .notEmpty()
        .withMessage('El nombre de la especialidad no debe estar vacío')
        .isLength({ min: 3, max: 255 })
        .withMessage('El nombre de la especialidad debe contener entre 3 y 255 caracteres'),

    check('descripcion')
        .notEmpty()
        .withMessage('La descripción de la especialidad no debe estar vacía')
        .isLength({ min: 10, max: 500 })
        .withMessage('La descripción de la especialidad debe contener entre 10 y 500 caracteres'),

    body('imagen')
        .notEmpty()
        .withMessage('La imagen de la especialidad no debe estar vacía')
        .matches(/^https?:\/\/.+\.(jpg|jpeg|png)$/i)
        .withMessage('La imagen debe ser una URL válida que apunte a un archivo JPG, JPEG o PNG')
        .isString()
        .withMessage('La imagen debe ser una URL válida')

]

export default specialtyValidation;