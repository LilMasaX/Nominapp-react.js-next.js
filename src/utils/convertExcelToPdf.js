import { getAuthToken } from '@/app/actions/getAuthToken';
import { startRequest } from '@/app/actions/startRequest';
import FormData from 'form-data';
import { Readable } from 'stream';

export async function convertExcelToPdf(excelBuffer) {
    try {
        // 1️⃣ Obtener el token de autenticación
        const token = await getAuthToken();
        console.log(' Token obtenido:', token);

        // 2️⃣ Iniciar la tarea
        const { server, task } = await startRequest(token);
        console.log(' Datos de tarea:', { server, task });

        if (!task || !server) throw new Error('🚨 Error: No se pudo obtener el Task ID o el servidor');

        // Subir el archivo a iLovePDF
        const uploadUrl = `https://${server}/v1/upload`;
        console.log(' URL de subida:', uploadUrl);

        const formData = new FormData();
        formData.append('task', task); // ✅ Enviar el `task` como campo de `FormData`
        formData.append('file', Readable.from(excelBuffer), { 
            filename: 'archivo.xlsx', 
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });

        console.log(' Subiendo archivo...');

        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders() // ✅ Headers correctos
            },
            body: formData
        });

        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            console.error(' Error en subida:', errorData);
            throw new Error(`Error en subida: ${errorData.error?.message || 'Desconocido'}`);
        }

        const uploadData = await uploadResponse.json();
        console.log(' Archivo subido con éxito:', uploadData);

        // 4️⃣ Procesar conversión
        const processUrl = `https://${server}/v1/process`;
        console.log(' URL de procesamiento:', processUrl);

        const processResponse = await fetch(processUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ task, tool: 'officepdf', output_filename: 'documento.pdf' }) // ✅ `task` en JSON body
        });

        if (!processResponse.ok) {
            const errorData = await processResponse.json();
            throw new Error(`Error en procesamiento: ${errorData.error?.message}`);
        }

        console.log('✅ Conversión exitosa');

        // 5️⃣ Descargar PDF
        const downloadUrl = `https://${server}/v1/download/${task}`;
        console.log(' URL de descarga:', downloadUrl);

        const downloadResponse = await fetch(downloadUrl, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/pdf' }
        });

        if (!downloadResponse.ok) throw new Error('Error en descarga');

        console.log('✅ PDF generado con éxito');
        return await downloadResponse.arrayBuffer();
    } catch (error) {
        console.error(' Error en conversión:', error);
        throw error;
    }
}
