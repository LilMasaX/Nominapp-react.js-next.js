import React, { useState, useEffect } from 'react';
import styles from './ModalEditWorker.module.css';

export default function ModalEditWorker({ isOpen, onClose, trabajadorId, onUpdate }) {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        documento: '',
        telefono: '',
        cargo: '',
        numero_cuenta: '',
        tipo_cuenta: '',
        banco: '',
        salario:''
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
                .then(data => setFormData({
                    nombre: data.nombre || '',
                    email: data.email || '',
                    documento: data.documento || '',
                    telefono: data.telefono || '',
                    cargo: data.cargo || '',
                    numero_cuenta: data.numero_cuenta || '',
                    tipo_cuenta: data.tipo_cuenta || '',
                    banco: data.banco || '',
                    salario: data.salario || ''
                }))
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
            body: JSON.stringify({ id: trabajadorId, ...formData }),
        });
        if (response.ok) {
            onUpdate();
            onClose();
        } else {
            console.error('Error updating trabajador');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/trabajadores/${trabajadorId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                onClose();
                onUpdate();
            } else {
                const errorData = await response.json();
                if (errorData.error && errorData.error.includes('FOREIGN KEY constraint failed')) {
                    alert('No se puede eliminar el trabajador porque tiene devengados o deducciones asociados. Elimine primero los devengados y deducciones.');
                } else {
                    console.error('Error deleting trabajador');
                }
            }
        } catch (error) {
            console.error('Error deleting trabajador:', error);
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
                    <div className={styles.formDiv}>
                        <label className={styles.label} htmlFor="salario">Salario Básico:</label>
                        <input className={styles.inputField} type="text" id="salario" name="salario" value={formData.salario} onChange={handleChange} required />
                    </div>
                    <button className={styles.btnAdd} type="submit">Actualizar</button>
                </form>
                <button className={styles.deleteButton} onClick={handleDelete}>Eliminar Trabajador</button>
            </div>
        </div>
    );
}