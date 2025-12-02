import React, { useEffect, useState } from "react";

import useLocalStorage from "./hooks/useLocalStorage";
import Header from "./components/header";
import Note from "./components/note";
import { styles } from "./constants";
import useAPI from "./hooks/useAPI";

const App = () => {
  const { getNotes, addNote, deleteNote, getFields } = useAPI();
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    getNotes().then((notes) => setNotes(notes));
    getFields().then((fields) => setFields(fields));
  }, []);

  return (
    <div style={styles.app}>
      <Header />

      <main style={styles.main}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const trimmed = text.trim();
            if (trimmed) {
              const newNote = await addNote(trimmed);
              setNotes([newNote, ...notes]);
            }
            setText("");
          }}
          style={styles.form}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a quick note..."
            style={styles.input}
            aria-label="New note"
            rows="10"
            cols="100"
          />
          <button type="submit" style={styles.button}>
            Add
          </button>
        </form>

        <ul style={styles.list}>
          {!notes ||
            (notes.length === 0 && (
              <li style={styles.empty}>No notes yet — add one above.</li>
            ))}
          {notes &&
            notes
              .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
              .map((note) => (
                <Note
                  data={note}
                  removeNote={async () => {
                    await deleteNote(note);
                    setNotes(notes.filter((n) => n.id !== note.id));
                  }}
                  fields={fields}
                  // key={`note: ${note.id}`}
                />
              ))}
        </ul>
      </main>

      <footer style={styles.footer}></footer>
    </div>
  );
};

export default App;
