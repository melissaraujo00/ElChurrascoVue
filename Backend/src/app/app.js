import express from 'express';
import morgan from 'morgan';
import connectDB from '../database/database.js'; 
import cookieParser from 'cookie-parser';
import login from '../router/login.js'; 
import specialtyRouter from '../router/specialty.js';
import dishRoutes from '../router/dish.js';
import orderRoutes from '../router/order.js';
import reservationRouter from '../router/reservation.js';
import galleryRouter from '../router/gallery.js';
import cors from "cors";
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
connectDB();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hacer pública la carpeta 'public' (y por ende /uploads dentro)
app.use(express.static(path.join(__dirname, '../../public')));


app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors(
  {
    origin: 'http://localhost:5173', // o tu frontend en producción
  credentials: true
  }
));

app.use('/specialty', specialtyRouter); 
app.use('/login', login);
app.use('/dishes', dishRoutes);
app.use('/orders', orderRoutes);
app.use('/reservations', reservationRouter);
app.use('/gallery', galleryRouter);

app.get('/', (req, res) => {
  res.send('Bienvenido al Backend del El Churrasco');
});

export default app;
