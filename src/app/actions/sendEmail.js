"use server";
import { Resend } from 'resend';
import db from '@/db/db';

export async function sendEmail(to, subject, htmlContent, pdfBase64, historialId) {
    try {
        // Convertir la cadena base64 a Buffer
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        console.log(process.env.RESEND_API_KEY);
        // Validación del buffer
        if (!Buffer.isBuffer(pdfBuffer)) {
            throw new Error('El PDF no es un buffer válido');
        }

        // Enviar con Resend
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: 'desprendibles@centicsas.com.co',
            to: to,
            subject: subject,
            html: htmlContent,
            attachments: [
                {
                    filename: 'desprendible.pdf',
                    content: pdfBuffer,
                    encoding: 'binary',
                },
            ],
        });

        const stmt = db.prepare(`
            UPDATE historial
            SET fecha_envio = datetime('now'), estado = 'enviado'
            WHERE id = ?
        `);
        stmt.run(historialId);

        return { success: true };
    } catch (error) {
        const stmt = db.prepare(`
            UPDATE historial
            SET estado = 'fallido'
            WHERE id = ?
        `);
        stmt.run(historialId);
        console.error('Error detallado:', {
            message: error.message,
            stack: error.stack,
            raw: error.originalError || error,
        });
        return { success: false, error: error.message };
    }
}