import express from 'express';
import morgan from 'morgan';
import connectDB from '../database/database.js'; 
import cookieParser from 'cookie-parser';
import login from '../router/login.js'; 
import specialtyRouter from '../router/specialty.js';
import cors from "cors";

const app = express();
connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.URL_CORS_ORIGIN,  
  credentials: true, 
}));

app.use('/specialty', specialtyRouter); 
app.use('/login', login);

app.get('/', (req, res) => {
  res.send('Bienvenido al Backend del El Churrasco');
});

export default app;
