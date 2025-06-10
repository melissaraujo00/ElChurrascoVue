import {check, body} from 'express-validator';

const dishValidation = [
    check('nombre')
        .notEmpty()
        .withMessage('El nombre del plato no debe estar vacío')
        .isLength({min: 3, max: 255})
        .withMessage('El nombre del plato debe contener entre 3 y 255 caracteres'),

    check('descripcion')
        .notEmpty()
        .withMessage('La descripción del plato no debe estar vacía')
        .isLength({min: 10, max: 500})
        .withMessage('La descripción del plato debe contener entre 10 y 500 caracteres'),

    body('imagen')
        .notEmpty()
        .withMessage('La imagen del plato no debe estar vacía')
        .matches(/^https?:\/\/.+\.(jpg|jpeg|png)$/i)
        .withMessage('La imagen debe ser una URL válida que apunte a un archivo JPG, JPEG o PNG')
        .isString()
        .withMessage('La imagen debe ser una URL válida'),
    
    check('precio')
        .notEmpty()
        .withMessage('El precio del plato no debe estar vacío')
        .isNumeric()
        .withMessage('El precio debe ser un número')
        .isFloat({min: 0})
        .withMessage('El precio debe ser un número positivo'),
    
    check('especialidad')
        .notEmpty()
        .withMessage('La especialidad del plato no debe estar vacía')
        .isMongoId()
        .withMessage('La especialidad debe ser un ID de MongoDB válido'),
];

export default dishValidation;