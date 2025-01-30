import db from '@/db/db';

export async function DELETE(request, { params }) {
  try {
    // Obtener el ID de los parámetros de la ruta
    const { id } = params;

    // Validación básica del ID
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'ID inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ejecutar la consulta
    const stmt = db.prepare('DELETE FROM deducciones WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes > 0) {
      return new Response(null, { status: 204 }); // 204 No Content
    } else {
      return new Response(JSON.stringify({ error: 'Deducción no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Error en DELETE:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}