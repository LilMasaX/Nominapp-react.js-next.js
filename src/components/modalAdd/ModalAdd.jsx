"use client";
import React, { useState } from 'react';
import styles from './ModalAdd.module.css';
import { NumericFormat } from 'react-number-format'; // Importar NumericFormat

export default function ModalAdd({ fields, endpoint, title, buttonText, onAdd }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNumberChange = (name, values) => {
        const { value } = values; // Valor limpio sin formato
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Lógica para agregar el trabajador a la base de datos
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            closeModal();
            setFormData({});
            onAdd();
        } else {
            console.error(`Error al agregar ${title.toLowerCase()}`);
        }
    };

    return (
        <>
            <button className={styles.addButton} onClick={openModal}>
                {`Agregar ${title}`}
            </button>
            {modalOpen && (
                <div className={styles.modal} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <span className={styles.close} onClick={closeModal}>×</span>
                        <h2>{`Agregar ${title}`}</h2>
                        <form onSubmit={handleSubmit}>
                            {fields.map((field, index) => (
                                <div className={styles.formDiv} key={index}>
                                    <label className={styles.label} htmlFor={field.name}>
                                        {field.label}:
                                    </label>
                                    {field.type === "select" ? (
                                        <select
                                            className={styles.inputField}
                                            id={field.name}
                                            name={field.name}
                                            value={formData[field.name] || ""}
                                            onChange={handleChange}
                                            required={field.required}
                                        >
                                            <option value="">Seleccione</option>
                                            {field.options.map((option, idx) => (
                                                <option key={idx} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.name === "salario" ? ( // Detectar el campo "salario"
                                        <NumericFormat
                                            value={formData[field.name] || ""}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix="$"
                                            decimalScale={2}
                                            allowNegative={false} // Evitar valores negativos
                                            className={styles.inputField}
                                            placeholder="$0,00"
                                            onValueChange={(values) => handleNumberChange(field.name, values)}
                                            required={field.required}
                                        />
                                    ) : (
                                        <input
                                            className={styles.inputField}
                                            type={field.type}
                                            id={field.name}
                                            name={field.name}
                                            value={formData[field.name] || ""}
                                            onChange={handleChange}
                                            required={field.required}
                                        />
                                    )}
                                </div>
                            ))}
                            <button className={styles.btnAdd} type="submit">
                                {buttonText}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}