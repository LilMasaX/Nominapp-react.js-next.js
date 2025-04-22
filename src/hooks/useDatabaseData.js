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
            if (!trabajadorId) {
                console.log('No se proporcionó trabajadorId, omitiendo fetch.');
                return;
            }

            try {
                console.log(`Cargando datos para trabajadorId: ${trabajadorId}`);

                const [devRes, dedRes] = await Promise.all([
                    fetch(`http://localhost:4000/api/devengados?trabajadorId=${trabajadorId}`),
                    fetch(`http://localhost:4000/api/deducciones?trabajadorId=${trabajadorId}`)
                ]);

                if (!devRes.ok || !dedRes.ok) {
                    throw new Error(
                        `Error en las respuestas del servidor: Devengados (${devRes.status}), Deducciones (${dedRes.status})`
                    );
                }

                const devengados = await devRes.json();
                const deducciones = await dedRes.json();

                // Validar que los datos sean arrays
                if (!Array.isArray(devengados) || !Array.isArray(deducciones)) {
                    throw new Error('Los datos recibidos no son arrays');
                }

                setDbData({
                    devengados: devengados.map(d => ({ ...d, origen: 'db' })),
                    deducciones: deducciones.map(d => ({ ...d, origen: 'db' })),
                    loading: false,
                    error: null
                });

                console.log('Datos cargados correctamente:', {
                    devengados,
                    deducciones
                });
            } catch (error) {
                console.error('Error al cargar los datos de la base de datos:', error);
                setDbData(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message || 'Error cargando datos de la base de datos'
                }));
            }
        };

        fetchData();
    }, [trabajadorId]);

    return dbData;
};