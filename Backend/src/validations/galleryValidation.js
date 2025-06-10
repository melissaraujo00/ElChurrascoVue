import {check} from 'express-validator';

export const galleryValidation = [
    check('title')
        .notEmpty()
        .withMessage('El título es obligatorio.')
        .isLength({max: 100})
        .withMessage('El título no puede exceder los 100 caracteres.'),
    check('description')
        .notEmpty()
        .withMessage('La descripción es obligatoria.')
        .isLength({max: 500})
        .withMessage('La descripción no puede exceder los 500 caracteres.'),
    check('imagen')
        .notEmpty()
        .withMessage('La imagen es obligatoria.')
        .isURL()
        .withMessage('La imagen debe ser formato válida.'),
];

export default galleryValidation;