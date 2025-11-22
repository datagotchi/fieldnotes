import React, { useState } from "react";

import useLocalStorage from "./hooks/useLocalStorage";
import Header from "./components/header";
import Note from "./components/note";
import { styles } from "./constants";

const App = () => {
  const [notes, setNotes] = useLocalStorage("fieldnotes.notes", []);
  const [text, setText] = useState("");

  function addNote(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const note = {
      id: Date.now(),
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setNotes([note, ...notes]);
    setText("");
  }

  function removeNote(id) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  return (
    <div style={styles.app}>
      <Header />

      <main style={styles.main}>
        <form onSubmit={addNote} style={styles.form}>
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
            <Note data={note} />
          ))}
        </ul>
      </main>

      <footer style={styles.footer}>
        <small>Built with React</small>
      </footer>
    </div>
  );
};

export default App;
