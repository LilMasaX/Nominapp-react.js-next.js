'use client';
import styles from './ActionButtons.module.css';
import { toast } from 'react-hot-toast';

export default function ActionButtons({
    onGenerate,
    onSendEmail,
    tipoPersona
}) {

    return (
        <div className={styles.buttonContainer}>
            <button className={styles.btnAdd} onClick={onGenerate} disabled={!tipoPersona}>
                Generar Documento
            </button>
            <button className={styles.btnAdd} onClick={onSendEmail} >
                Enviar por Correo
            </button>
        </div>
    );
}