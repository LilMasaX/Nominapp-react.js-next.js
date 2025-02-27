import db from '@/db/db';

// GET - Obtener trabajador por ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Validación básica del ID
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'ID inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const trabajador = db.prepare('SELECT * FROM instructores WHERE id = ?').get(id);
    
    if (trabajador) {
      return new Response(JSON.stringify(trabajador), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: 'instructor no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en GET:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT - Actualizar instructor por ID
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { nombre, email, documento, telefono, numero_cuenta, tipo_cuenta, banco } = await request.json();
    
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'ID inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!nombre || !email || !documento || !telefono || !numero_cuenta || !tipo_cuenta || !banco ) {
      return new Response(JSON.stringify({ error: 'Todos los campos son obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = db.prepare(`
      UPDATE instructores 
      SET nombre = ?, email = ?, documento = ?, telefono = ?, numero_cuenta = ?, tipo_cuenta = ?, banco = ?
      WHERE id = ?
    `);

    const info = stmt.run(nombre, email, documento, telefono, numero_cuenta, tipo_cuenta, banco, id);

    if (info.changes > 0) {
      return new Response(null, { status: 204 });
    }
    
    return new Response(JSON.stringify({ error: 'instructor no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en PUT:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Eliminar instructor por ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'ID inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = db.prepare('DELETE FROM instructores WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes > 0) {
      return new Response(null, { status: 204 });
    }
    
    return new Response(JSON.stringify({ error: 'Trabajador no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en DELETE:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}