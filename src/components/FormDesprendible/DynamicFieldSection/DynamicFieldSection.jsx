import { Plus, Minus } from 'lucide-react';
import { NumericFormat } from 'react-number-format'; // Importar NumericFormat
import styles from './DynamicFieldSection.module.css';

const DynamicFieldSection = ({
    fields,
    onAdd,
    onRemove,
    onChange,
    sectionTitle,
    fieldLabels
}) => (
    <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{sectionTitle}</h3>
        {fields.map((item, index) => (
            <div key={index} className={styles.inputGroup}>
                <input
                    type="text"
                    className={styles.inputField}
                    placeholder={fieldLabels[0]}
                    value={item.concepto}
                    onChange={(e) => onChange(index, 'concepto', e.target.value)}
                />
                <NumericFormat
                    value={item.valor}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="$"
                    decimalScale={2}
                    allowNegative={false} // Evitar valores negativos
                    className={styles.inputField}
                    placeholder={fieldLabels[1]}
                    onValueChange={(values) => {
                        const { value } = values; // `value` es el valor sin formato
                        onChange(index, 'valor', value); // Actualizar el valor limpio en el estado
                    }}
                />
                <button
                    type="button"
                    className={styles.btnRemove}
                    onClick={() => onRemove(index)}
                >
                    <Minus size={16} />
                </button>
            </div>
        ))}
        <button
            type="button"
            className={styles.btnAdd}
            onClick={onAdd}
        >
            <Plus size={16} /> 
        </button>
    </div>
);

export default DynamicFieldSection;