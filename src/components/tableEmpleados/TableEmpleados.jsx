"use client";
import { CircleMinus, CirclePlus, UserPen } from 'lucide-react';
import React, { useState } from 'react';
import styles from './TableEmpleados.module.css';
import ModalDetails from '../ModalDetails/ModalDetails';
import ModalEditWorker from '../modalEditWorker/ModalEditWorker';

export default function TableEmpleados({ trabajadores, onUpdate }) {

    const [selectedTrabajador, setSelectedTrabajador] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    }

    const openModal = (trabajadorId, type) => {
        setSelectedTrabajador(trabajadorId);
        setModalType(type);
    };

    const closeModal = () => {
        setSelectedTrabajador(null);
        setModalType(null);
    };

    const openEditModal = (trabajadorId) => {
        setSelectedTrabajador(trabajadorId);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedTrabajador(null);
        setEditModalOpen(false);
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Documento</th>
                        <th>Salario Basico</th>
                        <th>Banco</th>
                        <th>Tipo de cuenta</th>
                        <th>Numero de Cuenta</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(trabajadores) && trabajadores.map(trabajador => ( // Verificar que trabajadores es un array
                        <tr key={trabajador.id}>
                            <td>{trabajador.nombre}</td>
                            <td>{trabajador.email}</td>
                            <td>{trabajador.documento}</td>
                            <td>{formatCurrency(trabajador.salario)}</td>
                            <td>{trabajador.banco}</td>
                            <td>{trabajador.tipo_cuenta}</td>
                            <td>{trabajador.numero_cuenta}</td>
                            <td>
                                <button className={styles.actionButton} onClick={() => openEditModal(trabajador.id)}><UserPen /></button>
                                <button className={styles.actionButton} onClick={() => openModal(trabajador.id, 'devengados')}><CirclePlus /></button>
                                <button className={styles.actionButton} onClick={() => openModal(trabajador.id, 'deducciones')}><CircleMinus /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedTrabajador && modalType && (
                <ModalDetails
                    isOpen={!!selectedTrabajador}
                    onClose={closeModal}
                    trabajadorId={selectedTrabajador}
                    type={modalType}
                />
            )}
            {editModalOpen && (
                <ModalEditWorker
                    isOpen={editModalOpen}
                    onClose={closeEditModal}
                    trabajadorId={selectedTrabajador}
                    onUpdate={onUpdate}
                />
            )}
        </div>
    );
}