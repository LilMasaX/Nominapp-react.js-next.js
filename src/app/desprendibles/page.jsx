'use client';
import { useState } from 'react';
import ActionButtons from '@/components/FormDesprendible/ActionButtons/ActionButtons';
import PersonaSelector from '@/components/FormDesprendible/PersonaSelector/PersonaSelector';
import PersonaTypeSelector from '@/components/FormDesprendible/PersonaTypeSelector/PersonaTypeSelector';
import DateInputs from '@/components/FormDesprendible/DateInputs/DateInputs';
import DynamicFieldSection from '@/components/FormDesprendible/DynamicFieldSection/DynamicFieldSection';
import { usePersona } from '@/hooks/usePersona';
import { useDynamicFields } from '@/hooks/useDynamicFields';
import { useDatabaseData } from '@/hooks/useDatabaseData';
import Card from '@/components/card/Card';
import { calculatePayment } from '@/utils/calculatePayment';
import { generateExcel } from '@/app/actions/generateExcel';
import TextArea from '@/components/FormDesprendible/AnotInput/TextArea';

export default function FormDesprendiblesPage() {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [anotaciones, SetAnotaciones] = useState('');

    // Hooks personalizados
    const {
        tipoPersona,
        personas,
        selectedPersona,
        setTipoPersona,
        setSelectedPersona,
    } = usePersona();

    const {
        devengados,
        deducciones,
        setDevengados,
        setDeducciones,
    } = useDynamicFields(tipoPersona, selectedPersona);

    const { devengados: dbDevengados, deducciones: dbDeducciones, loading, error } = useDatabaseData(selectedPersona);

    const handleGenerateDocument = async () => {
        try {
            const persona = personas.find(p => p.id == selectedPersona);
            if (!persona) throw new Error('Debe seleccionar una persona');

            const processedDevengados = devengados.map(d => ({
                concepto: d.concepto,
                valor: Number(d.valor) || 0,
            }));

            const processedDeducciones = deducciones.map(d => ({
                concepto: d.concepto,
                valor: Number(d.valor) || 0,
            }));

            const valorAPagar = calculatePayment(processedDevengados, processedDeducciones, dbDevengados, dbDeducciones);

            const { pdfBase64 } = await generateExcel(persona, fechaInicio, fechaFin, processedDevengados, processedDeducciones, valorAPagar, dbDevengados, dbDeducciones);

            // Convertir base64 a Blob para descarga
            const byteCharacters = atob(pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `desprendible_${persona.nombre}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar el documento: ' + error.message);
        }
    };

    const handleFieldChange = (fieldType, index, key, value) => {
        const newFields = [...(fieldType === 'devengados' ? devengados : deducciones)];
        newFields[index][key] = value;
        fieldType === 'devengados' ? setDevengados(newFields) : setDeducciones(newFields);
    };

    const handleAnotacionesChange = (e) => {
        SetAnotaciones(e.target.value);
    }

    return (
        <div>
            <Card>
                <PersonaTypeSelector tipoPersona={tipoPersona} setTipoPersona={setTipoPersona} />
                <PersonaSelector tipoPersona={tipoPersona} personas={personas} selectedPersona={selectedPersona} setSelectedPersona={setSelectedPersona} />
                <DateInputs tipoPersona={tipoPersona} fechaInicio={fechaInicio} fechaFin={fechaFin} setFechaInicio={setFechaInicio} setFechaFin={setFechaFin} />
                <DynamicFieldSection
                    fields={devengados}
                    onAdd={() => setDevengados([...devengados, { concepto: '', valor: '' }])}
                    onRemove={index => setDevengados(devengados.filter((_, i) => i !== index))}
                    onChange={(index, key, value) => handleFieldChange('devengados', index, key, value)}
                    sectionTitle="Devengados"
                    fieldLabels={['Concepto', 'Valor']}
                />
                <DynamicFieldSection
                    fields={deducciones}
                    onAdd={() => setDeducciones([...deducciones, { concepto: '', valor: '' }])}
                    onRemove={index => setDeducciones(deducciones.filter((_, i) => i !== index))}
                    onChange={(index, key, value) => handleFieldChange('deducciones', index, key, value)}
                    sectionTitle="Deducciones"
                    fieldLabels={['Concepto', 'Valor']}
                />
                <TextArea value={anotaciones} onChange={handleAnotacionesChange} placeholder={'Ingrese aqui las anotaciones necesarias (asegurese de que la ortografia sea correcta)'}/>
                
                <ActionButtons
                    tipoPersona={tipoPersona}
                    onGenerate={handleGenerateDocument}
                    trabajador={personas.find(p => p.id == selectedPersona)}
                    anotaciones ={anotaciones}
                    fechaInicio={fechaInicio}
                    fechaFin={fechaFin}
                    devengados={devengados}
                    deducciones={deducciones}
                    valorAPagar={calculatePayment(devengados, deducciones, dbDevengados, dbDeducciones)}
                    dbDevengados={dbDevengados}
                    dbDeducciones={dbDeducciones}
                />
            </Card>
        </div>
    );
}