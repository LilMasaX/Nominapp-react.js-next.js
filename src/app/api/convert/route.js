
import { convertExcelToPdf } from '@/app/actions/convertExcelToPdf';

export async function POST(req) {
    try {
        // 1️⃣ Obtener el archivo Excel del request
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const pdfBuffer = await convertExcelToPdf(Buffer.from(arrayBuffer));

        // 2️⃣ Devolver el PDF como respuesta
        return new Response(pdfBuffer, {
            headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=documento.pdf' }
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
