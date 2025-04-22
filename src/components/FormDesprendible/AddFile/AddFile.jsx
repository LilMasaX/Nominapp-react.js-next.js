import React, { useRef, useState } from 'react';
import styles from './AddFile.module.css';
import { Upload, X } from 'lucide-react'; 

const AddFile = ({ onFileChange }) => {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState(''); // Estado para almacenar el nombre del archivo

    const handleButtonClick = () => {
        // Simula un clic en el input de archivo oculto
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            // Verificar el tipo de archivo
            if (file.type !== 'application/pdf') {
                alert('Solo se permiten archivos en formato PDF.');
                return;
            }

            // Verificar el tamaño del archivo (máximo 3 MB)
            const maxSizeInBytes = 3 * 1024 * 1024; // 3 MB
            if (file.size > maxSizeInBytes) {
                alert('El archivo no debe superar los 3 MB.');
                return;
            }

            // Actualizar el estado con el nombre del archivo
            setFileName(file.name);

            // Llamar a la función de callback con el archivo válido
            onFileChange(file);
        }
    };

    const handleRemoveFile = () => {
        // Restablecer el estado del archivo
        setFileName('');
        onFileChange(null); // Notificar al componente padre que no hay archivo seleccionado
    };

    return (
        <>
        <div className={styles.container}>
            {/* Botón para subir archivo */}
            <button type="button" className={styles.uploadButton} onClick={handleButtonClick}>
                <Upload className={styles.icon} /> Subir archivo
            </button>
                    <button type="button" className={styles.removeButton} onClick={handleRemoveFile}>
                        <X className={styles.removeIcon} />
                    </button>
        </div>
        <div>
            {fileName && (
                <div className={styles.fileInfo}>
                    <p className={styles.fileName}>Archivo seleccionado: {fileName}</p>
                </div>
            )}

            {/* Input de archivo oculto */}
            <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                className={styles.fileInput}
                onChange={handleFileChange}
                style={{ display: 'none' }} // Oculta el input
            />
        </div>  
        </>
    );
};

export { AddFile };