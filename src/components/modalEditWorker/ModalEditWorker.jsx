import React, { useState, useEffect } from 'react';
import styles from './ModalEditWorker.module.css';

export default function ModalEditWorker({ isOpen, onClose, trabajadorId, onUpdate }) {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        documento: '',
        telefono: '',
        cargo: ''
    });

    useEffect(() => {
        if (isOpen && trabajadorId) {
            fetch(`/api/trabajadores/${trabajadorId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error fetching trabajador');
                    }
                    return response.json();
                })
                .then(data => setFormData(data))
                .catch(error => console.error('Error fetching trabajador:', error));
        }
    }, [isOpen, trabajadorId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`/api/trabajadores/${trabajadorId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            onUpdate();
            onClose();
        } else {
            console.error('Error updating trabajador');
        }
    };

    const handleDelete = async () => {
        const response = await fetch(`/api/trabajadores/${trabajadorId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            onClose();
            onUpdate();
        } else {
            console.error('Error deleting trabajador');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <h2>Editar Trabajador</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formDiv}>
                        <label className={styles.label} htmlFor="nombre">Nombre:</label>
                        <input className={styles.inputField} type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className={styles.formDiv}>
                        <label className={styles.label} htmlFor="email">Email:</label>
                        <input className={styles.inputField} type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className={styles.formDiv}>
                        <label className={styles.label} htmlFor="documento">Numero de Documento:</label>
                        <input className={styles.inputField} type="number" id="documento" name="documento" value={formData.documento} onChange={handleChange} required />
                    </div>
                    <div className={styles.formDiv}>
                        <label className={styles.label} htmlFor="telefono">Telefono:</label>
                        <input className={styles.inputField} type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </div>
                    <div className={styles.formDiv}>
                        <label className={styles.label} htmlFor="cargo">Cargo:</label>
                        <input className={styles.inputField} type="text" id="cargo" name="cargo" value={formData.cargo} onChange={handleChange} required />
                    </div>
                    <button className={styles.btnAdd} type="submit">Actualizar</button>
                </form>
                <button className={styles.deleteButton} onClick={handleDelete}>Eliminar Trabajador</button>
            </div>
        </div>
    );
}