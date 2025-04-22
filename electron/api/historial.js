const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
    try {
        // Consulta SQL actualizada para incluir tipo_persona y nombre_persona
        const historial = db.prepare(`
            SELECT 
                id,
                fecha_generacion,
                estado,
                tipo_persona,
                nombre_persona,
                trabajador_eliminado
            FROM historial
        `).all();

        // Verifica si la consulta devolvió resultados
        if (!historial || historial.length === 0) {
            return res.status(200).json([]); // Devuelve un array vacío si no hay datos
        }

        // Procesar los resultados para ajustar el nombre según tipo_persona
        const historialProcesado = historial.map((registro) => {
            return {
                id: registro.id,
                fecha_generacion: registro.fecha_generacion,
                estado: registro.estado,
                tipo_persona: registro.tipo_persona,
                nombre: registro.nombre_persona, // Mantener consistencia en el frontend
                eliminado: registro.trabajador_eliminado === 1, // Convertir a booleano
            };
        });

        res.json(historialProcesado);
    } catch (error) {
        console.error('Error en GET /historial:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
    }
});

module.exports = router;