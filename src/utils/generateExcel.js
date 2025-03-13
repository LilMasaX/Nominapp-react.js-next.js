export async function generateExcel(trabajador, fechaInicio, fechaFin, devengados, deducciones, valorAPagar, dbDevengados, dbDeducciones) {
    const response = await fetch('http://localhost:3000/api/generateExcel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            trabajador,
            fechaInicio,
            fechaFin,
            devengados,
            deducciones,
            valorAPagar,
            dbDevengados,
            dbDeducciones,
        }),
    });

    if (!response.ok) {
        throw new Error('Error al generar el Excel');
    }

    return response.json();
}