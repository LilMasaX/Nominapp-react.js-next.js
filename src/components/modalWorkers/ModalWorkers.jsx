"use client";
import React, { useState } from 'react';
import styles from './ModalWorkers.module.css';

export default function ModalWorkers({ onAddTrabajador }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        documento: '',
        telefono: '',
        cargo: '',
        numero_cuenta: '',
        tipo_cuenta: '',
        banco: '',
        salario: ''
    });

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Lógica para agregar el trabajador a la base de datos
        const response = await fetch('http://localhost:4000/api/trabajadores', { // Cambiar a puerto 3000
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            // Trabajador agregado exitosamente
            closeModal();
            onAddTrabajador(); // Llamar a la función para actualizar la tabla
        } else {
            // Manejar error
            console.error('Error al agregar el trabajador');
        }
    };

    return (
        <>
            <button className={styles.addButton} onClick={openModal}>Agregar Trabajador</button>
            {modalOpen && (
                <div className={styles.modal} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <span className={styles.close} onClick={closeModal}>&times;</span>
                        <h2>Agregar Trabajador</h2>
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
                                <label className={styles.label} htmlFor="salario">Salario basico:</label>
                                <input className={styles.inputField} type="number" id="salario" name="salario" value={formData.salario} onChange={handleChange} required />
                            </div>
                            <button className={styles.btnAdd} type="submit">Agregar</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}