"use client";
import React, { useState, useEffect } from "react";
import styles from "./ModalEdit.module.css";
import { toast, Toaster } from "react-hot-toast";
import { NumericFormat } from "react-number-format"; // Importar NumericFormat

export default function ModalEdit({
  isOpen,
  onClose,
  itemId,
  onUpdate,
  fields,
  endpoint,
  title,
  buttonText,
}) {
  const [formData, setFormData] = useState({});

  // Cargar los datos del item a editar cuando el modal se abre
  useEffect(() => {
    if (isOpen && itemId) {
      console.log(`Fetching ${title} with ID:`, itemId);
      fetch(`${endpoint}/${itemId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error fetching ${title}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(`Fetched ${title} data:`, data);
          const updatedFormData = {};
          fields.forEach((field) => {
            updatedFormData[field.name] = data[field.name] || "";
          });
          setFormData(updatedFormData);
        })
        .catch((error) => {
          console.error(`Error fetching ${title}:`, error);
          toast.error(`Error al cargar los datos de ${title}. Por favor, intenta de nuevo.`);
        });
    }
  }, [isOpen, itemId, fields, endpoint, title]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (name, values) => {
    const { value } = values; // Valor limpio sin formato
    setFormData({ ...formData, [name]: value });
  };

  // Enviar los datos actualizados
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(`Updating ${title} with ID:`, itemId);
    try {
      const response = await fetch(`${endpoint}/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: itemId, ...formData }),
      });
      if (response.ok) {
        console.log(`${title} updated successfully`);
        toast.success(`${title} actualizado con éxito.`);
        onUpdate();
        onClose();
      } else {
        const errorText = await response.text();
        console.error(`Error updating ${title}:`, errorText);
        toast.error(`Error al actualizar ${title}: ${errorText}`);
      }
    } catch (error) {
      console.error(`Error updating ${title}:`, error);
      toast.error("Error al intentar actualizar. Por favor, intenta de nuevo.");
    }
  };

  // Eliminar el item
  const handleDelete = async () => {
    if (!itemId) {
      console.error("No se puede eliminar: ID no válido");
      toast.error("No se puede eliminar: ID no válido");
      return;
    }

    try {
      console.log(`Deleting ${title} with ID:`, itemId);
      const response = await fetch(`${endpoint}/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(`${title} eliminado con éxito.`);
        onClose();
        onUpdate();
      } else {
        const errorData = await response.json();
        console.error(`Error deleting ${title}:`, errorData);

        if (errorData.error) {
          toast.error(errorData.error);
        } else {
          toast.error("Error desconocido al eliminar el trabajador.");
        }
      }
    } catch (error) {
      console.error(`Error deleting ${title}:`, error);
      toast.error("Error al intentar eliminar. Por favor, intenta de nuevo.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster />
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <span className={styles.close} onClick={onClose}>×</span>
          <h2>{`Editar ${title}`}</h2>
          <form onSubmit={handleSubmit}>
            {fields.map((field, index) => (
              <div className={styles.formDiv} key={index}>
                <label className={styles.label} htmlFor={field.name}>
                  {field.label}:
                </label>
                {field.type === "select" ? (
                  <select
                    className={styles.inputField}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                  >
                    <option value="">Seleccione</option>
                    {field.options.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.name === "salario" ? ( // Detectar el campo "salario"
                  <NumericFormat
                    value={formData[field.name] || ""}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="$"
                    decimalScale={2}
                    allowNegative={false} // Evitar valores negativos
                    className={styles.inputField}
                    placeholder="$0,00"
                    onValueChange={(values) => handleNumberChange(field.name, values)}
                    required={field.required}
                  />
                ) : (
                  <input
                    className={styles.inputField}
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                  />
                )}
              </div>
            ))}
            <button className={styles.btnAdd} type="submit">
              {buttonText}
            </button>
            <button className={styles.deleteButton} type="button" onClick={handleDelete}>
              Eliminar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}