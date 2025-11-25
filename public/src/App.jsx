import React, { useState } from "react";

import useLocalStorage from "./hooks/useLocalStorage";
import Header from "./components/header";
import Note from "./components/note";
import { styles } from "./constants";
import useAPI from "./hooks/useAPI";

const App = () => {
  const { notes, addNote, deleteNote } = useAPI();
  const [text, setText] = useState("");

  return (
    <div style={styles.app}>
      <Header />

      <main style={styles.main}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const trimmed = text.trim();
            if (trimmed) {
              await addNote(trimmed);
            }
            setText("");
          }}
          style={styles.form}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a quick note..."
            style={styles.input}
            aria-label="New note"
          />
          <button type="submit" style={styles.button}>
            Add
          </button>
        </form>

        <ul style={styles.list}>
          {notes.length === 0 && (
            <li style={styles.empty}>No notes yet — add one above.</li>
          )}
          {notes.map((note) => (
            <Note
              data={note}
              removeNote={deleteNote}
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
