const Database = require('better-sqlite3');

// Crea o abre una base de datos
const db = new Database('database.sqlite', { verbose: console.log });

// Crear la tabla de trabajadores (si no existe)
db.prepare(`
  CREATE TABLE IF NOT EXISTS trabajadores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    cargo TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    documento TEXT NOT NULL,
    telefono TEXT NOT NULL
  )
`).run();

// Crear tabla de deducciones con `trabajadores_id` como clave foránea
db.prepare(`
  CREATE TABLE IF NOT EXISTS deducciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trabajadores_id INTEGER,
    concepto TEXT NOT NULL,
    valor REAL NOT NULL,
    FOREIGN KEY (trabajadores_id) REFERENCES trabajadores(id)
  )
`).run();

// Crear tabla de devengados con `trabajadores_id` como clave foránea
db.prepare(`
  CREATE TABLE IF NOT EXISTS devengados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trabajadores_id INTEGER,
    concepto TEXT NOT NULL,
    valor REAL NOT NULL,
    FOREIGN KEY (trabajadores_id) REFERENCES trabajadores(id)
  )
`).run();

module.exports = db;
