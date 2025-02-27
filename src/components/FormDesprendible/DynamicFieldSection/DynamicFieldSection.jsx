import { Plus, Minus } from 'lucide-react';
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
                <input
                    type="number"
                    className={styles.inputField}
                    placeholder={fieldLabels[1]}
                    value={item.valor}
                    onChange={(e) => onChange(index, 'valor', e.target.value)}
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