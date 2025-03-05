"use server";
import fs from "fs/promises";
import path from "path";
import ExcelJS from "exceljs";
import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import tmp from "tmp";

export async function generateExcel(
    trabajador,
    fechaInicio,
    fechaFin,
    devengados = [],
    deducciones = [],
    valorAPagar,
    dbDevengados = [],
    dbDeducciones = []
) {
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();

    // Ruta absoluta al archivo de plantilla
    const templatePath = path.join(
        process.cwd(),
        "public",
        "templates",
        "desprendible.xlsx"
    );

    try {
        // Leer la plantilla desde el sistema de archivos
        const templateBuffer = await fs.readFile(templatePath);
        await workbook.xlsx.load(templateBuffer);

        // Obtener la hoja de trabajo
        const worksheet = workbook.getWorksheet("desprendible");
        if (!worksheet) {
            throw new Error('La hoja "desprendible" no existe en la plantilla');
        }

        // Formatear valores como moneda colombiana
        const formatCurrency = (value) =>
            new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(value);

        // Configurar la hoja para impresión
        worksheet.pageSetup = {
            orientation: "landscape",
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 1,
        };

        // Generar un número de comprobante único
        const newComprobanteNumber = Date.now();

        // Llenar datos del trabajador
        worksheet.getCell("D5").value = `${fechaInicio} - ${fechaFin}`;
        worksheet.getCell("D6").value = `${new Date().getFullYear()} - ${newComprobanteNumber}`;
        worksheet.getCell("D7").value = `${trabajador.nombre}`;
        worksheet.getCell("D8").value = `${trabajador.documento}`;
        worksheet.getCell("D9").value = trabajador.cargo ? `${trabajador.cargo}` : "Instructor";
        worksheet.getCell("D10").value = trabajador.salario ? formatCurrency(trabajador.salario) : "No aplica";

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
        worksheet.getCell("D18").value = formatCurrency(valorAPagar);

        // Generar el buffer del archivo Excel
        const excelBuffer = await workbook.xlsx.writeBuffer();

        // Crear un archivo temporal para el Excel
        const tempFile = tmp.fileSync({ postfix: ".xlsx" });
        await fs.writeFile(tempFile.name, excelBuffer);

        // Inicializar ILovePDF con tus claves
        const instance = new ILovePDFApi(
            process.env.ILOVEPDF_PUBLIC_KEY,
            process.env.ILOVEPDF_SECRET_KEY 
        );
        const task = instance.newTask("officepdf");

        try {
            await task.start();
            console.log("Tarea iniciada");

            const file = new ILovePDFFile(tempFile.name);
            await task.addFile(file);
            console.log("Archivo agregado");

            await task.process({});
            console.log("Tarea procesada");

            const pdfBuffer = await task.download();
            console.log("PDF descargado");

            const pdfBase64 = pdfBuffer.toString("base64");

            return pdfBase64;
             // Retorna el pdf en cadena 64
        } catch (error) {
            console.error("Error en la conversión a PDF:", error);
            throw error;
        } finally {
            // Eliminar el archivo temporal
            tempFile.removeCallback();
        }
    } catch (error) {
        console.error("Error al generar el Excel o convertir a PDF:", error);
        throw error;
    }
}