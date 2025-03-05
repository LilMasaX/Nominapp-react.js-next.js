import { useState } from 'react';

export const useDynamicFields = () => {
    const [devengados, setDevengados] = useState([{ concepto: '', valor: '' }]);
    const [deducciones, setDeducciones] = useState([{ concepto: '', valor: '' }]);




    return {
        devengados,
        deducciones,
        setDevengados,
        setDeducciones
    };
};