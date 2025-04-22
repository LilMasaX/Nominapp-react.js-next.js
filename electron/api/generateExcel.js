const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const ExcelJS = require('exceljs');
const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');
const tmp = require('tmp');
const db = require('../db/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    tipoPersona, // 'trabajadores', 'instructores', 'proveedores'
    persona, // { id, nombre, documento, cargo, salario }
    fechaInicio,
    fechaFin,
    devengados = [],
    deducciones = [],
    valorAPagar,
    dbDevengados = [],
    dbDeducciones = [],
  } = req.body;

  try {
    console.log('Datos recibidos del cliente:', req.body);

    // Validar que la persona existe en la base de datos
    let personaExiste;
    if (tipoPersona === 'trabajadores') {
      personaExiste = db.prepare('SELECT id FROM trabajadores WHERE id = ?').get(persona.id);
    } else if (tipoPersona === 'instructores') {
      personaExiste = db.prepare('SELECT id FROM instructores WHERE id = ?').get(persona.id);
    } else if (tipoPersona === 'proveedores') {
      personaExiste = db.prepare('SELECT id FROM proveedores WHERE id = ?').get(persona.id);
    }

    if (!personaExiste) {
      throw new Error(`La persona seleccionada no existe en la base de datos (${tipoPersona})`);
    }

    // Validar que el campo nombre esté presente
    if (!persona.nombre || persona.nombre.trim() === '') {
      throw new Error('El campo "nombre" no está definido o está vacío para la persona seleccionada');
    }

    // Definir la ruta de la plantilla de Excel
    const templatePath = path.join(__dirname, '..', '..', 'public', 'templates', 'desprendible.xlsx');
    console.log('Ruta de la plantilla:', templatePath);

    // Verificar si el archivo existe
    try {
      await fs.access(templatePath);
      console.log('El archivo existe y es accesible');
    } catch (err) {
      throw new Error(`No se pudo acceder al archivo en ${templatePath}: ${err.message}`);
    }

    // Leer la plantilla de Excel
    const templateBuffer = await fs.readFile(templatePath);

    // Crear un nuevo libro de Excel y cargarlo desde el buffer
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(templateBuffer);

    // Obtener la hoja de trabajo
    const worksheet = workbook.getWorksheet('desprendible');
    if (!worksheet) {
      throw new Error('La hoja "desprendible" no existe en la plantilla');
    }

    // Configurar la hoja para impresión
    worksheet.pageSetup = {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
    };

    // Llenar datos de la persona
    worksheet.getCell('A1').value =
      tipoPersona === 'trabajadores' ? 'Comprobante de Nómina' : 'Comprobante de Pago';
    worksheet.getCell('C9').value = tipoPersona === 'trabajadores' ? 'Cargo:' : '';
    worksheet.getCell('C10').value = tipoPersona === 'trabajadores' ? 'Salario básico:' : '';
    worksheet.getCell('D5').value = `${fechaInicio} - ${fechaFin}`;

    // Leer el número de comprobante desde comprobante.json
    const comprobantePath = path.join(__dirname, '..', '..', 'public', 'comprobante.json');
    let comprobanteData = await fs.readFile(comprobantePath, 'utf8');
    let comprobante = JSON.parse(comprobanteData).numero;

    // Incrementar el número de comprobante
    comprobante += 1;

    // Guardar el nuevo número en comprobante.json
    await fs.writeFile(comprobantePath, JSON.stringify({ numero: comprobante }, null, 2));

    // Usar el número de comprobante en la celda D6
    worksheet.getCell('D6').value = `${new Date().getFullYear()}-${comprobante}`;

    worksheet.getCell('D7').value = persona.nombre;
    worksheet.getCell('D8').value = `${persona.documento}`;
    worksheet.getCell('D9').value = persona.cargo ? `${persona.cargo}` : '';
    worksheet.getCell('D10').value = persona.salario ? formatCurrency(persona.salario) : '';

    // Función para llenar devengados y deducciones
    const fillAlignedData = (startRow, devengadosList = [], deduccionesList = []) => {
      const maxLength = Math.max(devengadosList.length, deduccionesList.length);
      for (let index = 0; index < maxLength; index++) {
        const currentRow = startRow + index;
        if (devengadosList[index]?.concepto) {
          worksheet.getCell(`A${currentRow}`).value = devengadosList[index].concepto;
          worksheet.getCell(`B${currentRow}`).value = formatCurrency(devengadosList[index].valor);
        }
        if (deduccionesList[index]?.concepto) {
          worksheet.getCell(`C${currentRow}`).value = deduccionesList[index].concepto;
          worksheet.getCell(`D${currentRow}`).value = formatCurrency(deduccionesList[index].valor);
        }
      }
      return startRow + maxLength;
    };

    // Llenar datos de la base de datos y manuales
    let currentRow = 13;
    currentRow = fillAlignedData(currentRow, dbDevengados, dbDeducciones);
    fillAlignedData(currentRow, devengados, deducciones);

    // Llenar valor a pagar
    worksheet.getCell('D18').value = formatCurrency(valorAPagar);

    // Generar el buffer del archivo Excel
    const excelBuffer = await workbook.xlsx.writeBuffer();

    // Crear un archivo temporal para el Excel
    const tempFile = tmp.fileSync({ postfix: '.xlsx' });
    await fs.writeFile(tempFile.name, excelBuffer);

    // Inicializar ILovePDF con tus claves
    const instance = new ILovePDFApi(
      '',
      ''
    );
    const task = instance.newTask('officepdf');

    await task.start();
    const file = new ILovePDFFile(tempFile.name);
    await task.addFile(file);
    console.log('Archivo agregado a la tarea:', file.name);

    await task.process({});
    console.log('Tarea procesada:', task.id);

    const pdfBuffer = await task.download();
    console.log('PDF descargado con éxito');

    const pdfBase64 = pdfBuffer.toString('base64');

    // Insertar en la tabla historial
    const stmt = db.prepare(`
      INSERT INTO historial (persona_id, tipo_persona, nombre_persona, fecha_generacion, estado)
      VALUES (?, ?, ?, datetime('now'), 'Generado')
    `);
    const info = stmt.run(persona.id, tipoPersona, persona.nombre);
    const historialId = info.lastInsertRowid;

    // Enviar respuesta al cliente
    res.json({ pdfBase64, historialId });
  } catch (error) {
    console.error('Error al generar el Excel o convertir a PDF:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Función auxiliar para formatear moneda
const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(value);

module.exports = router;