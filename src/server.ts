import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';// Importa el paquete cors para habilitar CORS en la aplicación
import morgan from 'morgan'// Importa el paquete morgan para registrar las peticiones HTTP en la consola
import { corsConfig } from './config/cors';
import { connectDB } from './config/db';// Importa la función connectDB desde el archivo db.ts
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes';// Importa las rutas de proyectos desde el archivo projectRoutes.ts

dotenv.config();//carga las variables de entorno desde el archivo .env

connectDB(); // Llama a la función connectDB para establecer la conexión a la base de datos

const app = express()

app.use(cors(corsConfig)); // Habilita CORS para el frontend

app.use(morgan('dev')); // Utiliza morgan para registrar las peticiones HTTP en la consola en modo desarrollo

app.use(express.json()); // Middleware para parsear y habilitar el cuerpo de las peticiones en formato JSON

app.use('/api/auth', authRoutes);// Configura la ruta base para las rutas de proyectos
app.use('/api/projects', projectRoutes);// Configura la ruta base para las rutas de proyectos



export default app;