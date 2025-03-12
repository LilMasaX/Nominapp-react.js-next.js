const Database = require('better-sqlite3');

// Crea o abre la base de datos
const db = new Database('electron.sqlite', {
  verbose: console.log // Opcional: muestra queries en consola
});

try {
  // Crear tablas principales
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

  // Verificar y agregar columnas faltantes
  const addMissingColumns = () => {
    const columns = db.prepare("PRAGMA table_info(trabajadores)").all().map(row => row.name);
    
    const missingColumns = [
      { name: 'numero_cuenta', type: 'TEXT' },
      { name: 'tipo_cuenta', type: 'TEXT CHECK(tipo_cuenta IN (\'ahorros\', \'corriente\'))' },
      { name: 'banco', type: 'TEXT' },
      { name: 'salario', type: 'REAL NOT NULL' }
    ].filter(col => !columns.includes(col.name));

    missingColumns.forEach(col => {
      db.prepare(`ALTER TABLE trabajadores ADD COLUMN ${col.name} ${col.type}`).run();
    });
  };
  
  addMissingColumns();

  // Crear tablas relacionadas
  const relatedTables = [
    `CREATE TABLE IF NOT EXISTS deducciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trabajadores_id INTEGER,
      concepto TEXT NOT NULL,
      valor REAL NOT NULL,
      FOREIGN KEY (trabajadores_id) REFERENCES trabajadores(id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS devengados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trabajadores_id INTEGER,
      concepto TEXT NOT NULL,
      valor REAL NOT NULL,
      FOREIGN KEY (trabajadores_id) REFERENCES trabajadores(id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS historial (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trabajadores_id INTEGER,
      fecha_generacion TEXT,
      fecha_envio TEXT,
      estado TEXT,
      FOREIGN KEY (trabajadores_id) REFERENCES trabajadores(id)
    )`
  ];

  relatedTables.forEach(table => db.prepare(table).run());

  console.log('Esquema de base de datos inicializado correctamente');

} catch (error) {
  console.error('Error durante la inicialización de la base de datos:', error);
  process.exit(1); // Salir con código de error
}

// Exportar la instancia de la base de datos
module.exports = db;