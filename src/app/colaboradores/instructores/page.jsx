"use client";
import ModalTrainer from '@/components/modalTrainer/ModalTrainer';
import TableTrainer from '@/components/tableTrainer/TableTrainer';
import React, { useState, useEffect } from 'react';

export default function FormDesprendiblesPage() {
  const [trainer, setTrainer] = useState([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <ModalTrainer
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        trainerId={selectedTrainerId}
        onAddTrainer={handleAddTrainer} 
      />
      <TableTrainer trainers={trainer} onEdit={handleEditTrainer} onUpdate={handleAddTrainer} /> {/* Pasar la función onUpdate */}
    </>
  );
}