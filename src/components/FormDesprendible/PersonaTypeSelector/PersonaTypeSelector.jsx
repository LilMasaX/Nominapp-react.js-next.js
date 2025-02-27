import styles from './PersonaTypeSelector.module.css';

const PersonaTypeSelector = ({ tipoPersona, setTipoPersona }) => (
    <div className={styles.formGroup}>
        <label className={styles.label}><h3>Seleccione a quien desea enviar el formulario</h3></label>
        <select
            className={styles.select}
            value={tipoPersona}
            onChange={(e) => setTipoPersona(e.target.value)}
        >
            <option value="trabajadores">Trabajadores</option>
            <option value="instructores">Instructores</option>
        </select>
    </div>
);

export default PersonaTypeSelector;