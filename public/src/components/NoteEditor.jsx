import React, { useCallback, useEffect, useState } from "react";

import FieldControls from "./FieldControls";
import useAPI from "../hooks/useAPI";
import Field from "./Field";
import { useFieldTransferContext } from "../contexts/useFieldTransferContext";

const NoteEditor = ({
  user,
  note,
  setNote,
  afterAddingField,
  onSelectionChange,
  setParentValue,
}) => {
  const api = useAPI(user);

  const handleChange = (e) => {
    setNote({ ...note, text: e.target.value });
  };

  const [fieldControlsShown, setFieldControlsShown] = useState(false);

  const { activeSelection, setActiveSelection, updatedNote, setUpdatedNote } =
    useFieldTransferContext();

  const handleBlur = () => {
    if (!fieldControlsShown) {
      setActiveSelection({});
    }
  };

  const doUseFieldAndUpdate = useCallback(
    async (field, value) => {
      const startIndex = Math.min(
        activeSelection.startIndex,
        activeSelection.endIndex
      );
      const endIndex = Math.max(
        activeSelection.startIndex,
        activeSelection.endIndex
      );
      const textBefore = note.text.substring(0, startIndex);
      const textAfter = note.text.substring(endIndex);
      const newTextValue = textBefore + textAfter;
      const updatedNote = await api.useField(
        note.id,
        field.id,
        value,
        newTextValue
      );
      return afterAddingField(updatedNote);
    },
    [note.id, activeSelection]
  );

  useEffect(() => {
    // If the context has a fresh note and it's ME...
    if (updatedNote && updatedNote.id === note.id) {
      // TODO: tell the library to close the editor without doing a window reload
      window.location.reload();
    }
  }, [updatedNote, note.id]);

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
      // TODO: move to Typescript
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
      {!activeSelection.text && (
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
      {activeSelection.text && (
        <p>
          <strong>Selected text: </strong>
          {activeSelection.text}
        </p>
      )}
    </>
  );
};

export default NoteEditor;
