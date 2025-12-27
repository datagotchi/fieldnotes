import React, { useCallback, useEffect, useState } from "react";

import { useFieldTransferContext } from "../contexts/useFieldTransferContext";
import { useUserContext } from "../contexts/useUserContext";

const NoteEditor = ({ note, setNote, afterAddingField, onSelectionChange }) => {
  const { api } = useUserContext();

  const handleChange = (e) => {
    setNote({ ...note, text: e.target.value });
  };

  const {
    activeSelection,
    setActiveSelection,
    updatedNote,
    setUpdatedNote,
    handleTextareaSelection,
  } = useFieldTransferContext();

  useEffect(() => {
    if (updatedNote && updatedNote.id === note.id) {
      // FIXME: update state variables instead of reloading page
      window.location.reload();
      // setUpdatedNote(updatedNote);
    }
  }, [updatedNote, note.id]);

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
        data-note-id={note.id}
        onSelect={handleTextareaSelection}
      />
      {activeSelection.text && activeSelection.noteId && (
        <p>
          <strong>Selected text: </strong>
          {activeSelection.text}
        </p>
      )}
    </>
  );
};

export default NoteEditor;
