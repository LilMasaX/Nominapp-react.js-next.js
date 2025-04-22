'use client';
import React, { useState, useEffect } from 'react';
import styles from './HistorialTable.module.css';

export default function HistorialTable() {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8; // Número de filas por página

    // Fetch de datos directamente en el componente
    useEffect(() => {
        const fetchHistorial = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/historial');
                if (!res.ok) {
                    throw new Error(`Error HTTP: ${res.status} ${res.statusText}`);
                }
                const data = await res.json();
                console.log('Datos recibidos del servidor:', data);
                if (Array.isArray(data)) {
                    setHistorial(data);
                } else {
                    throw new Error('La respuesta del servidor no es un array');
                }
            } catch (error) {
                console.error('Error al cargar el historial:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorial();
    }, []);

    // Calcular los datos para la página actual
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentHistorial = historial.slice(indexOfFirstRow, indexOfLastRow);

    // Cambiar de página
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <p>Cargando historial...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Enviado a</th>
                        <th>Fecha de Generación</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {currentHistorial.length > 0 ? (
                        currentHistorial.map((item) => (
                            <tr key={item.id}>
                                <td>{item.nombre}</td>
                                <td>{item.fecha_generacion}</td>
                                <td>{item.estado}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No hay datos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            <div className={styles.pagination}>
                {Array.from({ length: Math.ceil(historial.length / rowsPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}