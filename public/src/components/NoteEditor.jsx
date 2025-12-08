import React, { useCallback, useEffect, useState } from "react";

import FieldControls from "./FieldControls";
import useAPI from "../hooks/useAPI";
import Field from "./Field";

const NoteEditor = ({ note, setParentValue, onBlur, fieldDefinitions }) => {
  const [internalValue, setInternalValue] = useState(note);
  const [selectedText, setSelectedText] = useState({});

  const api = useAPI();

  const handleChange = (e) => {
    setInternalValue(e.target.value);
  };

  const handleBlur = () => {
    setParentValue(internalValue);
    setSelectedText({});
    if (onBlur) {
      onBlur();
    }
  };

  const doUseFieldAndUpdate = useCallback(
    async (field, value) => {
      const updatedNote = await api.useField(newField.id, note.id, value);
      setInternalValue({
        ...internalValue,
        fields: [...internalValue.fields, ...updatedNote.fields],
      });
      // FIXME: debug to find out if I need to call this or, like, parent.blur
      if (onBlur) {
        onBlur();
      }
    },
    [note.id, internalValue, onBlur]
  );

  const handleSelectNewField = useCallback(
    async (field, value) => {
      const newField = await api.addField(field.name);
      return doUseFieldAndUpdate(newField, value);
    },
    [note.id]
  );

  const handleSelectExistingField = useCallback(
    async (field, value) => {
      const updatedNote = await api.useField(field.id, note.id, value);
      return doUseFieldAndUpdate(field, value);
    },
    [note.id]
  );

  const handleSelect = useCallback((e) => {
    const selection = window.getSelection();
    setSelectedText({
      value: selection.toString(),
      start: selection.anchorOffset,
    });
    // FIXME: verify it clears selectected text on blur/etc.
  }, []);

  return (
    <div style={{ marginBottom: 16 }}>
      <FieldControls
        data={internalValue}
        // setData={setInternalValue}
        fieldDefinitions={fieldDefinitions}
        handleAddNewFieldToNote={handleSelectNewField}
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
        rows="10"
        cols="100"
        value={internalValue.text}
        onChange={handleChange}
        onBlur={handleBlur}
        onSelect={handleSelect}
      />
      {selectedText.value && (
        <p>
          <strong>Selected text: </strong>
          {selectedText.value}
        </p>
      )}
    </div>
  );
};

export default NoteEditor;
