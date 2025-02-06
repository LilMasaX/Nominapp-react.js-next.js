import { generateExcel } from '@/utils/generateExcel';

export async function POST(req) {
    try {
        const { trabajador, fechaInicio, fechaFin, devengados, deducciones, valorAPagar, dbDevengados, dbDeducciones } = await req.json();

        // Validación de datos obligatorios
        if (!trabajador?.id || !fechaInicio || !fechaFin) {
            return new Response(JSON.stringify({ error: 'Datos incompletos' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const pdfBuffer = await generateExcel(trabajador, fechaInicio, fechaFin, devengados, deducciones, valorAPagar, dbDevengados, dbDeducciones);

        return new Response(pdfBuffer, {
            headers: {
                'Content-Disposition': `attachment; filename=desprendible_${trabajador.id}.pdf`,
                'Content-Type': 'application/pdf',
            },
        });
    } catch (error) {
        console.error('Error en API:', error);
        return new Response(JSON.stringify({ 
            error: error.message || 'Error generando PDF',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}