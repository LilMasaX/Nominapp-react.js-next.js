"use client";
import ModalAdd from '@/components/modalAdd/ModalAdd';
import TableProveedores from '@/components/tableProveedores/TableProveedores';
import React, { useState, useEffect } from 'react';

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedorId, setSelectedProveedorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const fetchProveedores = () => {
    fetch('http://localhost:4000/api/proveedores')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched proveedores:', data);
        setProveedores(data);
      })
      .catch(error => console.error('Error fetching proveedores:', error));
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleEditProveedor = (proveedorId) => {
    console.log('Editing proveedor with ID:', proveedorId);
    setSelectedProveedorId(proveedorId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setSelectedProveedorId(null);
  };

  const handleAddProveedor = () => {
    fetchProveedores();
  };

  return (
    <>
      <h1>Proveedores</h1>
      <ModalAdd
        fields={proveedorFields}
        endpoint="http://localhost:4000/api/proveedores"
        title="Proveedores"
        buttonText="Agregar proveedor"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        proveedorId={selectedProveedorId}
        onAdd={handleAddProveedor} 
      />
      <TableProveedores proveedores={proveedores} onEdit={handleEditProveedor} onUpdate={handleAddProveedor} />
    </>
  );
}