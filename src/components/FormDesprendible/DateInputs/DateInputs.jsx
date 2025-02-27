import styles from './DateInputs.module.css';

const DateInputs = ({ tipoPersona, fechaInicio, fechaFin, setFechaInicio, setFechaFin }) => (
    <div className={styles.dateContainer}>
        <div className={styles.formGroup}>
            <label className={styles.label}><h3>Fecha inicio</h3></label>
            <input
                type="date"
                className={styles.input}
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required={tipoPersona === 'trabajadores'}
            />
        </div>
        <div className={styles.formGroup}>
            <label className={styles.label}><h3>Fecha fin</h3></label>
            <input
                type="date"
                className={styles.input}
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                required={tipoPersona === 'trabajadores'}
            />
        </div>
    </div>
);

export default DateInputs;