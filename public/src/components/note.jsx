import React, { useCallback, useEffect, useState } from "react";
import EasyEdit from "react-easy-edit";

import { styles } from "../constants";
import useAPI from "../hooks/useAPI";
import FieldControls from "./FieldControls";
import NoteEditor from "./NoteEditor";
import Field from "./Field";

const Note = ({ user, data, setData, removeNote, fieldDefinitions }) => {
  const api = useAPI(user?.token);

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
                // const newFieldValueAndDef = updatedNote.field_values[0];
                // if (
                //   newFieldValueAndDef &&
                //   !fieldDefinitions.find(
                //     (fd) => fd.id === newFieldValueAndDef.id
                //   )
                // ) {
                //   fieldDefinitions = [...fieldDefinitions, newFieldValueAndDef];
                // }
                // const updatedText = updatedNote.text;
                // setData({
                //   ...data,
                //   text: updatedText,
                //   field_values: [...data.field_values, newFieldValueAndDef],
                // });
                // TODO: update state variables instead of reloading page
                window.location.reload();
              }}
            />
          }
        />
      </div>

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
