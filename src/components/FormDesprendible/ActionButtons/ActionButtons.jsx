'use client';
import { sendEmail } from '@/app/actions/sendEmail';
import { generateExcel } from '@/app/actions/generateExcel';
import styles from './ActionButtons.module.css';

export default function ActionButtons({
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
            const pdfBase64 = await generateExcel(
                trabajador,
                fechaInicio,
                fechaFin,
                devengados,
                deducciones,
                valorAPagar,
                dbDevengados,
                dbDeducciones
            );

            // Verificar que la cadena base64 no sea undefined
            if (!pdfBase64) {
                throw new Error('La cadena base64 del PDF es undefined');
            }

            // Enviar el PDF por correo electrónico
            const result = await sendEmail(
                trabajador.email,
                'Desprendible de Pago',
                'Adjunto encontrarás tu desprendible de pago.',
                pdfBase64
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