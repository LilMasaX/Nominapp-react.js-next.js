const express = require('express');
const cors = require('cors');
const path = require('path');

// Importación de rutas
const apiRoutes = {
  instructores: require('./api/instructores'),
  deducciones: require('./api/deducciones'),
  devengados: require('./api/devengados'),
  trabajadores: require('./api/trabajadores'),
  sendEmail: require('./api/sendEmail'),
  generateExcel: require('./api/generateExcel')
};

const app = express();

// Configuración CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Registrar rutas API
Object.entries(apiRoutes).forEach(([routeName, router]) => {
  app.use(`/api/${routeName}`, router);
});

// Manejar rutas no existentes
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});


module.exports = app;