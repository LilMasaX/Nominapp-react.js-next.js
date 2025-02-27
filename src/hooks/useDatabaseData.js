import { useState, useEffect } from 'react';

export const useDatabaseData = (trabajadorId) => {
    const [dbData, setDbData] = useState({
        devengados: [],
        deducciones: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!trabajadorId) return;

            try {
                const [devRes, dedRes] = await Promise.all([
                    fetch(`/api/devengados?trabajadorId=${trabajadorId}`),
                    fetch(`/api/deducciones?trabajadorId=${trabajadorId}`)
                ]);

                const devengados = await devRes.json();
                const deducciones = await dedRes.json();

                setDbData({
                    devengados: devengados.map(d => ({ ...d, origen: 'db' })),
                    deducciones: deducciones.map(d => ({ ...d, origen: 'db' })),
                    loading: false,
                    error: null
                });

            } catch (error) {
                setDbData(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Error cargando datos de la base de datos'
                }));
            }
        };

        fetchData();
    }, [trabajadorId]);

    return dbData;
};