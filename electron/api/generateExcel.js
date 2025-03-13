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
        trabajador,
        fechaInicio,
        fechaFin,
        devengados = [],
        deducciones = [],
        valorAPagar,
        dbDevengados = [],
        dbDeducciones = []
    } = req.body;

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();

    // Ruta absoluta al archivo de plantilla
    const templatePath = path.join(
        process.cwd(),
        'public',
        'templates',
        'desprendible.xlsx'
    );

    try {
        // Leer la plantilla desde el sistema de archivos
        const templateBuffer = await fs.readFile(templatePath);
        await workbook.xlsx.load(templateBuffer);

        // Obtener la hoja de trabajo
        const worksheet = workbook.getWorksheet('desprendible');
        if (!worksheet) {
            throw new Error('La hoja "desprendible" no existe en la plantilla');
        }

        // Formatear valores como moneda colombiana
        const formatCurrency = (value) =>
            new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
            }).format(value);

        // Configurar la hoja para impresión
        worksheet.pageSetup = {
            orientation: 'landscape',
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 1,
        };

        // Leer el número de comprobante desde el archivo comprobante.json
        const comprobantePath = path.join(process.cwd(), 'public', 'comprobante.json');
        const comprobanteData = await fs.readFile(comprobantePath, 'utf8');
        const { comprobanteNumber } = JSON.parse(comprobanteData);
        const newComprobanteNumber = comprobanteNumber;

        // Llenar datos del trabajador
        worksheet.getCell('D5').value = `${fechaInicio} - ${fechaFin}`;
        worksheet.getCell('D6').value = `${new Date().getFullYear()}-${newComprobanteNumber}`;
        worksheet.getCell('D7').value = `${trabajador.nombre}`;
        worksheet.getCell('D8').value = `${trabajador.documento}`;
        worksheet.getCell('D9').value = trabajador.cargo ? `${trabajador.cargo}` : 'Instructor';
        worksheet.getCell('D10').value = trabajador.salario ? formatCurrency(trabajador.salario) : 'No aplica';

        // Función para llenar devengados y deducciones
        const fillAlignedData = (
            startRow,
            devengadosList = [],
            deduccionesList = []
        ) => {
            const maxLength = Math.max(devengadosList.length, deduccionesList.length);
            for (let index = 0; index < maxLength; index++) {
                const currentRow = startRow + index;
                if (devengadosList[index]?.concepto) {
                    worksheet.getCell(`A${currentRow}`).value =
                        devengadosList[index].concepto;
                    worksheet.getCell(`B${currentRow}`).value = formatCurrency(
                        devengadosList[index].valor
                    );
                }
                if (deduccionesList[index]?.concepto) {
                    worksheet.getCell(`C${currentRow}`).value =
                        deduccionesList[index].concepto;
                    worksheet.getCell(`D${currentRow}`).value = formatCurrency(
                        deduccionesList[index].valor
                    );
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
            process.env.ILOVEPDF_PUBLIC_KEY,
            process.env.ILOVEPDF_SECRET_KEY
        );
        const task = instance.newTask('officepdf');

        try {
            await task.start();
            console.log('Tarea iniciada');

            const file = new ILovePDFFile(tempFile.name);
            await task.addFile(file);
            console.log('Archivo agregado');

            await task.process({});
            console.log('Tarea procesada');

            const pdfBuffer = await task.download();
            console.log('PDF descargado');

            const pdfBase64 = pdfBuffer.toString('base64');

            const stmt = db.prepare(`
        INSERT INTO historial (trabajadores_id, fecha_generacion, estado)
        VALUES(?, datetime('now'), 'generado')
      `);

            const info = stmt.run(trabajador.id);
            const historialId = info.lastInsertRowid;

            // Incrementar el número de comprobante y guardar en comprobante.json
            const newComprobanteData = { comprobanteNumber: newComprobanteNumber + 1 };
            await fs.writeFile(comprobantePath, JSON.stringify(newComprobanteData, null, 2));

            res.json({ pdfBase64, historialId });
        } catch (error) {
            console.error('Error en la conversión a PDF:', error);
            throw error;
        } finally {
            // Eliminar el archivo temporal
            tempFile.removeCallback();
        }
    } catch (error) {
        console.error('Error al generar el Excel o convertir a PDF:', error);
        res.status(500).json({ error: 'Error al generar el Excel o convertir a PDF' });
    }
});

module.exports = router;