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
    telefono TEXT NOT NULL,
    numero_cuenta TEXT,
    tipo_cuenta TEXT CHECK(tipo_cuenta IN ('ahorros', 'corriente')),
    banco TEXT,
    salario REAL NOT NULL
  )
`).run();

// Crear la tabla de instructores (si no existe)
db.prepare(`
  CREATE TABLE IF NOT EXISTS instructores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    documento TEXT NOT NULL,
    telefono TEXT NOT NULL,
    numero_cuenta TEXT,
    tipo_cuenta TEXT CHECK(tipo_cuenta IN ('ahorros', 'corriente')),
    banco TEXT
  )
`).run();

// Verificar si las columnas existen antes de intentar agregarlas
const columnsTrabajadores = db.prepare("PRAGMA table_info(trabajadores)").all();
const columnNamesTrabajadores = columnsTrabajadores.map(column => column.name);

if (!columnNamesTrabajadores.includes('numero_cuenta')) {
  db.prepare(`ALTER TABLE trabajadores ADD COLUMN numero_cuenta TEXT`).run();
}
if (!columnNamesTrabajadores.includes('tipo_cuenta')) {
  db.prepare(`ALTER TABLE trabajadores ADD COLUMN tipo_cuenta TEXT CHECK(tipo_cuenta IN ('ahorros', 'corriente'))`).run();
}
if (!columnNamesTrabajadores.includes('banco')) {
  db.prepare(`ALTER TABLE trabajadores ADD COLUMN banco TEXT`).run();
}
if (!columnNamesTrabajadores.includes('salario')) {
  db.prepare(`ALTER TABLE trabajadores ADD COLUMN salario REAL NOT NULL`).run();
}

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

db.prepare(`
  CREATE TABLE IF NOT EXISTS historial (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trabajadores_id INTEGER,
    fecha_generacion TEXT,
    fecha_envio TEXT,
    estado TEXT,
    FOREIGN KEY (trabajadores_id) REFERENCES trabajadores(id)
  )
`).run();

module.exports = db;