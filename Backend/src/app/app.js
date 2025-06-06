//servidor
import express from 'express';
import morgan from 'morgan';
import cors from "cors";
import connectDB from '../database/database.js'; // ajusta la ruta si es necesario

const app = express();

// Conexión a MongoDB
connectDB();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.URL_CORS_ORIGIN, 
  credentials: true, 
}));

app.get('/', (req, res) => {
  res.send('This is express');
});

export default app;
