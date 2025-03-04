"use server"
import { Resend } from 'resend';

const API_KEY = 're_MkTcXUtH_AgFETLhsv3p69kS4rkL93KF9';

export async function sendEmail(to, subject, text, pdfBase64) {
    try {
        // Convertir la cadena base64 a Buffer
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');

        // Validación del buffer
        if (!Buffer.isBuffer(pdfBuffer)) {
            throw new Error('El PDF no es un buffer válido');
        }

        // Enviar con Resend
        const resend = new Resend(API_KEY);
        await resend.emails.send({
            from: 'desprendibles@centicsas.com.co',
            to,
            subject,
            text,
            attachments: [
                {
                    filename: 'desprendible.pdf',
                    content: pdfBuffer,
                    encoding: 'binary',
                },
            ],
        });

        return { success: true };
    } catch (error) {
        console.error('Error detallado:', {
            message: error.message,
            stack: error.stack,
            raw: error.originalError || error,
        });
        return { success: false, error: error.message };
    }
}