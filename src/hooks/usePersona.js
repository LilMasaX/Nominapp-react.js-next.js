import { useState, useEffect } from 'react';

export const usePersona = () => {
    const [tipoPersona, setTipoPersona] = useState('trabajadores');
    const [personas, setPersonas] = useState([]);
    const [selectedPersona, setSelectedPersona] = useState('');

    useEffect(() => {
        const fetchPersonas = async () => {
            try {
                const endpoint = tipoPersona === 'trabajadores'
                    ? 'http://localhost:4000/api/trabajadores'
                    : 'http://localhost:4000/api/instructores';

                const response = await fetch(endpoint);
                const data = await response.json();
                setPersonas(data);
            } catch (error) {
                console.error(`Error fetching ${tipoPersona}:`, error);
            }
        };

        fetchPersonas();
    }, [tipoPersona]);

    return {
        tipoPersona,
        personas,
        selectedPersona,
        setTipoPersona,
        setSelectedPersona
    };
};