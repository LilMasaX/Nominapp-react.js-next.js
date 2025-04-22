"use client";
import ModalAdd from '@/components/modalAdd/ModalAdd';
import TableTrainer from '@/components/tableTrainer/TableTrainer';
import React, { useState, useEffect } from 'react';

export default function Instructores() {
  const [trainer, setTrainer] = useState([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const trainerFields = [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "documento", label: "Documento", type: "number", required: true },
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
  ]

  const fetchTrainer = () => {
    fetch('http://localhost:4000/api/instructores')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched trainers:', data);
        setTrainer(data);
      })
      .catch(error => console.error('Error fetching trainers:', error));
  };

  useEffect(() => {
    fetchTrainer();
  }, []);

  const handleEditTrainer = (trainerId) => {
    console.log('Editing trainer with ID:', trainerId);
    setSelectedTrainerId(trainerId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setSelectedTrainerId(null);
  };

  const handleAddTrainer = () => {
    fetchTrainer();
  };

  return (
    <>
      <h1>Instructores</h1>
      <ModalAdd
        fields={trainerFields}
        endpoint="http://localhost:4000/api/instructores"
        title="Instructor"
        buttonText="Agregar Instructor"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        trainerId={selectedTrainerId}
        onAdd={handleAddTrainer} 
      />
      <TableTrainer trainers={trainer} onEdit={handleEditTrainer} onUpdate={handleAddTrainer} /> {/* Pasar la función onUpdate */}
    </>
  );
}