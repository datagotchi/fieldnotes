import React, { useCallback } from "react";
import EasyEdit from "react-easy-edit";

import { styles } from "../constants";
import NoteEditor from "./NoteEditor";
import Field from "./Field";
import { useFieldTransferContext } from "../contexts/useFieldTransferContext";
import { useUserContext } from "../contexts/useUserContext";

const Note = ({ user, data, setData, removeNote, onSelectionChange }) => {
  const { fieldDefinitions } = useFieldTransferContext();

  const { api } = useUserContext();

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
              user={user}
              note={data}
              setNote={setData}
              fieldDefinitions={fieldDefinitions}
              afterAddingField={(updatedNote) => {
                setData(updatedNote);
              }}
              onSelectionChange={onSelectionChange}
            />
          }
        />
      </div>

      <table className="fieldTable" key={`note #${data.id} fieldTable`}>
        <tbody>
          {data.field_values &&
            data.field_values
              .sort((a, b) => a.id - b.id)
              .map((fv) => (
                <Field
                  user={user}
                  data={{
                    ...fv,
                    name: getFieldLabel(fv.field_id ?? fv.id),
                    note_id: data.id,
                  }}
                  key={`note field #${fv.id}`}
                />
              ))}
        </tbody>
      </table>
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
