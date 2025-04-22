"use client";
import React, { useState, useEffect } from 'react';
import ModalAdd from '@/components/modalAdd/ModalAdd';
import TableEmpleados from '@/components/tableEmpleados/TableEmpleados';

export default function Empleados() {
  const [trabajadores, setTrabajadores] = useState([]);

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
  ]

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
      <ModalAdd
       fields={workerFields}
       buttonText="Agregar Trabajador"
       endpoint="http://localhost:4000/api/trabajadores"
       onAdd={fetchTrabajadores} 
       title="Trabajador"
       
       />
      <TableEmpleados trabajadores={trabajadores} onUpdate={fetchTrabajadores} />
    </>
  );
}