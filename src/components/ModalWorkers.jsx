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
    cargo: ''
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
    const response = await fetch('/api/trabajadores', {
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
    <div className={styles.container}>
      <button className={styles.addButton} onClick={openModal}>Agregar Trabajador</button>

      {modalOpen && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.close} onClick={closeModal}>&times;</span>
            <h2>Agregar Trabajador</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nombre">Nombre:</label>
                <input className='input-field' type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input className='input-field' type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="documento">Numero de Documento:</label>
                <input className='input-field' type="number" id="documento" name="documento" value={formData.documento} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="telefono">Telefono:</label>
                <input className='input-field' type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="cargo">Cargo:</label>
                <input className='input-field' type="text" id="cargo" name="cargo" value={formData.cargo} onChange={handleChange} required />
              </div>
              <button className='btn-add' type="submit">Agregar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}