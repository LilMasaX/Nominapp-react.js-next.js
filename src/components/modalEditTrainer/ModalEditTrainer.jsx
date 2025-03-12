import React, { useState, useEffect } from 'react';
import styles from './ModalEditTrainer.module.css';

export default function ModalEditTrainer({ isOpen, onClose, trainerId, onUpdate }) {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        documento: '',
        telefono: '',
        numero_cuenta: '',
        tipo_cuenta: '',
        banco: '',
    });

    useEffect(() => {
        if (isOpen && trainerId) {
            console.log('Fetching trainer with ID:', trainerId);
            fetch(`http://localhost:3000/api/instructores/${trainerId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error fetching trainer');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Fetched trainer data:', data);
                    setFormData({
                        nombre: data.nombre || '',
                        email: data.email || '',
                        documento: data.documento || '',
                        telefono: data.telefono || '',
                        numero_cuenta: data.numero_cuenta || '',
                        tipo_cuenta: data.tipo_cuenta || '',
                        banco: data.banco || '',
                    });
                })
                .catch(error => console.error('Error fetching trainer:', error));
        }
    }, [isOpen, trainerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Updating trainer with ID:', trainerId);
        try {
            const response = await fetch(`http://localhost:3000/api/instructores/${trainerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: trainerId, ...formData }),
            });
            if (response.ok) {
                console.log('Trainer updated successfully');
                onUpdate();
                onClose();
            } else {
                const errorText = await response.text();
                console.error('Error updating trainer:', errorText);
            }
        } catch (error) {
            console.error('Error updating trainer:', error);
        }
    };

    const handleDelete = async () => {
        try {
            console.log('Deleting trainer with ID:', trainerId);
            const response = await fetch(`http://localhost:3000/api/instructores/${trainerId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log('Trainer deleted successfully');
                onClose();
                onUpdate();
            } else {
                const errorText = await response.text();
                console.error('Error deleting trainer:', errorText);
            }
        } catch (error) {
            console.error('Error deleting trainer:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <h2>Editar Instructor</h2>
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
                        <label className={styles.label} htmlFor="numero_cuenta">Numero de Cuenta:</label>
                        <input className={styles.inputField} type="text" id="numero_cuenta" name="numero_cuenta" value={formData.numero_cuenta} onChange={handleChange} required />
                    </div>
                    <div className={styles.formDiv}>
                        <label className={styles.label} htmlFor="tipo_cuenta">Tipo de Cuenta:</label>
                        <select className={styles.inputField} id="tipo_cuenta" name="tipo_cuenta" value={formData.tipo_cuenta} onChange={handleChange} required>
                            <option value="">Seleccione</option>
                            <option value="ahorros">Ahorros</option>
                            <option value="corriente">Corriente</option>
                        </select>
                    </div>
                    <div className={styles.formDiv}>
                        <label className={styles.label} htmlFor="banco">Banco:</label>
                        <input className={styles.inputField} type="text" id="banco" name="banco" value={formData.banco} onChange={handleChange} required />
                    </div>
                    <button className={styles.btnAdd} type="submit">Actualizar</button>
                </form>
                <button className={styles.deleteButton} onClick={handleDelete}>Eliminar Instructor</button>
            </div>
        </div>
    );
}