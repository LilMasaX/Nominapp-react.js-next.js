import db from '@/db/db';

// GET - Obtener trabajador por ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Validación básica del ID
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'ID inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const trabajador = db.prepare('SELECT * FROM trabajadores WHERE id = ?').get(id);
    
    if (trabajador) {
      return new Response(JSON.stringify(trabajador), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Trabajador no encontrado' }), {
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

// PUT - Actualizar trabajador por ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { nombre, email, documento, telefono, cargo, numero_cuenta, tipo_cuenta, banco, salario } = await request.json();
    
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'ID inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!nombre || !email || !documento || !telefono || !cargo || !numero_cuenta || !tipo_cuenta || !banco || !salario) {
      return new Response(JSON.stringify({ error: 'Todos los campos son obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = db.prepare(`
      UPDATE trabajadores 
      SET nombre = ?, email = ?, documento = ?, telefono = ?, cargo = ?, numero_cuenta = ?, tipo_cuenta = ?, banco = ?, salario = ?
      WHERE id = ?
    `);

    const info = stmt.run(nombre, email, documento, telefono, cargo, numero_cuenta, tipo_cuenta, banco, salario, id);

    if (info.changes > 0) {
      return new Response(null, { status: 204 });
    }
    
    return new Response(JSON.stringify({ error: 'Trabajador no encontrado' }), {
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

// DELETE - Eliminar trabajador por ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'ID inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = db.prepare('DELETE FROM trabajadores WHERE id = ?');
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