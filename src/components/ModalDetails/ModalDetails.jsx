import React, { useState, useEffect } from 'react';
import styles from './ModalDetails.module.css';
import { NumericFormat } from 'react-number-format'; // Importar la exportación nombrada

export default function ModalDetails({ isOpen, onClose, trabajadorId, type }) {
    const [details, setDetails] = useState([]);
    const [formData, setFormData] = useState({
        concepto: '',
        valor: '', // Inicializar como cadena vacía para evitar el 0 fijo
    });

    useEffect(() => {
        if (isOpen) {
            fetch(`http://localhost:4000/api/${type}?trabajadorId=${trabajadorId}`)
                .then(response => response.json())
                .then(data => setDetails(data))
                .catch(error => console.error(`Error fetching ${type}:`, error));
        }
    }, [isOpen, trabajadorId, type]);

    const handleNumberChange = (values) => {
        const { value } = values; // `value` es el valor sin formato (como cadena)
        setFormData({
            ...formData,
            valor: value, // Guardar como cadena para mayor flexibilidad en la UI
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Aquí usas tu función existente para manejar el valor al enviar
        const valorNumerico = parseFloat(formData.valor.replace(/[^0-9.-]+/g, '')) || 0;
        const response = await fetch(`http://localhost:4000/api/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...formData, valor: valorNumerico, trabajadorId }),
        });
        if (response.ok) {
            setFormData({ concepto: '', valor: '' });
            fetch(`http://localhost:4000/api/${type}?trabajadorId=${trabajadorId}`)
                .then(response => response.json())
                .then(data => setDetails(data))
                .catch(error => console.error(`Error fetching ${type}:`, error));
        } else {
            console.error(`Error adding ${type}`);
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:4000/api/${type}/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setDetails(details.filter(detail => detail.id !== id));
        } else {
            console.error(`Error deleting ${type}`);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <span className={styles.close} onClick={onClose}>×</span>
                <h2>{type === 'devengados' ? 'Agregar Devengados' : 'Agregar Deducciones'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formDiv}>
                        <label className={styles.label} htmlFor="concepto">Concepto:</label>
                        <input
                            className={styles.inputField}
                            type="text"
                            id="concepto"
                            name="concepto"
                            value={formData.concepto}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formDiv}>
                        <label className={styles.label} htmlFor="valor">Valor:</label>
                        <NumericFormat
                            value={formData.valor}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="$"
                            decimalScale={2}
                            allowNegative={false} // Evitar valores negativos, si aplica
                            className={styles.inputField}
                            placeholder="$0,00"
                            onValueChange={handleNumberChange}
                            required
                        />
                    </div>
                    <button className={styles.btnAdd} type="submit">Agregar</button>
                </form>
                <h3 className={styles.encabezado}>
                    {type === 'devengados' ? 'Devengados Asignados' : 'Deducciones Asignadas'}
                </h3>
                <ol className={styles.list}>
                    {details.map(detail => (
                        <li key={detail.id}>
                            {detail.concepto} : {formatCurrency(detail.valor)}
                            <button className={styles.deleteButton} onClick={() => handleDelete(detail.id)}>
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}