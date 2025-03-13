"use client";
import { UserPen } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import styles from './TableTrainer.module.css';
import ModalEditTrainer from '../modalEditTrainer/ModalEditTrainer';

export default function TableTrainer({ onUpdate }) {
    const [trainers, setTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const openEditModal = (trainerId) => {
        setSelectedTrainer(trainerId);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedTrainer(null);
        setEditModalOpen(false);
    };

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/instructores');
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
                }
                const data = await response.json();
                console.log('Fetched trainers:', data);
                setTrainers(data);
            } catch (error) {
                console.error('Error fetching trainers:', error);
            }
        };

        fetchTrainers();
    }, [onUpdate]);

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Documento</th>
                        <th>Banco</th>
                        <th>Tipo de cuenta</th>
                        <th>Numero de Cuenta</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {trainers.map(trainer => (
                        <tr key={trainer.id}>
                            <td>{trainer.nombre}</td>
                            <td>{trainer.email}</td>
                            <td>{trainer.documento}</td>
                            <td>{trainer.banco}</td>
                            <td>{trainer.tipo_cuenta}</td>
                            <td>{trainer.numero_cuenta}</td>
                            <td>
                                <button className={styles.actionButton} onClick={() => openEditModal(trainer.id)}><UserPen /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editModalOpen && (
                <ModalEditTrainer
                    isOpen={editModalOpen}
                    onClose={closeEditModal}
                    trainerId={selectedTrainer}
                    onUpdate={onUpdate}
                />
            )}
        </div>
    );
}