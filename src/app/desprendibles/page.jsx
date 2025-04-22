'use client';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
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
import { AddFile } from '@/components/FormDesprendible/AddFile/AddFile';
import { sendEmail } from '@/utils/sendEmail';

export default function FormDesprendiblesPage() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [anotaciones, setAnotaciones] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const { tipoPersona, personas, selectedPersona, setTipoPersona, setSelectedPersona } = usePersona();
  const { devengados, deducciones, setDevengados, setDeducciones } = useDynamicFields(tipoPersona, selectedPersona);
  const { devengados: dbDevengados, deducciones: dbDeducciones, loading, error } = useDatabaseData(selectedPersona);

  const getDatosEnviados = () => {
    if (!selectedPersona) {
      toast.error('Debe seleccionar una persona');
      return;
    }
    if (!fechaInicio || !fechaFin) {
      toast.error('Debe seleccionar las fechas de inicio y fin');
      return;
    }

    const persona = personas.find((p) => p.id === Number(selectedPersona));
    if (!persona) throw new Error('Persona no encontrada');

    if (!persona.nombre || persona.nombre.trim() === '') {
      toast.error('La persona seleccionada no tiene un nombre válido');
      return;
    }

    const processData = (items) =>
      items.map((item) => ({
        concepto: item.concepto,
        valor: Number(item.valor) || 0,
      }));

    const processedDevengados = processData(devengados);
    const processedDeducciones = processData(deducciones);

    const valorAPagar = calculatePayment(
      processedDevengados,
      processedDeducciones,
      tipoPersona === 'trabajadores' ? dbDevengados : [],
      tipoPersona === 'trabajadores' ? dbDeducciones : []
    );

    return {
      tipoPersona,
      persona: {
        id: persona.id,
        nombre: persona.nombre,
        documento: persona.documento || persona.nit,
        cargo: persona.cargo || 'No aplica',
        salario: persona.salario || 0,
        email: persona.email,
      },
      fechaInicio,
      fechaFin,
      devengados: processedDevengados,
      deducciones: processedDeducciones,
      valorAPagar,
      dbDevengados: tipoPersona === 'trabajadores' ? dbDevengados : [],
      dbDeducciones: tipoPersona === 'trabajadores' ? dbDeducciones : [],
    };
  };

  const handleGenerateDocument = async () => {
    try {
      const datosEnviados = getDatosEnviados();
      if (!datosEnviados) return;

      const toastId = toast.loading('Generando documento...');

      console.log('Datos enviados al servidor:', datosEnviados);

      const response = await fetch('http://localhost:4000/api/generateExcel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEnviados),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.dismiss(toastId);
        throw new Error(errorData.error || 'Error en la respuesta del servidor');
      }

      const { pdfBase64 } = await response.json();

      const personaNombre = datosEnviados.persona.nombre;
      const byteCharacters = atob(pdfBase64);
      const byteArray = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `desprendible_${personaNombre.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.dismiss(toastId);
      toast.success('Documento generado y descargado exitosamente');
    } catch (error) {
      console.error('Error en generación de documento:', error);
      toast.error(error.message || 'Error al generar el documento');
    }
  };

  const handleSendEmail = async () => {
    try {
      const datosEnviados = getDatosEnviados();
      if (!datosEnviados) return;

      const trabajador = datosEnviados.persona;

      if (!trabajador || !trabajador.email) {
        toast.error('Debe seleccionar un trabajador con email válido');
        return;
      }

      const emailData = {
        ...datosEnviados,
        anotaciones,
        selectedFile,
      };

      console.log('Datos enviados al correo:', emailData);

      await sendEmail(emailData);

      setFechaInicio('');
      setFechaFin('');
      setAnotaciones('');
      setSelectedFile(null);
      setSelectedPersona('');

      toast.success('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      toast.error('Error al enviar el correo');
    }
  };

  const handleFieldChange = (fieldType, index, key, value) => {
    const newFields = [...(fieldType === 'devengados' ? devengados : deducciones)];
    newFields[index][key] = value;
    fieldType === 'devengados' ? setDevengados(newFields) : setDeducciones(newFields);
  };

  const handleAnotacionesChange = (e) => {
    setAnotaciones(e.target.value);
  };

  return (
    <div>
      <Toaster />
      <Card>
        <PersonaTypeSelector tipoPersona={tipoPersona} setTipoPersona={setTipoPersona} />
        <PersonaSelector
          tipoPersona={tipoPersona}
          personas={personas}
          selectedPersona={selectedPersona}
          setSelectedPersona={setSelectedPersona}
        />
        <DateInputs
          tipoPersona={tipoPersona}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          setFechaInicio={setFechaInicio}
          setFechaFin={setFechaFin}
        />
        <DynamicFieldSection
          fields={devengados}
          onAdd={() => setDevengados([...devengados, { concepto: '', valor: '' }])}
          onRemove={(index) => setDevengados(devengados.filter((_, i) => i !== index))}
          onChange={(index, key, value) => handleFieldChange('devengados', index, key, value)}
          sectionTitle="Devengados"
          fieldLabels={['Concepto', 'Valor']}
        />
        <DynamicFieldSection
          fields={deducciones}
          onAdd={() => setDeducciones([...deducciones, { concepto: '', valor: '' }])}
          onRemove={(index) => setDeducciones(deducciones.filter((_, i) => i !== index))}
          onChange={(index, key, value) => handleFieldChange('deducciones', index, key, value)}
          sectionTitle="Deducciones"
          fieldLabels={['Concepto', 'Valor']}
        />
        <TextArea
          value={anotaciones}
          onChange={handleAnotacionesChange}
          placeholder={'Ingrese aquí las anotaciones necesarias (asegúrese de que la ortografía sea correcta)'}
        />
        <AddFile onFileChange={setSelectedFile} />
        <ActionButtons
          tipoPersona={tipoPersona}
          onGenerate={handleGenerateDocument}
          onSendEmail={handleSendEmail}
          trabajador={personas.find((p) => p.id === selectedPersona)}
          anotaciones={anotaciones}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          devengados={devengados}
          deducciones={deducciones}
          valorAPagar={calculatePayment(devengados, deducciones, dbDevengados, dbDeducciones)}
          dbDevengados={dbDevengados}
          dbDeducciones={dbDeducciones}
          selectedFile={selectedFile}
          onFileChange={setSelectedFile}
        />
      </Card>
    </div>
  );
}