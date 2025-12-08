import React, { useCallback, useEffect, useState } from "react";
import EasyEdit from "react-easy-edit";

import { styles } from "../constants";
import useAPI from "../hooks/useAPI";
import FieldControls from "./FieldControls";
import NoteEditor from "./NoteEditor";
import Field from "./Field";

const Note = ({ data, setData, removeNote }) => {
  const api = useAPI();

  const [fieldDefinitions, setFieldDefinitions] = useState();

  useEffect(() => {
    if (!fieldDefinitions) {
      api.getFields().then((definitions) => {
        setFieldDefinitions(definitions);
      });
    }
  }, [fieldDefinitions]);

  const getFieldLabel = useCallback(
    (fieldId) => {
      if (fieldDefinitions) {
        const fieldDefinition = fieldDefinitions.find(
          (fd) => fd.id === fieldId
        );
        if (fieldDefinition) {
          return fieldDefinition.name;
        }
      }
    },
    [fieldDefinitions]
  );

  return (
    <li key={`note: ${data.id}`} style={styles.item}>
      <div style={{ ...styles.itemText, whiteSpace: "pre-line" }}>
        <EasyEdit
          type="textarea"
          inputAttributes={{ rows: 10, cols: 100 }}
          value={data.text}
          onSave={async (newValue) => {
            const changes = await api.updateNote({
              id: data.id,
              text: newValue,
            });
            data.text = changes.text;
          }}
          editComponent={
            <NoteEditor
              note={data}
              fieldDefinitions={fieldDefinitions}
              afterAddingField={(newFieldValueAndDef) => {
                setFieldDefinitions([...fieldDefinitions, newFieldValueAndDef]);
                setData({
                  ...data,
                  field_values: [...data.field_values, newFieldValueAndDef],
                });
              }}
            />
          }
        />
      </div>

      {data.field_values &&
        data.field_values.map((fv) => (
          <Field
            label={getFieldLabel(fv.field_id ?? fv.id)}
            value={fv.value}
            key={`note field #${fv.id}`}
          />
        ))}

      <div style={styles.itemMeta}>
        <small>{new Date(data.datetime).toLocaleString()}</small>
        <button
          onClick={() => {
            if (confirm("Are you sure?")) {
              removeNote(data);
            }
          }}
          style={styles.delete}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default Note;
