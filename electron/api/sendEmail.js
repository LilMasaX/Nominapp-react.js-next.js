const express = require('express');
const { Resend } = require('resend');
const db = require('../db/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { to, subject, htmlContent, pdfBase64, attachedFileBase64, historialId, persona, tipoPersona, fechaFin } = req.body;

  try {
    // Validar los datos recibidos
    if (!to || !subject || !htmlContent || !pdfBase64) {
      return res.status(400).json({ error: 'Faltan datos requeridos (to, subject, htmlContent, pdfBase64)' });
    }

    // Convertir la cadena base64 del PDF a Buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    if (!Buffer.isBuffer(pdfBuffer)) {
      throw new Error('El PDF no es un buffer válido');
    }

    // Convertir la cadena base64 del archivo adjunto a Buffer (si existe)
    let attachedFileBuffer = null;
    if (attachedFileBase64) {
      attachedFileBuffer = Buffer.from(attachedFileBase64, 'base64');
      if (!Buffer.isBuffer(attachedFileBuffer)) {
        throw new Error('El archivo adjunto no es un buffer válido');
      }
    }

    // Configurar los adjuntos
    const personaNombre = tipoPersona === 'proveedores' ? persona.razon_social : persona.nombre;
    const attachments = [
      {
        filename: `desprendible_${personaNombre}_${fechaFin}.pdf`,
        content: pdfBuffer,
        encoding: 'binary',
      },
    ];

    // Agregar el archivo adjunto si existe
    if (attachedFileBuffer) {
      attachments.push({
        filename: `comprobante_pago_${personaNombre}_${fechaFin}.pdf`,
        content: attachedFileBuffer,
        encoding: 'binary',
      });
    }

    // Enviar el correo con Resend
    const resend = new Resend(''); // Reemplaza con tu clave de API de Resend
    await resend.emails.send({
      from: 'desprendibles@centicsas.com.co',
      to: to,
      subject: subject,
      html: htmlContent,
      attachments,
    });

    // Actualizar el historial en la base de datos
    const stmt = db.prepare(`
      UPDATE historial
      SET fecha_envio = datetime('now'), estado = 'Enviado', nombre_persona = ?
      WHERE id = ?
    `);
    stmt.run(personaNombre, historialId);

    res.json({ success: true });
  } catch (error) {
    // Actualizar el historial en caso de error
    const stmt = db.prepare(`
      UPDATE historial
      SET estado = 'fallido', nombre_persona = ?
      WHERE id = ?
    `);
    stmt.run(persona.nombre || persona.razon_social, historialId);

    console.error('Error detallado:', {
      message: error.message,
      stack: error.stack,
      raw: error.originalError || error,
    });
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;