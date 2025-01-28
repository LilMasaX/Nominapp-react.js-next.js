"use client";
import Card from "@/components/Card";


export default function Desprendibles() {
  return (
    <div className="container">
            <div className="card-wrapper">
        <Card size="sm">
          <h1>Desprendibles</h1>
          <label>Selecciona el trabajador</label>
          <select className="input-field" name="trabajadores" id="workers">
            <option value="1">Juan Perez</option>
            <option value="2">Maria Rodriguez</option>
            <option value="3">Pedro Gomez</option>
          </select>
          <br />
          <label htmlFor="fecha">Fecha de pago </label>
          <input type="date" className="input-field" />
          <br />
          <label htmlFor="devengados">Agregar Devengados</label>
          <input className="input-field" type="text" />
          <br />
          <label htmlFor="deducciones">Agregar Deducciones</label>
          <input className="input-field" type="text" />
          <br />
          <button className="btn-add">Enviar Desprendible</button>
          <button className="btn-add">Generar Desprendible</button>
        </Card>
      </div>
      {/* <div className="content">
        <h1>Desprendibles</h1>
        <p>En esta sección podrás generar y enviar los desprendibles de pago a los trabajadores.
          Para enviar el desprendible de pago por favor seleccione el trabajador, la fecha de pago y si necesita agregar devengados o deducciones.
          Finalmente haga click en enviar para que se envíe directamente al correo del trabajador o en generar para descargar el desprendible.
        </p>
      </div> */}
    </div>
  );
}