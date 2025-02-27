import { useState, useEffect } from 'react';

export const useDynamicFields = (tipoPersona, selectedPersona) => {
    const [devengados, setDevengados] = useState([{ concepto: '', valor: '' }]);
    const [deducciones, setDeducciones] = useState([{ concepto: '', valor: '' }]);
    const [dbDevengados, setDbDevengados] = useState([]);
    const [dbDeducciones, setDbDeducciones] = useState([]);

    useEffect(() => {
        if (tipoPersona === 'trabajadores' && selectedPersona) {
            const fetchData = async () => {
                try {
                    const [devResponse, dedResponse] = await Promise.all([
                        fetch(`/api/devengados?personaId=${selectedPersona}`),
                        fetch(`/api/deducciones?personaId=${selectedPersona}`)
                    ]);

                    setDbDevengados(await devResponse.json());
                    setDbDeducciones(await dedResponse.json());
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        } else {
            setDbDevengados([]);
            setDbDeducciones([]);
        }
    }, [tipoPersona, selectedPersona]);

    return {
        devengados,
        deducciones,
        dbDevengados,
        dbDeducciones,
        setDevengados,
        setDeducciones
    };
};