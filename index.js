import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';

import servicesRoutes from './routes/servicesRoutes.js';
import { db } from './config/db.js';

// Configura las variables de entorno
dotenv.config();

// Configura la app
const app = express();

//Conectar a la bd
db();

//Definir una ruta
app.use('/api/services', servicesRoutes);

// Definir un puerto
const port = process.env.PORT || 4000;

// Arrancar la app
app.listen(port, () => {
    console.log(colors.blue('Escuchando en el puerto:', colors.bold(port)));
});