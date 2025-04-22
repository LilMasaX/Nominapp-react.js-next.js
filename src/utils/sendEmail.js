import { toast } from 'react-hot-toast';

export async function sendEmail({
  persona,
  tipoPersona,
  fechaInicio,
  fechaFin,
  devengados,
  deducciones,
  valorAPagar,
  dbDevengados,
  dbDeducciones,
  anotaciones,
  selectedFile,
}) {
  try {
    if (!persona || !persona.email) {
      throw new Error('No se ha seleccionado una persona o no tiene email');
    }

    const toastId = toast.loading('Generando y enviando el correo...');

    // Generar el PDF
    const generateResponse = await fetch('http://localhost:4000/api/generateExcel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tipoPersona,
        persona: {
          id: persona.id,
          nombre: persona.nombre, // Siempre usar persona.nombre
          documento: persona.documento || persona.nit,
          cargo: persona.cargo || 'No aplica',
          salario: persona.salario || 0,
        },
        fechaInicio,
        fechaFin,
        devengados,
        deducciones,
        valorAPagar,
        dbDevengados,
        dbDeducciones,
      }),
    });

    if (!generateResponse.ok) {
      toast.dismiss(toastId);
      throw new Error('Error al generar el PDF');
    }

    // Obtener el PDF en formato base64 desde el endpoint
    const { pdfBase64, historialId } = await generateResponse.json();

    const cuerpoHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .header { color: #2c3e50; font-size: 18px; }
          .detalles { margin: 15px 0; padding: 10px; background: #f8f9fa; }
          .firma { margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px; }
        </style>
      </head>
      <body>
        <p class="header">Buen día ${persona.nombre},</p> 
        
        <p>Adjunto encontrará su desprendible de pago correspondiente al periodo:</p>
        
        <div class="detalles">
          <p><strong>Fecha fin:</strong> ${fechaInicio} - ${fechaFin}</p>
        </div>

        <p><strong>Importante:</strong></p>
        <ul>
          <li>Conserve este documento para sus registros</li>
          <li>Reporte inconsistencias a lideradmin@centicsas.com.co</li>
          <li>Este correo es un correo automatico por lo tanto no recibe respuestas ni correos entrantes.</li>
        </ul>
        ${anotaciones ? `<h2>Anotaciones</h2><p>${anotaciones}</p>` : ''}
      </body>
      </html>
    `;

    let attachedFileBase64 = null;
    if (selectedFile) {
      const reader = new FileReader();
      attachedFileBase64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]); // Extraer base64 del Data URL
        reader.onerror = () => reject(new Error('Error al leer el archivo seleccionado'));
        reader.readAsDataURL(selectedFile);
      });
    }

    // Enviar el correo
    const sendResponse = await fetch('http://localhost:4000/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: persona.email,
        subject: `Desprendible de Pago - ${persona.nombre} - ${fechaFin} - CENTIC SAS`, // Siempre usar persona.nombre
        htmlContent: cuerpoHTML,
        pdfBase64,
        historialId,
        attachedFileBase64,
        persona: {
          nombre: persona.nombre, // Siempre usar persona.nombre
        },
        fechaFin,
      }),
    });

    if (!sendResponse.ok) {
      toast.dismiss(toastId);
      throw new Error('Error al enviar el correo');
    }

    toast.dismiss(toastId);
    toast.success('Desprendible enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el desprendible:', error);
    toast.error('Error al enviar el desprendible: ' + error.message);
  }
}