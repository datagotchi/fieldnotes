import React, { useEffect, useState } from "react";

import { styles } from "../constants";
import Note from "./note";
import { useUserContext } from "../contexts/useUserContext";
import { useFieldTransferContext } from "../contexts/useFieldTransferContext";

const Notes = ({ onSelectionChange }) => {
  const [notes, setNotes] = useState();

  const { user, api } = useUserContext();
  const { fieldDefinitions, updatedNote, setUpdatedNote } =
    useFieldTransferContext();

  useEffect(() => {
    if (api.token && fieldDefinitions.length > 0 && !notes) {
      api.getNotes().then((notes) => {
        const processedNotes = notes.map((n) => {
          n.field_values.forEach((fv) => {
            const fieldDefinition = fieldDefinitions.find(
              (fd) => fd.id === fv.field_id
            );
            fv.name = fieldDefinition.name;
          });
          return n;
        });
        setNotes(processedNotes);
      });
    }
  }, [api?.token, fieldDefinitions, notes]);

  useEffect(() => {
    if (updatedNote && notes) {
      const exists = notes.find((n) => n.id === updatedNote.id);
      const updatedNoteCopy = { ...updatedNote };
      setUpdatedNote(undefined);

      if (exists) {
        setNotes(
          notes.map((n) => (n.id === updatedNoteCopy.id ? updatedNoteCopy : n))
        );
      } else {
        setNotes([updatedNoteCopy, ...notes]);
      }
    }
  }, [updatedNote, notes]);

  return (
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
          .map((note) => {
            const noteToRender =
              updatedNote?.id === note.id ? updatedNote : note;
            return (
              <Note
                user={user}
                data={noteToRender}
                setData={(updatedNote) => {
                  const updatedNotes = notes.map((n) =>
                    n.id === updatedNote.id ? updatedNote : n
                  );
                  setNotes(updatedNotes);
                }}
                removeNote={async () => {
                  await api.deleteNote(noteToRender);
                  setNotes(notes.filter((n) => n.id !== noteToRender.id));
                }}
                fieldDefinitions={fieldDefinitions}
                key={`note: ${noteToRender.id}`}
                onSelectionChange={onSelectionChange}
              />
            );
          })}
    </ul>
  );
};

export default Notes;
