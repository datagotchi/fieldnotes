import React, { useCallback, useEffect, useState } from "react";

import FieldControls from "./FieldControls";
import useAPI from "../hooks/useAPI";
import Field from "./Field";

const NoteEditor = ({
  user,
  note,
  setNote,
  fieldDefinitions,
  afterAddingField,
  onSelectionChange,
}) => {
  const [selectedText, setSelectedText] = useState({});

  const api = useAPI(user);

  const handleChange = (e) => {
    setNote({ ...note, text: e.target.value });
  };

  const [fieldControlsShown, setFieldControlsShown] = useState(false);

  const handleBlur = () => {
    if (!fieldControlsShown) {
      setSelectedText({});
    }
  };

  const doUseFieldAndUpdate = useCallback(
    async (field, value) => {
      const startIndex = Math.min(selectedText.start, selectedText.end);
      const endIndex = Math.max(selectedText.start, selectedText.end);
      const textBefore = note.text.substring(0, startIndex);
      const textAfter = note.text.substring(endIndex);
      const newTextValue = textBefore + textAfter;
      const updatedNote = await api.useField(
        note.id,
        field.id,
        value,
        newTextValue
      );
      const newFieldValue = updatedNote.field_values[0];
      return afterAddingField({
        text: updatedNote.text,
        field_values: [...note.field_values, newFieldValue],
      });
    },
    [note.id, selectedText]
  );

  const handleAddNewFieldToNote = useCallback(
    async (field, value) => {
      const newField = await api.addField(field.name);
      return doUseFieldAndUpdate(newField, value);
    },
    [note.id, doUseFieldAndUpdate]
  );

  const handleAddExistingFieldToNote = useCallback(
    async (field, value) => {
      return doUseFieldAndUpdate(field, value);
    },
    [note.id, doUseFieldAndUpdate]
  );

  const handleSelect = (e) => {
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value.substring(start, end);
    if (value.length > 0) {
      const selectionData = {
        noteId: note.id,
        text: value,
        fullText: note.text,
        startIndex: start,
        endIndex: end,
      };
      onSelectionChange(selectionData);
    } else {
      onSelectionChange({ noteId: null, text: "" });
    }
  };

  return (
    <>
      {selectedText.value && (
        <div tabIndex={-1}>
          <FieldControls
            note={note}
            selectedText={selectedText}
            setSelectedText={setSelectedText}
            fieldDefinitions={fieldDefinitions}
            handleAddNewFieldToNote={handleAddNewFieldToNote}
            handleAddExistingFieldToNote={handleAddExistingFieldToNote}
            setFieldControlsShown={setFieldControlsShown}
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
        value={note.text}
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
