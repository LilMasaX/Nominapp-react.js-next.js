import db from '@/db/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const trabajadorId = searchParams.get('trabajadorId');
  const devengados = db.prepare('SELECT * FROM devengados WHERE trabajadores_id = ?').all(trabajadorId);
  return new Response(JSON.stringify(devengados), { status: 200 });
}

export async function POST(request) {
  const { trabajadorId, concepto, valor } = await request.json();
  const stmt = db.prepare('INSERT INTO devengados (trabajadores_id, concepto, valor) VALUES (?, ?, ?)');
  const info = stmt.run(trabajadorId, concepto, valor);
  return new Response(JSON.stringify({ id: info.lastInsertRowid }), { status: 201 });
}