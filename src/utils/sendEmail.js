export async function sendEmail(to, subject, htmlContent, pdfBase64, historialId) {
    const response = await fetch('http://localhost:3000/api/sendEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to,
            subject,
            htmlContent,
            pdfBase64,
            historialId,
        }),
    });

    if (!response.ok) {
        throw new Error('Error al enviar el email');
    }

    return response.json();
}