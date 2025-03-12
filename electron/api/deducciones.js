const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
    const { trabajadorId } = req.query;
    const deducciones = db.prepare('SELECT * FROM deducciones WHERE trabajadores_id = ?').all(trabajadorId);
    res.json(deducciones);
});

router.post('/', (req, res) => {
    const { trabajadorId, concepto, valor } = req.body;
    const stmt = db.prepare('INSERT INTO deducciones (trabajadores_id, concepto, valor) VALUES (?, ?, ?)');
    const info = stmt.run(trabajadorId, concepto, valor);
    res.json({ id: info.lastInsertRowid });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    const stmt = db.prepare('DELETE FROM deducciones WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes > 0) {
        return res.status(204).send();
    } else {
        return res.status(404).json({ error: 'Deducción no encontrada' });
    }
});

module.exports = router;