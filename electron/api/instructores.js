const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Obtener todos los instructores
router.get('/', (req, res) => {
  try {
    const instructores = db.prepare('SELECT * FROM instructores').all();
    res.json(instructores);
  } catch (error) {
    console.error('Error en GET /instructores:', error);
    res.status(500).json({ error: 'Error al obtener instructores' });
  }
});

// Obtener un instructor por ID
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const instructor = db.prepare('SELECT * FROM instructores WHERE id = ?').get(id);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor no encontrado' });
    }

    res.json(instructor);
  } catch (error) {
    console.error('Error en GET /instructores/:id:', error);
    res.status(500).json({ error: 'Error al obtener el instructor' });
  }
});

// Agregar un nuevo instructor (opcional, si lo necesitas)
router.post('/', (req, res) => {
  try {
    const { nombre, email, documento, telefono, numero_cuenta, tipo_cuenta, banco } = req.body;

    // Validación de campos
    const camposRequeridos = [nombre, email, documento, telefono, numero_cuenta, tipo_cuenta, banco];
    if (camposRequeridos.some(campo => !campo)) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const insert = db.prepare(`
      INSERT INTO instructores (nombre, email, documento, telefono, numero_cuenta, tipo_cuenta, banco)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(nombre, email, documento, telefono, numero_cuenta, tipo_cuenta, banco);

    res.status(201).json({
      id: result.lastInsertRowid,
      message: 'Instructor creado exitosamente'
    });
  } catch (error) {
    console.error('Error en POST /instructores:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Documento o email ya existen' });
    }
    res.status(500).json({ error: 'Error al crear instructor' });
  }
});

// Actualizar instructor
router.put('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { nombre, email, documento, telefono, numero_cuenta, tipo_cuenta, banco } = req.body;

    // Validación de campos
    const camposRequeridos = [nombre, email, documento, telefono, numero_cuenta, tipo_cuenta, banco];
    if (camposRequeridos.some(campo => !campo)) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const update = db.prepare(`
      UPDATE instructores SET 
        nombre = ?, 
        email = ?, 
        documento = ?, 
        telefono = ?, 
        numero_cuenta = ?, 
        tipo_cuenta = ?, 
        banco = ?
      WHERE id = ?
    `);

    const result = update.run(nombre, email, documento, telefono, numero_cuenta, tipo_cuenta, banco, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Instructor no encontrado' });
    }

    res.json({
      message: 'Instructor actualizado exitosamente',
      changes: result.changes
    });
  } catch (error) {
    console.error('Error en PUT /instructores/:id:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Documento o email ya existen' });
    }
    res.status(500).json({ error: 'Error al actualizar instructor' });
  }
});

// Eliminar instructor
router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const result = db.prepare('DELETE FROM instructores WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Instructor no encontrado' });
    }

    res.json({
      message: 'Instructor eliminado exitosamente',
      changes: result.changes
    });
  } catch (error) {
    console.error('Error en DELETE /instructores/:id:', error);
    res.status(500).json({ error: 'Error al eliminar instructor' });
  }
});

module.exports = router;