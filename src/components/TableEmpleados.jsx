"use client";
import { CircleMinus, CirclePlus, UserPen } from 'lucide-react';
import React from 'react';
import styles from './TableEmpleados.module.css';

export default function TableEmpleados({ trabajadores }) {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Documento</th>
                        <th>Teléfono</th>
                        <th>Cargo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {trabajadores.map(trabajador => (
                        <tr key={trabajador.id}>
                            <td>{trabajador.nombre}</td>
                            <td>{trabajador.email}</td>
                            <td>{trabajador.documento}</td>
                            <td>{trabajador.telefono}</td>
                            <td>{trabajador.cargo}</td>
                            <td>
                                <button className={styles.actionButton}><UserPen /></button>
                                <button className={styles.actionButton}><CirclePlus /></button>
                                <button className={styles.actionButton}><CircleMinus /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}