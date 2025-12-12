import React, { useEffect, useState } from "react";

import { styles } from "../constants";
import Note from "./note";
import useAPI from "../hooks/useAPI";

const Notes = ({ user, fieldDefinitions }) => {
  const [notes, setNotes] = useState();

  const api = useAPI(user);

  useEffect(() => {
    if (user && fieldDefinitions && !notes) {
      api.getNotes(user.token).then((notes) => {
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
  }, [user, fieldDefinitions, notes]);

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
          .map((note) => (
            <Note
              user={user}
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
  );
};

export default Notes;
