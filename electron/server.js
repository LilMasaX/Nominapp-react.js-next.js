const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importación de rutas
const apiRoutes = {
  instructores: require('./api/instructores'),
  deducciones: require('./api/deducciones'),
  devengados: require('./api/devengados'),
  trabajadores: require('./api/trabajadores'),
  sendEmail: require('./api/sendEmail'),
  generateExcel: require('./api/generateExcel'),
  historial: require('./api/historial'),
  proveedores: require('./api/proveedores'),
};

const app = express();

// Configuración dinámica de CORS
const allowedOrigins = [
  'http://localhost:3000', // Origen en desarrollo
  'file://',
  'http://192.168.1.4:3000',// Origen para Electron en producción
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origen (por ejemplo, desde Electron)
      if (!origin || allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json( {limit: '50mb'} ));

// Registrar rutas API
Object.entries(apiRoutes).forEach(([routeName, router]) => {
  app.use(`/api/${routeName}`, router);
});

// Manejar rutas no existentes
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;