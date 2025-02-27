import styles from './PersonaSelector.module.css';

const PersonaSelector = ({ tipoPersona, personas, selectedPersona, setSelectedPersona }) => (
    <div className={styles.formGroup}>
        <label className={styles.label}>
           <h3> {tipoPersona === 'trabajadores' ? 'Seleccionar trabajador' : 'Seleccionar instructor'}</h3>
        </label>
        <select
            className={styles.select}
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            required
        >
            <option value="">Seleccione...</option>
            {personas.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
        </select>
    </div>
);

export default PersonaSelector;