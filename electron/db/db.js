const Database = require('better-sqlite3');

// Crea o abre la base de datos
const db = new Database('db.db', {
  verbose: console.log 
});

try {
  // Crear tabla trabajadores
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

  // Crear tabla instructores
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

  // Crear tabla proveedores
  db.prepare(`
    CREATE TABLE IF NOT EXISTS proveedores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      nit TEXT NOT NULL,
      telefono TEXT NOT NULL,
      numero_cuenta TEXT,
      tipo_cuenta TEXT CHECK(tipo_cuenta IN ('ahorros', 'corriente')),
      banco TEXT
    )
  `).run();

  // Crear tabla deducciones
  db.prepare(`
    CREATE TABLE IF NOT EXISTS deducciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trabajadores_id INTEGER NOT NULL,
      concepto TEXT NOT NULL,
      valor REAL NOT NULL,
      FOREIGN KEY (trabajadores_id) REFERENCES trabajadores(id)
    )
  `).run();

  // Crear tabla devengados
  db.prepare(`
    CREATE TABLE IF NOT EXISTS devengados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trabajadores_id INTEGER NOT NULL,
      concepto TEXT NOT NULL,
      valor REAL NOT NULL,
      FOREIGN KEY (trabajadores_id) REFERENCES trabajadores(id)
    )
  `).run();

  // Crear tabla historial
  db.prepare(`
    CREATE TABLE IF NOT EXISTS historial (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      persona_id INTEGER NOT NULL, -- ID de la persona (trabajador, instructor o proveedor)
      tipo_persona TEXT NOT NULL, -- 'trabajadores', 'instructores', 'proveedores'
      nombre_persona TEXT NOT NULL,
      fecha_generacion TEXT,
      fecha_envio TEXT,
      estado TEXT,
      trabajador_eliminado BOOLEAN DEFAULT 0
    )
  `).run();

  console.log('Esquema de base de datos inicializado correctamente');

} catch (error) {
  console.error('Error durante la inicialización de la base de datos:', error);
  process.exit(1); 
}

module.exports = db;