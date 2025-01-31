import React, { useState, useEffect } from "react";
import styles from "./FormDesprendibles.module.css";
import { Plus,Minus } from "lucide-react";

export default function FormDesprendibles() {
    const [trabajadores, setTrabajadores] = useState([]);
    const [selectedTrabajador, setSelectedTrabajador] = useState('');
    const [fechaPago, setFechaPago] = useState('');
    const [devengados, setDevengados] = useState([{ concepto: '', valor: '' }]);
    const [deducciones, setDeducciones] = useState([{ concepto: '', valor: '' }]);

    useEffect(() => {
        // Obtener la lista de trabajadores desde la API
        fetch('/api/trabajadores')
            .then(response => response.json())
            .then(data => setTrabajadores(data))
            .catch(error => console.error('Error fetching trabajadores:', error));
    }, []);

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
            fechaPago,
            devengados,
            deducciones
        });
    };

    return (
        <div className="container">
            <div className="card-wrapper">
                <div className="card">
                    <h1>Desprendibles</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Selecciona el trabajador</label>
                        <select
                            className="input-field"
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
                        <label htmlFor="fecha">Fecha de pago </label>
                        <input
                            type="date"
                            className="input-field"
                            value={fechaPago}
                            onChange={(e) => setFechaPago(e.target.value)}
                            required
                        />
                        <br />
                        <label htmlFor="devengados">Agregar Devengados</label>
                        {devengados.map((devengado, index) => (
                            <div key={index} className={styles.inputGroup}>
                                <input
                                    className="input-field"
                                    type="text"
                                    name="concepto"
                                    placeholder="Concepto"
                                    value={devengado.concepto}
                                    onChange={(e) => handleDevengadosChange(index, e)}
                                    required
                                />
                                <input
                                    className="input-field"
                                    type="number"
                                    name="valor"
                                    placeholder="Valor"
                                    value={devengado.valor}
                                    onChange={(e) => handleDevengadosChange(index, e)}
                                    required
                                />
                                <button type="button" className={styles.btnRemove} onClick={() => handleRemoveDevengado(index)}><Minus /></button>
                            </div>
                        ))}
                        <button type="button" className={styles.btnAdd} onClick={handleAddDevengado}><Plus /></button>
                        <br />
                        <label htmlFor="deducciones">Agregar Deducciones</label>
                        {deducciones.map((deduccion, index) => (
                            <div key={index} className={styles.inputGroup}>
                                <input
                                    className="input-field"
                                    type="text"
                                    name="concepto"
                                    placeholder="Concepto"
                                    value={deduccion.concepto}
                                    onChange={(e) => handleDeduccionesChange(index, e)}
                                    required
                                />
                                <input
                                    className="input-field"
                                    type="number"
                                    name="valor"
                                    placeholder="Valor"
                                    value={deduccion.valor}
                                    onChange={(e) => handleDeduccionesChange(index, e)}
                                    required
                                />
                                <button type="button" className={styles.btnRemove} onClick={() => handleRemoveDeduccion(index)}><Minus /></button>
                            </div>
                        ))}
                        <button type="button" className={styles.btnAdd} onClick={handleAddDeduccion}><Plus /></button>
                        <br />
                        <button className='btn-add' type="submit">Enviar Desprendible</button>
                        <button className='btn-add' type="button">Generar Desprendible</button>
                    </form>
                </div>
            </div>
        </div>
    );
}