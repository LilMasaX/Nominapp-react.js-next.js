const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
    try {
        // Consulta SQL para unir historial con trabajadores
        const historial = db.prepare(`
            SELECT 
                h.id,
                h.fecha_generacion,
                h.estado,
                t.nombre AS trabajador_nombre
            FROM historial h
            JOIN trabajadores t ON h.trabajadores_id = t.id
        `).all(); // Cambiado h.trabajador_id a h.trabajadores_id

        // Verifica si la consulta devolvió resultados
        if (!historial || historial.length === 0) {
            return res.status(200).json([]); // Devuelve un array vacío si no hay datos
        }

        res.json(historial);
    } catch (error) {
        console.error('Error en GET /historial:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
    }
});

module.exports = router;


