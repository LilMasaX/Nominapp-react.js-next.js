import db from '@/db/db';

export async function GET(request) {
  const trabajadores = db.prepare('SELECT * FROM trabajadores').all();
  return new Response(JSON.stringify(trabajadores), { status: 200 });
}

export async function POST(request) {
  const { nombre, email, documento, telefono, cargo, numero_cuenta, tipo_cuenta, banco } = await request.json();
  if (!nombre || !email || !documento || !telefono || !cargo || !numero_cuenta || !tipo_cuenta || !banco) {
    return new Response(JSON.stringify({ error: 'Todos los campos son obligatorios' }), { status: 400 });
  }
  const stmt = db.prepare('INSERT INTO trabajadores (nombre, email, documento, telefono, cargo, numero_cuenta, tipo_cuenta, banco) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const info = stmt.run(nombre, email, documento, telefono, cargo, numero_cuenta, tipo_cuenta, banco);
  return new Response(JSON.stringify({ id: info.lastInsertRowid }), { status: 201 });
}