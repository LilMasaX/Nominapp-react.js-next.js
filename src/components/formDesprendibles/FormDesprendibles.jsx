"use client";
import React, { useState, useEffect } from "react";
import styles from "./FormDesprendibles.module.css";
import { calculatePayment } from "../../utils/calculatePayment";
import { Plus, Minus } from "lucide-react";

export default function FormDesprendibles() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [selectedTrabajador, setSelectedTrabajador] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [devengados, setDevengados] = useState([{ concepto: '', valor: '' }]);
  const [deducciones, setDeducciones] = useState([{ concepto: '', valor: '' }]);
  const [dbDevengados, setDbDevengados] = useState([]);
  const [dbDeducciones, setDbDeducciones] = useState([]);

  useEffect(() => {
    // Obtener la lista de trabajadores desde la API
    fetch('/api/trabajadores')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setTrabajadores(data))
      .catch(error => console.error('Error fetching trabajadores:', error));
  }, []);

  useEffect(() => {
    if (selectedTrabajador) {
      // Obtener los devengados y deducciones del trabajador desde la base de datos
      fetch(`/api/devengados?trabajadorId=${selectedTrabajador}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setDbDevengados(data))
        .catch(error => console.error('Error fetching devengados:', error));

      fetch(`/api/deducciones?trabajadorId=${selectedTrabajador}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setDbDeducciones(data))
        .catch(error => console.error('Error fetching deducciones:', error));
    }
  }, [selectedTrabajador]);

  const handleDevengadosChange = (index, event) => {
    const { name, value } = event.target;
    const newDevengados = [...devengados];
    newDevengados[index][name] = value;
    setDevengados(newDevengados);
  };

  const handleDeduccionesChange = (index, event) => {
    const { name, value } = event.target;
    const newDeducciones = [...deducciones];
    newDeducciones[index][name] = value;
    setDeducciones(newDeducciones);
  };

  const handleAddDevengado = () => {
    setDevengados([...devengados, { concepto: '', valor: '' }]);
  };

  const handleAddDeduccion = () => {
    setDeducciones([...deducciones, { concepto: '', valor: '' }]);
  };

  const handleRemoveDevengado = (index) => {
    const newDevengados = devengados.filter((_, i) => i !== index);
    setDevengados(newDevengados);
  };

  const handleRemoveDeduccion = (index) => {
    const newDeducciones = deducciones.filter((_, i) => i !== index);
    setDeducciones(newDeducciones);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Lógica para manejar los datos del formulario
    console.log({
      trabajador: selectedTrabajador,
      fechaInicio,
      fechaFin,
      devengados,
      deducciones
    });
  };

  const handleGenerateExcel = async () => {
    try {
      // Validación básica
      if (trabajadores.length === 0) {
        throw new Error("La lista de trabajadores no se ha cargado aún.");
      }
      if (!selectedTrabajador) throw new Error("Selecciona un trabajador");
      if (!fechaInicio || !fechaFin) throw new Error("Ingresa las fechas de inicio y fin");

      const trabajador = trabajadores.find(t => t.id === Number(selectedTrabajador));
      if (!trabajador) throw new Error("Trabajador no encontrado");

      // Convertir valores numéricos
      const processedDevengados = devengados.map(d => ({
        concepto: d.concepto,
        valor: Number(d.valor) || 0
      }));

      const processedDeducciones = deducciones.map(d => ({
        concepto: d.concepto,
        valor: Number(d.valor) || 0
      }));

      const valorAPagar = calculatePayment(processedDevengados, processedDeducciones, dbDevengados, dbDeducciones);

      // Agregar console.log para ver el manejo de valorAPagar
      console.log("Valor a pagar calculado:", valorAPagar);

      const response = await fetch('/api/sendExcel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trabajador, fechaInicio, fechaFin, devengados: processedDevengados, deducciones: processedDeducciones, valorAPagar, dbDevengados, dbDeducciones }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido");
      }

      // Descargar archivo
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `desprendible_${trabajador.nombre}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error("Error en generación:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <div className="card-wrapper">
        <div className="card">
          <h1>Desprendibles</h1>
          <form onSubmit={handleSubmit}>
            <label>Selecciona el trabajador</label>
            <select
              className={styles.inputField}
              name="trabajadores"
              id="workers"
              value={selectedTrabajador}
              onChange={(e) => setSelectedTrabajador(e.target.value)}
              required
            >
              <option value="">Seleccione un trabajador</option>
              {trabajadores.map((trabajador) => (
                <option key={trabajador.id} value={trabajador.id}>
                  {trabajador.nombre}
                </option>
              ))}
            </select>
            <br />
            <label htmlFor="fechaInicio">Fecha de inicio</label>
            <input
              type="date"
              className={styles.inputField}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
            <br />
            <label htmlFor="fechaFin">Fecha de fin</label>
            <input
              type="date"
              className={styles.inputField}
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
            />
            <br />
            <label htmlFor="devengados">Agregar Devengados</label>
            {devengados.map((devengado, index) => (
              <div key={index} className={styles.inputGroup}>
                <input
                  className={styles.inputField}
                  type="text"
                  name="concepto"
                  placeholder="Concepto"
                  value={devengado.concepto}
                  onChange={(e) => handleDevengadosChange(index, e)}
                />
                <input
                  className={styles.inputField}
                  type="number"
                  name="valor"
                  placeholder="Valor"
                  value={devengado.valor}
                  onChange={(e) => handleDevengadosChange(index, e)}
                />
                <button type="button" className={styles.btnRemove} onClick={() => handleRemoveDevengado(index)}><Minus/></button>
              </div>
            ))}
            <button type="button" className={styles.btnAdd} onClick={handleAddDevengado}><Plus/></button>
            <br />
            <label htmlFor="deducciones">Agregar Deducciones</label>
            {deducciones.map((deduccion, index) => (
              <div key={index} className={styles.inputGroup}>
                <input
                  className={styles.inputField}
                  type="text"
                  name="concepto"
                  placeholder="Concepto"
                  value={deduccion.concepto}
                  onChange={(e) => handleDeduccionesChange(index, e)}
                />
                <input
                  className={styles.inputField}
                  type="number"
                  name="valor"
                  placeholder="Valor"
                  value={deduccion.valor}
                  onChange={(e) => handleDeduccionesChange(index, e)}
                />
                <button type="button" className={styles.btnRemove} onClick={() => handleRemoveDeduccion(index)}><Minus/></button>
              </div>
            ))}
            <button type="button" className={styles.btnAdd} onClick={handleAddDeduccion}><Plus/></button>
            <br />
            <button className="btn-add" type="submit">Enviar Desprendible</button>
            <button className="btn-add" type="button" onClick={handleGenerateExcel}>Generar Desprendible</button>
          </form>
        </div>
      </div>
    </div>
  );
}