import db from '@/db/db';

export async function GET(request) {
  const trabajadores = db.prepare('SELECT * FROM trabajadores').all();
  return new Response(JSON.stringify(trabajadores), { status: 200 });
}

export async function POST(request) {
  const { nombre, email, documento, telefono, cargo } = await request.json();
  const stmt = db.prepare('INSERT INTO trabajadores (nombre, email, documento, telefono, cargo) VALUES (?, ?, ?, ?, ?)');
  const info = stmt.run(nombre, email, documento, telefono, cargo);
  return new Response(JSON.stringify({ id: info.lastInsertRowid }), { status: 201 });
}