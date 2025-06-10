import {check, body} from 'express-validator';

const orderValidation = [
    check('cliente')
        .notEmpty()
        .withMessage('El cliente no debe estar vacío')
        .isLength({min: 3, max: 255})
        .withMessage('El nombre del cliente debe contener entre 3 y 255 caracteres'),

    check('direccion')
        .notEmpty()
        .withMessage('La dirección no debe estar vacía')
        .isLength({min: 10, max: 500})
        .withMessage('La dirección debe contener entre 10 y 500 caracteres'),

    body('platos')
        .isArray({min: 1})
        .withMessage('Debe haber al menos un plato en el pedido')
        .custom((value) => {
            if (!value.every(item => item.plato && item.cantidad)) {
                throw new Error('Cada plato debe tener un ID y una cantidad');
            }
            return true;
        }),

    check('total')
        .notEmpty()
        .withMessage('El total del pedido no debe estar vacío')
        .isNumeric()
        .withMessage('El total debe ser un número')
        .isFloat({min: 0})
        .withMessage('El total debe ser un número positivo'),
];

export default orderValidation;