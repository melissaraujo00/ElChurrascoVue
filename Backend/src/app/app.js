//servidor
import express from 'express';
import morgan from 'morgan';
import connectDB from '../database/database.js'; // ajusta la ruta si es necesario

const app = express();

// Conexión a MongoDB
connectDB();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('This is express');
});

export default app;
