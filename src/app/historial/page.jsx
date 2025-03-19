'use client';
import { useState, useEffect } from 'react';
import HistorialTable from '@/components/tableHistorial/TableHistorial';
import Card from '@/components/card/Card';

export default function HistorialDesprendibles() {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistorial = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/historial'); 
                const data = await res.json();
                // Asegúrate de que data sea un array
                if (Array.isArray(data)) {
                    setHistorial(data);
                } else {
                    console.error('El historial no es un array:', data);
                }
            } catch (error) {
                console.error('Error al cargar el historial:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistorial();
    }, []);

    if (loading) return <p>Cargando historial...</p>;

    return (
        <Card size='md'>
            <h1>Historial de Desprendibles</h1>
            <HistorialTable historial={historial} />
        </Card>
    );
}