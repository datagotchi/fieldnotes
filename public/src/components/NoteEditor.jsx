import React, { useCallback, useEffect, useState } from "react";

import FieldControls from "./FieldControls";
import useAPI from "../hooks/useAPI";
import Field from "./Field";

const NoteEditor = ({ note, fieldDefinitions, afterAddingField }) => {
  const [internalValue, setInternalValue] = useState(note);
  const [selectedText, setSelectedText] = useState({});

  const api = useAPI();

  const handleChange = (e) => {
    setInternalValue(e.target.value);
  };

  // Track if FieldControls is focused to avoid triggering blur when interacting with it
  const [fieldControlsFocused, setFieldControlsFocused] = useState(false);

  const handleBlur = (e) => {
    if (!fieldControlsFocused) {
      setSelectedText({});
    }
  };

  const doUseFieldAndUpdate = useCallback(
    async (field, value) => {
      const updatedNote = await api.useField(field.id, note.id, value);
      // setInternalValue({
      //   ...internalValue,
      //   field_values: [
      //     ...internalValue.field_values,
      //     ...updatedNote.field_values,
      //   ],
      // });
      const newFieldValue = updatedNote.field_values[0];
      return afterAddingField({
        id: newFieldValue.field_id,
        name: field.name,
        value,
      });
    },
    [note.id, internalValue]
  );

  const handleAddNewFieldToNote = useCallback(
    async (field, value) => {
      const newField = await api.addField(field.name);
      return doUseFieldAndUpdate(newField, value);
    },
    [note.id]
  );

  const handleAddExistingFieldToNote = useCallback(
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
  });

  return (
    <>
      {selectedText.value && (
        <div
          onMouseDown={() => setFieldControlsFocused(true)}
          onMouseUp={() => setFieldControlsFocused(false)}
          onBlur={() => setFieldControlsFocused(false)}
          tabIndex={-1}
        >
          <FieldControls
            note={note}
            selectedText={selectedText}
            setSelectedText={setSelectedText}
            fieldDefinitions={fieldDefinitions}
            handleAddNewFieldToNote={handleAddNewFieldToNote}
            handleAddExistingFieldToNote={handleAddExistingFieldToNote}
          />
        </div>
      )}
      {!selectedText.value && (
        <p
          style={{
            fontSize: "smaller",
            fontColor: "#CCC",
            fontStyle: "italic",
          }}
        >
          Select text to move it to a field
        </p>
      )}
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
    </>
  );
};

export default NoteEditor;
