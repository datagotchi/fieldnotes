import React, { useCallback, useEffect, useState } from "react";
import EasyEdit from "react-easy-edit";

import { others, styles } from "./../constants";
import { useUserContext } from "../contexts/useUserContext";
import { useFieldTransferContext } from "../contexts/useFieldTransferContext";
import Field from "./Field";

const NoteCreator = ({ onSelectionChange }) => {
  const { api } = useUserContext();
  const {
    newNote,
    setNewNote,
    setUpdatedNote,
    activeSelection,
    handleTextareaSelection,
  } = useFieldTransferContext();

  const submitNewNote = async (note) => {
    if (note.text || note.field_values.length > 0) {
      const addedNote = await api.addNote(note);
      addedNote.field_values = await Promise.all(
        newNote.field_values.map((fv) =>
          api.useField(addedNote.id, fv.id, fv.value)
        )
      );
      // FIXME: update state variables instead of reloading page
      // window.location.reload();
      setUpdatedNote(addedNote);
    }
  };

  return (
    <>
      <textarea
        value={newNote.text}
        onChange={(e) =>
          setNewNote({
            ...newNote,
            text: e.target.value,
          })
        }
        placeholder="Write a quick note..."
        style={styles.input}
        aria-label="New note"
        rows={others.noteCreator.rows}
        cols={others.noteCreator.cols}
        onSelect={handleTextareaSelection}
      />
      {activeSelection.text && (
        <p>
          <strong>Selected text: </strong>
          {activeSelection.text}
        </p>
      )}
      <table className="fieldTable" key="new note fieldTable">
        <tbody>
          {newNote.field_values.length > 0 &&
            newNote.field_values.map((fv) => (
              <Field
                key={`new note field #${fv.id}`}
                data={fv}
                isStaged={true}
              />
            ))}
        </tbody>
      </table>
      <button
        style={styles.button}
        onClick={async (e) => {
          e.preventDefault();
          await submitNewNote(newNote);
          setNewNote({ text: "", field_values: [] });
        }}
      >
        Add
      </button>
    </>
  );
};

export default NoteCreator;
