import styles from './ActionButtons.module.css';
import { generateExcel } from '@/app/actions/generateExcel';
import { sendEmail } from '@/app/actions/sendEmail';

const ActionButtons = ({ tipoPersona, onGenerate, trabajador, fechaInicio, fechaFin, devengados, deducciones, valorAPagar, dbDevengados, dbDeducciones }) => {
    const handleSend = async () => {
        try {
            // Validar que haya un trabajador seleccionado
            if (!trabajador || !trabajador.email) {
                throw new Error('No se ha seleccionado un trabajador o falta el email');
            }

            // Generar el PDF
            const pdfBuffer = await generateExcel(trabajador, fechaInicio, fechaFin, devengados, deducciones, valorAPagar, dbDevengados, dbDeducciones);

            // Enviar el PDF por correo
            await sendEmail(trabajador.email, 'Desprendible de Pago', 'Adjunto encontrarás tu desprendible de pago.', pdfBuffer);

            alert('Desprendible enviado con éxito');
        } catch (error) {
            console.error('Error al enviar el desprendible:', error);
            alert('Error al enviar el desprendible: ' + error.message);
        }
    };

    return (
        <div className={styles.buttonContainer}>
            {/* Botón para generar el PDF */}
            <button
                type="button"
                className={styles.btnAdd}
                onClick={onGenerate}
            >
                {tipoPersona === 'trabajadores' ? 'Generar Desprendible' : 'Generar desprendible OC'}
            </button>

            {/* Botón para enviar el PDF */}
            <button
                type="button"
                className={styles.btnAdd}
                onClick={handleSend}
            >
                {tipoPersona === 'trabajadores' ? 'Enviar Desprendible' : 'Enviar desprendible OC'}
            </button>
        </div>
    );
};

export default ActionButtons;