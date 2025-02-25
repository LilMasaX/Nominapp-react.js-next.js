"use server"
const fs = require('fs');
const tmp = require('tmp');
const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');

export async function convertExcelToPdf(excelBuffer) {
    // Crear un archivo temporal
    const tempFile = tmp.fileSync({ postfix: '.xlsx' });
    fs.writeFileSync(tempFile.name, excelBuffer);

    const instance = new ILovePDFApi('project_public_01fab4e7e4d2c22eaf6bbafabd23eb45_p6LeG531c486ad23cc8496e7483eab71caf0d', 'secret_key_ecf031f60be58ccb016efb48cc1cb3ae_I73iX37a4a16dc5611986527c4d738e22dbab');
    const task = instance.newTask('officepdf');

    try {
        await task.start();
        console.log('Tarea iniciada');

        const file = new ILovePDFFile(tempFile.name);
        await task.addFile(file);
        console.log('Archivo agregado');

        await task.process({
            orientation: 'landscape',   // Orientación horizontal
            pages: '1',                 // Forzar una sola página
            fit_to_page: true,          // Ajustar contenido a la página
            page_size: 'A3'             // Tamaño mayor para mejor ajuste
        });
        console.log('Tarea procesada');

        const pdfBuffer = await task.download();
        console.log('PDF descargado');
        return pdfBuffer;
    } catch (error) {
        console.error('Error en la conversión:', error);
        throw error;
    } finally {
        fs.unlinkSync(tempFile.name);
        console.log('Archivo temporal eliminado');
    }
}