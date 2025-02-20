import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { convertExcelToPdf } from './convertExcelToPdf';

export async function generateExcel(trabajador, fechaInicio, fechaFin, devengados = [], deducciones = [], valorAPagar, dbDevengados = [], dbDeducciones = []) {
    const workbook = new ExcelJS.Workbook();
    const templatePath = path.resolve(process.cwd(), "public/templates/desprendible.xlsx");
    if (!fs.existsSync(templatePath)) throw new Error("Plantilla Excel no encontrada");
    await workbook.xlsx.readFile(templatePath);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    }
    const worksheet = workbook.getWorksheet("desprendible");
    if (!worksheet) {
        throw new Error('La hoja "desprendible" no existe en la plantilla');
    }

    // Leer el último número de comprobante desde el archivo JSON
    const comprobantePath = path.resolve(process.cwd(), "public/comprobante.json");
    if (!fs.existsSync(comprobantePath)) throw new Error("Archivo comprobante.json no encontrado");
    const comprobanteData = JSON.parse(fs.readFileSync(comprobantePath, 'utf8'));
    const lastComprobanteNumber = comprobanteData.lastComprobanteNumber;

    // Generar un nuevo número de comprobante
    const newComprobanteNumber = lastComprobanteNumber + 1;

    // Actualizar el archivo JSON con el nuevo número de comprobante
    comprobanteData.lastComprobanteNumber = newComprobanteNumber;
    fs.writeFileSync(comprobantePath, JSON.stringify(comprobanteData, null, 2));

    // Llenar los datos del trabajador
    worksheet.getCell('D5').value = `${fechaInicio} - ${fechaFin}`;
    worksheet.getCell('D6').value = ` ${new Date().getFullYear()} - ${newComprobanteNumber}`;
    worksheet.getCell('D7').value = `${trabajador.nombre}`;
    worksheet.getCell('D8').value = `${trabajador.documento}`;
    worksheet.getCell('D9').value = `${trabajador.cargo}`;
    worksheet.getCell('D10').value = formatCurrency(trabajador.salario);

    // Función para llenar datos alineados por fila
    const fillAlignedData = (startRow, devengadosList = [], deduccionesList = []) => {
        const maxLength = Math.max(devengadosList.length, deduccionesList.length);
        
        for (let index = 0; index < maxLength; index++) {
            const currentRow = startRow + index;
            
            // Devengados
            if (devengadosList[index] && devengadosList[index].concepto) {
                worksheet.getCell(`A${currentRow}`).value = devengadosList[index].concepto;
                worksheet.getCell(`B${currentRow}`).value = devengadosList[index].valor || '';
            }
            
            // Deducciones
            if (deduccionesList[index] && deduccionesList[index].concepto) {
                worksheet.getCell(`C${currentRow}`).value = deduccionesList[index].concepto;
                worksheet.getCell(`D${currentRow}`).value = deduccionesList[index].valor || '';
            }
        }
        
        return startRow + maxLength; // Retorna la siguiente fila disponible
    };

    // Llenar datos de la base de datos
    let currentRow = 13;
    currentRow = fillAlignedData(currentRow, dbDevengados, dbDeducciones);

    // Llenar datos manuales
    fillAlignedData(currentRow, devengados, deducciones);

    // Formatear valor a pagar como moneda
    worksheet.getCell('D18').value = formatCurrency(valorAPagar);

    // Generar el archivo Excel en memoria
    const excelBuffer = await workbook.xlsx.writeBuffer();

    // Convertir el archivo Excel a PDF usando la API de iLovePDF
    const pdfBuffer = await convertExcelToPdf(excelBuffer);

    return pdfBuffer;
}