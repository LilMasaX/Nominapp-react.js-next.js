import { Resend } from 'resend';

// Inicializa Resend con tu clave API
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailWithResend(to, subject, text, pdfBuffer) {
    try {
        const response = await resend.emails.send({
            from: 'tu-email@tu-dominio.com', // Cambia esto por tu email verificado
            to: to,
            subject: subject,
            text: text,
            attachments: [
                {
                    filename: 'desprendible.pdf',
                    content: pdfBuffer.toString('base64'), // Convierte el PDF a base64
                    contentType: 'application/pdf',
                },
            ],
        });
        console.log('Correo enviado con éxito:', response);
        return { success: true, message: 'Correo enviado con éxito' };
    } catch (error) {
        console.error('Error enviando el correo:', error);
        throw new Error('No se pudo enviar el correo: ' + error.message);
    }
}