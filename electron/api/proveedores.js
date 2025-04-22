const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
  try {
    const proveedores = db.prepare('SELECT * FROM proveedores').all();
    res.json(proveedores);
  } catch (error) {
    console.error('Error en GET /proveedores:', error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const instructor = db.prepare('SELECT * FROM proveedores WHERE id = ?').get(id);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor no encontrado' });
    }

    res.json(instructor);
  } catch (error) {
    console.error('Error en GET /proveedores/:id:', error);
    res.status(500).json({ error: 'Error al obtener el instructor' });
  }
});

router.post('/', (req, res) => {
  try {
    const { nombre, email, nit, telefono, numero_cuenta, tipo_cuenta, banco } = req.body;

    // Validación de campos
    const camposRequeridos = [nombre, email, nit, telefono, numero_cuenta, tipo_cuenta, banco];
    if (camposRequeridos.some(campo => !campo)) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const insert = db.prepare(`
      INSERT INTO proveedores (nombre, email, nit, telefono, numero_cuenta, tipo_cuenta, banco)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(nombre, email, nit, telefono, numero_cuenta, tipo_cuenta, banco);

    res.status(201).json({
      id: result.lastInsertRowid,
      message: 'Instructor creado exitosamente'
    });
  } catch (error) {
    console.error('Error en POST /proveedores:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'nit o email ya existen' });
    }
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { nombre, email, nit, telefono, numero_cuenta, tipo_cuenta, banco } = req.body;

    // Validación de campos
    const camposRequeridos = [nombre, email, nit, telefono, numero_cuenta, tipo_cuenta, banco];
    if (camposRequeridos.some(campo => !campo)) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const update = db.prepare(`
      UPDATE proveedores SET 
        nombre = ?, 
        email = ?, 
        nit = ?, 
        telefono = ?, 
        numero_cuenta = ?, 
        tipo_cuenta = ?, 
        banco = ?
      WHERE id = ?
    `);

    const result = update.run(nombre, email, nit, telefono, numero_cuenta, tipo_cuenta, banco, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({
      message: 'Proveedor actualizado exitosamente',
      changes: result.changes
    });
  } catch (error) {
    console.error('Error en PUT /proveedores/:id:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'nit o email ya existen' });
    }
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
});

// Eliminar instructor
router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const result = db.prepare('DELETE FROM proveedores WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({
      message: 'Proveedor eliminado exitosamente',
      changes: result.changes
    });
  } catch (error) {
    console.error('Error en DELETE /proveedores/:id:', error);
    res.status(500).json({ error: 'Error al eliminar instructor' });
  }
});

module.exports = router;