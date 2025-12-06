import React, { useCallback, useEffect, useState } from "react";

import FieldControls from "./FieldControls";
import useAPI from "../hooks/useAPI";
import Field from "./Field";

const NoteEditor = ({ note, setParentValue, onBlur, fieldDefinitions }) => {
  const [internalValue, setInternalValue] = useState(note);

  const api = useAPI();

  const handleChange = (e) => {
    setInternalValue(e.target.value);
  };

  const handleBlur = () => {
    setParentValue(internalValue);
    if (onBlur) {
      onBlur();
    }
  };

  const handleAddNewField = useCallback(
    async (field, value) => {
      const newField = await api.addField(field.name);
      const updatedNote = await api.useField(newField.id, note.id, value);
      setInternalValue({
        ...internalValue,
        fields: [...internalValue.fields, ...updatedNote.fields],
      });
      if (onBlur) {
        onBlur();
      }
    },
    [note.id, internalValue]
  );

  // FIXME: test/fix
  const handleSelectExistingField = useCallback(
    async (field, value) => {
      const updatedNote = await api.useField(field.id, note.id, value);
      setInternalValue({
        ...internalValue,
        fields: [...(internalValue.fields ?? []), ...updatedNote.fields],
      });
      if (onBlur) {
        onBlur();
      }
    },
    [fieldDefinitions, note.id]
  );

  return (
    <div style={{ marginBottom: 16 }}>
      <FieldControls
        data={internalValue}
        // setData={setInternalValue}
        fieldDefinitions={fieldDefinitions}
        handleAddNewFieldToNote={handleAddNewField}
        handleSelectExistingField={handleSelectExistingField}
      />
      <p
        style={{
          fontSize: "smaller",
          fontColor: "#CCC",
          fontStyle: "italic",
        }}
      >
        Select text to move it to a field
      </p>
      <textarea
        value={internalValue.text}
        onChange={handleChange}
        onBlur={handleBlur}
        rows="10"
        cols="100"
      />
      {internalValue.fields &&
        internalValue.fields.length > 0 &&
        internalValue.fields.map((f) => (
          <Field label={f.name} value={f.value} />
        ))}
    </div>
  );
};

export default NoteEditor;
