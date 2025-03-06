import { NextResponse } from 'next/server';
import db from '@/db/db';

export async function GET(request) {
    try {
        const historial = db.prepare(`
            SELECT h.*, t.nombre AS trabajador_nombre
            FROM historial h
            JOIN trabajadores t ON h.trabajadores_id = t.id
        `).all(); // Obtenemos todos los registros con el nombre del trabajador
        return NextResponse.json(historial);
    } catch (error) {
        console.error('Error al obtener el historial:', error);
        return NextResponse.json({ error: 'Error al obtener el historial' }, { status: 500 });
    }
}