"use client";
import { CircleMinus, CirclePlus, UserPen } from 'lucide-react';
import React, { useState } from 'react';
import styles from './TableEmpleados.module.css';
import ModalDetails from '../ModalDetails/ModalDetails';
import ModalEdit from '../modalEdit/ModalEdit';

export default function TableEmpleados({ trabajadores, onUpdate }) {
    const [selectedTrabajador, setSelectedTrabajador] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8; // Número de filas por página

    const workerFields = [
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "documento", label: "Documento", type: "number", required: true },
        { name: "telefono", label: "Telefono", type: "text", required: true },
        { name: "cargo", label: "Cargo", type: "text", required: true },
        { name: "salario", label: "Salario", type: "number", required: true },
        { 
          name:"tipo_cuenta",
          label:"Tipo de Cuenta",
          type:"select",
          required:true,
          options:[
            {value:"ahorros",label:"Ahorros"},
            {value:"corriente",label:"Corriente"}
          ]
        },
        { name: "numero_cuenta", label: "Numero de Cuenta", type: "text", required: true },
        { name: "banco", label: "Banco", type: "text", required: true },
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    };

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

    // Calcular los datos para la página actual
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentTrabajadores = trabajadores.slice(indexOfFirstRow, indexOfLastRow);

    // Cambiar de página
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                    {Array.isArray(currentTrabajadores) && currentTrabajadores.map(trabajador => ( // Verificar que trabajadores es un array
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

            {/* Paginación */}
            <div className={styles.pagination}>
                {Array.from({ length: Math.ceil(trabajadores.length / rowsPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {selectedTrabajador && modalType && (
                <ModalDetails
                    isOpen={!!selectedTrabajador}
                    onClose={closeModal}
                    trabajadorId={selectedTrabajador}
                    type={modalType}
                />
            )}
            {editModalOpen && (
                <ModalEdit
                    isOpen={editModalOpen}
                    onClose={closeEditModal}
                    fields={workerFields}
                    endpoint={`http://localhost:4000/api/trabajadores`}
                    title="Trabajador"
                    itemId={selectedTrabajador}
                    buttonText="Actualizar Trabajador"
                    onUpdate={onUpdate}
                />
            )}
        </div>
    );
}