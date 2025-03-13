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
            // Validaciones
            if (!selectedPersona) throw new Error('Debe seleccionar una persona');
            const persona = personas.find(p => p.id == selectedPersona);
            if (!persona) throw new Error('Persona no encontrada');
    
            // Procesar datos numéricos
            const processData = (items) => items.map(item => ({
                concepto: item.concepto,
                valor: Number(item.valor) || 0
            }));
    
            const processedDevengados = processData(devengados);
            const processedDeducciones = processData(deducciones);
    
            // Calcular valor final
            const valorAPagar = calculatePayment(
                processedDevengados,
                processedDeducciones,
                dbDevengados,
                dbDeducciones
            );
    
            // Hacer petición al servidor
            const response = await fetch('http://localhost:3001/api/generateExcel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trabajador: {
                        id: persona.id,
                        nombre: persona.nombre,
                        documento: persona.documento,
                        cargo: persona.cargo,
                        salario: persona.salario
                    },
                    fechaInicio,
                    fechaFin,
                    devengados: processedDevengados,
                    deducciones: processedDeducciones,
                    valorAPagar,
                    dbDevengados,
                    dbDeducciones
                })
            });
    
            // Manejar errores HTTP
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en la respuesta del servidor');
            }
    
            // Obtener respuesta
            const { pdfBase64, historialId } = await response.json();
    
            // Descargar PDF
            const byteCharacters = atob(pdfBase64);
            const byteArray = new Uint8Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteArray[i] = byteCharacters.charCodeAt(i);
            }
    
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(blob);
    
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `desprendible_${persona.nombre.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
    
            // Limpiar
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
    
        } catch (error) {
            console.error('Error en generación de documento:', error);
            
            // Mensaje amigable
            const errorMessage = error.message.includes('Failed to fetch')
                ? 'No se pudo conectar al servidor'
                : error.message;
    
            alert(`Error: ${errorMessage}`);
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