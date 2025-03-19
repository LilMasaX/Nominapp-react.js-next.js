const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Obtener todos los trabajadores
router.get("/", (req, res) => {
  try {
    const trabajadores = db.prepare("SELECT * FROM trabajadores").all();
    res.json(trabajadores);
  } catch (error) {
    console.error('Error en GET /trabajadores:', error);
    res.status(500).json({ error: "Error al obtener trabajadores" });
  }
});

// Obtener un trabajador por ID
router.get("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const trabajador = db.prepare("SELECT * FROM trabajadores WHERE id = ?").get(id);
    if (!trabajador) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    res.json(trabajador);
  } catch (error) {
    console.error('Error en GET /trabajadores/:id:', error);
    res.status(500).json({ error: "Error al obtener el trabajador" });
  }
});

// Agregar nuevo trabajador
router.post('/', (req, res) => {
  try {
    const { nombre, email, documento, telefono, cargo, numero_cuenta, tipo_cuenta, banco, salario } = req.body;

    // Validación de campos
    const camposRequeridos = [nombre, email, documento, telefono, cargo, numero_cuenta, tipo_cuenta, banco, salario];
    if (camposRequeridos.some(campo => !campo)) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Insertar con transacción
    const insert = db.prepare(`
      INSERT INTO trabajadores 
      (nombre, email, documento, telefono, cargo, numero_cuenta, tipo_cuenta, banco, salario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(nombre, email, documento, telefono, cargo, numero_cuenta, tipo_cuenta, banco, salario);

    res.status(201).json({ 
      id: result.lastInsertRowid,
      message: 'Trabajador creado exitosamente'
    });
  } catch (error) {
    console.error('Error en POST /trabajadores:', error);

    // Manejo de errores de constraint UNIQUE
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Documento o email ya existen' });
    }

    res.status(500).json({ error: 'Error al crear trabajador' });
  }
});

// Actualizar trabajador
router.put('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { nombre, email, documento, telefono, cargo, numero_cuenta, tipo_cuenta, banco, salario } = req.body;

    // Validación de campos
    const camposRequeridos = [nombre, email, documento, telefono, cargo, numero_cuenta, tipo_cuenta, banco, salario];
    if (camposRequeridos.some(campo => !campo)) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const update = db.prepare(`
      UPDATE trabajadores SET 
        nombre = ?,
        email = ?,
        documento = ?,
        telefono = ?,
        cargo = ?,
        numero_cuenta = ?,
        tipo_cuenta = ?,
        banco = ?,
        salario = ?
      WHERE id = ?
    `);

    const result = update.run(nombre, email, documento, telefono, cargo, numero_cuenta, tipo_cuenta, banco, salario, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    res.json({ 
      message: 'Trabajador actualizado exitosamente',
      changes: result.changes
    });
  } catch (error) {
    console.error('Error en PUT /trabajadores:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Documento o email ya existen' });
    }
    res.status(500).json({ error: 'Error al actualizar trabajador' });
  }
});

// Eliminar trabajador
router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const result = db.prepare('DELETE FROM trabajadores WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    res.json({ 
      message: 'Trabajador eliminado exitosamente',
      changes: result.changes
    });
  } catch (error) {
    console.error('Error en DELETE /trabajadores:', error);
    res.status(500).json({ error: 'Error al eliminar trabajador' });
  }
});

module.exports = router;