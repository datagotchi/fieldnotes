import React, { useCallback, useEffect, useState } from "react";
import EasyEdit from "react-easy-edit";

import { styles } from "./../constants";
import FieldControls from "./FieldControls";

const NoteCreator = ({ user, fieldDefinitions }) => {
  const [newNote, setNewNote] = useState({ text: "", field_values: [] });
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    if (
      user &&
      newNote.field_values.length > 0 &&
      fieldDefinitions.length > 0
    ) {
      const updatedFieldValues = newNote.field_values.map((fv) => {
        const field = fieldDefinitions.find((fd) => fd.id === fv.id);
        return field && fv.name !== field.name
          ? { ...fv, name: field.name }
          : fv;
      });
      if (
        JSON.stringify(updatedFieldValues) !==
        JSON.stringify(newNote.field_values)
      ) {
        setNewNote((prevNote) => ({
          ...prevNote,
          field_values: updatedFieldValues,
        }));
      }
    }
  }, [user, newNote.field_values, fieldDefinitions]);

  const handleAddNewFieldToNewNote = useCallback(
    async (field) => {
      if (newNote.field_values.find((fv) => fv.name === field.name)) {
        return alert(
          "Cannot re-add field to new note; modify its value by clicking or tapping on it"
        );
      }
      const newField = await api.addField(field.name);
      setNewNote({
        ...newNote,
        field_values: [
          ...newNote.field_values,
          {
            id: newField.id,
            name: newField.name,
            value: "",
          },
        ],
      });
    },
    [newNote]
  );

  const handleAddExistingFieldToNewNote = useCallback(
    async (field) => {
      if (newNote.field_values.find((fv) => fv.name === field.name)) {
        return alert(
          "Cannot re-add field to new note; modify its value by clicking or tapping on it"
        );
      }
      setNewNote({
        ...newNote,
        field_values: [
          ...newNote.field_values,
          {
            id: field.id,
            name: field.name,
            value: "",
          },
        ],
      });
    },
    [newNote]
  );

  const submitNewNote = async (note) => {
    if (note.text || note.field_values.length > 0) {
      const addedNote = await api.addNote(note);
      setNotes([addedNote, ...notes]);
      addedNote.field_values = await Promise.all(
        newNote.field_values.map((fv) =>
          api.useField(addedNote.id, fv.id, fv.value)
        )
      );
      // TODO: update state variables instead of reloading page
      window.location.reload();
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
        rows="10"
        cols="100"
      />
      {newNote.field_values.length > 0 &&
        newNote.field_values.map((fv) => (
          <div
            key={`used field for new note #${fv.id}`}
            style={{ display: "flex", gap: "5px" }}
          >
            <strong>{fv.name}:</strong>
            {/* TODO: switch to react-edit-text to avoid react controlled/uncontrolled errors */}
            <EasyEdit
              type="text"
              value={fv.value}
              onSave={(newValue) => {
                setNewNote({
                  ...newNote,
                  field_values: newNote.field_values.map((fv2) =>
                    fv2.id === fv.id ? { ...fv2, value: newValue } : fv2
                  ),
                });
              }}
            />
          </div>
        ))}
      <FieldControls
        note={newNote}
        selectedText={selectedText}
        setSelectedText={setSelectedText}
        fieldDefinitions={fieldDefinitions}
        handleAddNewFieldToNote={handleAddNewFieldToNewNote}
        handleAddExistingFieldToNote={handleAddExistingFieldToNewNote}
      />
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
