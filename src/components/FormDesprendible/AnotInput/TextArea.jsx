import React from 'react';
import styles from './TextArea.module.css';

const TextArea = ({ value, onChange, placeholder }) => {
    return (
        <div className={styles.container}>
            <div className={styles.label
            }>
                <label className={styles.label}>
                    <h3>Anotaciones:</h3>
                </label>
            </div>
            <textarea
                className={styles.textArea}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
};

export default TextArea;