import React, { useState } from "react";

import FieldControls from "./FieldControls";
import useAPI from "../hooks/useAPI";

const NoteEditor = ({
  note,
  value,
  setParentValue,
  onBlur,
  fieldDefinitions,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  const api = useAPI();

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    // Optional: you might want to call setParentValue here for immediate updates
    // setParentValue(e.target.value);
  };

  const handleBlur = () => {
    setParentValue(internalValue); // Pass the final value to react-easy-edit
    if (onBlur) {
      onBlur(); // Trigger react-easy-edit's onBlur if available
    }
  };

  const handleAddNewField = (newFieldName) => api.addField(newFieldName);

  const handleSelectExistingField = (e) => {
    const field = fieldDefinitions.find((fd) => fd.id === e.target.value);
    if (field) {
      api.useField(field.id, note.id);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <FieldControls
        fieldDefinitions={fieldDefinitions}
        handleAddNewFieldToNote={handleAddNewField}
        handleSelectExistingField={handleSelectExistingField}
      />
      <textarea
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        rows="10"
        cols="100"
      />
    </div>
  );
};

export default NoteEditor;
