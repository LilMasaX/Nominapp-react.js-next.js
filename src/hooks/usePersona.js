import { useState, useEffect } from 'react';

export const usePersona = () => {
  const [tipoPersona, setTipoPersona] = useState('trabajadores');
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('');

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const endpoint =
          tipoPersona === 'trabajadores'
            ? 'http://localhost:4000/api/trabajadores'
            : tipoPersona === 'instructores'
            ? 'http://localhost:4000/api/instructores'
            : 'http://localhost:4000/api/proveedores';

        const response = await fetch(endpoint);
        const data = await response.json();

        // Verifica los datos en la consola para depuración
        console.log(`Datos obtenidos para ${tipoPersona}:`, data);

        setPersonas(data);
      } catch (error) {
        console.error(`Error al obtener ${tipoPersona}:`, error);
      }
    };

    fetchPersonas();
  }, [tipoPersona]);

  return {
    tipoPersona,
    personas,
    selectedPersona,
    setTipoPersona,
    setSelectedPersona,
  };
};