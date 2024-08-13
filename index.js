import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import servicesRoutes from './routes/servicesRoutes.js';
import { db } from './config/db.js';

// Configura las variables de entorno
dotenv.config();

// Configura la app
const app = express();

// Leer datos via body
app.use(express.json());

//Conectar a la bd
db();

//Configurar CORS
const whitelist = [process.env.FRONTEND_URL];

if(process.argv[2] === '--postman') {
    whitelist.push(undefined);
}

const corsOptions = {
    origin: function (origin, callback) {
        if(whitelist.includes(origin)) {
            //Permite la conexión
            callback(null, true);
        } else {
            //Bloquea la conexión
            callback(new Error('Error de CORS'));
        }
    }
};

app.use(cors(corsOptions));

//Definir una ruta
app.use('/api/services', servicesRoutes);

// Definir un puerto
const port = process.env.PORT || 4000;

// Arrancar la app
app.listen(port, () => {
    console.log(colors.blue('Escuchando en el puerto:', colors.bold(port)));
});