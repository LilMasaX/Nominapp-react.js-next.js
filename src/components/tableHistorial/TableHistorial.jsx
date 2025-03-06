'use client';
import React from 'react';
import styles from './TableHistorial.module.css';

const HistorialTable = ({ historial = [] }) => {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Trabajador</th>
                    <th>Fecha de Generación</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                {historial.map(item => (
                    <tr key={item.id}>
                        <td>{item.trabajador_nombre}</td>
                        <td>{item.fecha_generacion}</td>
                        <td>{item.estado}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default HistorialTable;