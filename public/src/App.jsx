import React, { useCallback, useEffect, useState } from "react";
import EasyEdit from "react-easy-edit";

import useLocalStorage from "./hooks/useLocalStorage";
import Header from "./components/header";
import Note from "./components/note";
import { styles } from "./constants";
import useAPI from "./hooks/useAPI";
import FieldControls from "./components/FieldControls";

const App = () => {
  const [newNote, setNewNote] = useState({ text: "", field_values: [] });
  const [notes, setNotes] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [fieldDefinitions, setFieldDefinitions] = useState([]);

  const api = useAPI();

  useEffect(() => {
    if (!fieldDefinitions) {
      api.getFields().then((definitions) => {
        setFieldDefinitions(definitions);
      });
    }
  }, [fieldDefinitions]);

  useEffect(() => {
    api.getFields().then((fields) => setFieldDefinitions(fields));
    api.getNotes().then((notes) => setNotes(notes));
  }, []);

  useEffect(() => {
    if (newNote.field_values.length > 0 && fieldDefinitions.length > 0) {
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
  }, [newNote.field_values, fieldDefinitions]);

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
    <div style={styles.app}>
      <Header />

      <main style={styles.main}>
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

        <ul style={styles.list}>
          {!notes ||
            (notes.length === 0 && (
              <li style={styles.empty}>No notes yet — add one above.</li>
            ))}
          {notes && (
            <p
              style={{
                fontSize: "smaller",
                fontColor: "#CCC",
                fontStyle: "italic",
              }}
            >
              Click or tap a note's text or field values to edit them
            </p>
          )}
          {notes &&
            notes
              .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
              .map((note) => (
                <Note
                  data={note}
                  setData={(updatedNote) => {
                    const updatedNotes = notes.map((n) =>
                      n.id === updatedNote.id ? updatedNote : n
                    );
                    setNotes(updatedNotes);
                  }}
                  removeNote={async () => {
                    await api.deleteNote(note);
                    setNotes(notes.filter((n) => n.id !== note.id));
                  }}
                  fieldDefinitions={fieldDefinitions}
                  key={`note: ${note.id}`}
                />
              ))}
        </ul>
      </main>

      <footer style={styles.footer}></footer>
    </div>
  );
};

export default App;
