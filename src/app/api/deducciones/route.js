import db from '@/db/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const trabajadorId = searchParams.get('trabajadorId');
  const deducciones = db.prepare('SELECT * FROM deducciones WHERE trabajadores_id = ?').all(trabajadorId);
  return new Response(JSON.stringify(deducciones), { status: 200 });
}

export async function POST(request) {
  const { trabajadorId, concepto, valor } = await request.json();
  const stmt = db.prepare('INSERT INTO deducciones (trabajadores_id, concepto, valor) VALUES (?, ?, ?)');
  const info = stmt.run(trabajadorId, concepto, valor);
  return new Response(JSON.stringify({ id: info.lastInsertRowid }), { status: 201 });
}