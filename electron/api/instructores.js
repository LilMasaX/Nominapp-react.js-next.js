const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/:id', (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    const instructor = db.prepare('SELECT * FROM instructores WHERE id = ?').get(id);
    if (instructor) {
        res.json(instructor);
    } else {
        res.status(404).json({ error: 'Instructor no encontrado' });
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email, documento, telefono, numero_cuenta, tipo_cuenta, banco } = req.body;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    if (!nombre || !email || !documento || !telefono || !numero_cuenta || !tipo_cuenta || !banco) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const stmt = db.prepare('UPDATE instructores SET nombre = ?, email = ?, documento = ?, telefono = ?, numero_cuenta = ?, tipo_cuenta = ?, banco = ? WHERE id = ?');
    const info = stmt.run(nombre, email, documento, telefono, numero_cuenta, tipo_cuenta, banco, id);
    if (info.changes > 0) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Instructor no encontrado' });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    const stmt = db.prepare('DELETE FROM instructores WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes > 0) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Instructor no encontrado' });
    }
});

module.exports = router;