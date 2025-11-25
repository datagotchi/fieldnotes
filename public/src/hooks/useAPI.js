import { useEffect, useState } from "react";

const useAPI = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!state) {
      fetch("/api/notes")
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setNotes(data);
          } else {
            throw data;
          }
        });
    }
  }, [state]);

  const addNote = (note) =>
    fetch("/api/notes", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 1,
        text: trimmed,
        datetime: new Date().toISOString(),
      }),
    }).then(() => {
      setNotes([note, ...notes]);
    });

  const deleteNote = (note) =>
    fetch(`/api/notes/${note.id}`, { method: "DELETE" }).then(() => {
      setNotes(notes.filter((n) => n.id !== note.id));
    });

  return {
    notes,
    addNote,
    deleteNote,
  };
};

export default useAPI;
