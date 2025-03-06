'use client';
import styles from './ActionButtons.module.css';
import { generateExcel } from '@/app/actions/generateExcel';
import { sendEmail } from '@/app/actions/sendEmail';

export default function ActionButtons({
    anotaciones,
    tipoPersona,
    onGenerate,
    trabajador,
    fechaInicio,
    fechaFin,
    devengados,
    deducciones,
    valorAPagar,
    dbDevengados,
    dbDeducciones,
}) {
    const handleSend = async () => {
        try {
            if (!trabajador || !trabajador.email) {
                throw new Error('No se ha seleccionado un trabajador o no tiene email');
            }

            // Generar el PDF en base64
            const { pdfBase64, historialId } = await generateExcel(
                trabajador,
                fechaInicio,
                fechaFin,
                devengados,
                deducciones,
                valorAPagar,
                dbDevengados,
                dbDeducciones
            );

            const cuerpoHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .header { color: #2c3e50; font-size: 18px; }
                        .detalles { margin: 15px 0; padding: 10px; background: #f8f9fa; }
                        .firma { margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px; }
                    </style>
                </head>
                <body>
                    <p class="header">Buen día ${trabajador.nombre},</p>
                    
                    <p>Adjunto encontrará su desprendible de pago correspondiente al periodo:</p>
                    
                    <div class="detalles">
                        <p><strong>Fecha fin:</strong> ${fechaFin}</p>
                    </div>

                    <p><strong>Importante:</strong></p>
                    <ul>
                        <li>Conserve este documento para sus registros</li>
                        <li>Reporte inconsistencias a lideradmin@centicsas.com.co</li>
                    </ul>
                    <h2>Anotaciones <h2/>
                    <p>${anotaciones}</p>
                </body>
                </html>
                `;

            // Verificar que la cadena base64 no sea undefined
            if (!pdfBase64) {
                throw new Error('La cadena base64 del PDF es undefined');
            }

            // Enviar el PDF por correo electrónico
            const result = await sendEmail(
                trabajador.email,
                `Desprendible de Pago - ${trabajador.nombre} - ${fechaFin} - CENTIC SAS`, 
                cuerpoHTML,
                pdfBase64,
                historialId // Pasar historialId aquí
            );

            if (!result.success) {
                throw new Error(result.error || 'Error al enviar el correo');
            }

            alert('Desprendible enviado con éxito');
        } catch (error) {
            console.error('Error al enviar el desprendible:', error);
            alert('Error al enviar el desprendible: ' + error.message);
        }
    };

    return (
        <div className={styles.buttonContainer}>
            <button className={styles.btnAdd} onClick={onGenerate} disabled={!tipoPersona}>
                Generar Documento
            </button>
            <button className={styles.btnAdd} onClick={handleSend} disabled={!tipoPersona || !trabajador}>
                Enviar por Correo
            </button>
        </div>
    );
}