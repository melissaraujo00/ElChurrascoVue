import multer from 'multer';

const save = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Guarda el nombre original del archivo
    }
})

const filtro = (req, file, cb) => {
    if (file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

export const saveImage = multer({ storage: save, fileFilter: filtro });
