"use client";
import React, { useState, useEffect } from 'react';
import ModalWorkers from '@/components/modalWorkers/ModalWorkers';
import TableEmpleados from '@/components/tableEmpleados/TableEmpleados';

export default function Empleados() {
  const [trabajadores, setTrabajadores] = useState([]);

  const fetchTrabajadores = () => {
    fetch('/api/trabajadores')
      .then(response => response.json())
      .then(data => setTrabajadores(data))
      .catch(error => console.error('Error fetching trabajadores:', error));
  };

  useEffect(() => {
    fetchTrabajadores();
  }, []);

  return (
    <>
      <h1>Empleados</h1>
      <ModalWorkers onAddTrabajador={fetchTrabajadores} />
      <TableEmpleados trabajadores={trabajadores} onUpdate={fetchTrabajadores} />
    </>
  );
}