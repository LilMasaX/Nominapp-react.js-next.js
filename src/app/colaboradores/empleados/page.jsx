"use client";
import React, { useState, useEffect } from 'react';
import ModalWorkers from '@/components/modalWorkers/ModalWorkers';
import TableEmpleados from '@/components/tableEmpleados/TableEmpleados';

export default function Empleados() {
  const [trabajadores, setTrabajadores] = useState([]);

  const fetchTrabajadores = () => {
    fetch("http://localhost:4000/api/trabajadores")
      .then(response => {
        if (!response.ok) throw new Error("Error en la respuesta del servidor");
        return response.json();
      })
      .then(data => {
        // Asegúrate de que data sea un array
        if (Array.isArray(data)) {
          setTrabajadores(data);
        } else {
          console.error("La respuesta no es un array:", data);
          setTrabajadores([]);
        }
      })
      .catch(error => console.error("Error:", error));
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