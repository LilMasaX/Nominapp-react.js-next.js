"use client";
import { UserPen } from 'lucide-react';
import React, { useState } from 'react';
import styles from './TableProveedores.module.css';
import ModalEdit from '../modalEdit/ModalEdit';

export default function TableProveedores({ proveedores, onUpdate }) {
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8; // Número de filas por página

  const proveedorFields = [
    { name: "nombre", label: "Razon Social", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "nit", label: "NIT", type: "number", required: true },
    { name: "telefono", label: "Telefono", type: "text", required: true },
    { name: "numero_cuenta", label: "Numero de Cuenta", type: "text", required: true },
    { 
      name: "tipo_cuenta", 
      label: "Tipo de Cuenta", 
      type: "select", 
      required: true,
      options: [
        { value: "ahorros", label: "Ahorros" },
        { value: "corriente", label: "Corriente" },
      ],
    },
    { name: "banco", label: "Banco", type: "text", required: true },
  ];

  const openEditModal = (proveedorId) => {
    setSelectedProveedor(proveedorId);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedProveedor(null);
    setEditModalOpen(false);
  };

  // Calcular los datos para la página actual
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentProveedores = proveedores.slice(indexOfFirstRow, indexOfLastRow);

  // Cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Razon Social</th>
            <th>Email</th>
            <th>NIT</th>
            <th>Banco</th>
            <th>Tipo de cuenta</th>
            <th>Numero de Cuenta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentProveedores.map((proveedor) => (
            <tr key={proveedor.id}>
              <td>{proveedor.nombre}</td>
              <td>{proveedor.email}</td>
              <td>{proveedor.nit}</td>
              <td>{proveedor.banco}</td>
              <td>{proveedor.tipo_cuenta}</td>
              <td>{proveedor.numero_cuenta}</td>
              <td>
                <button
                  className={styles.actionButton}
                  onClick={() => openEditModal(proveedor.id)}
                >
                  <UserPen />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(proveedores.length / rowsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {editModalOpen && (
        <ModalEdit
          isOpen={editModalOpen}
          onClose={closeEditModal}
          itemId={selectedProveedor}
          onUpdate={onUpdate}
          fields={proveedorFields}
          endpoint={`http://localhost:4000/api/proveedores`}
          title={"Proveedor"}
          buttonText={"Actualizar proveedor"}
        />
      )}
    </div>
  );
}