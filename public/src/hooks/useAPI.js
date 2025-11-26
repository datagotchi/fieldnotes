import { useEffect, useState } from "react";

const useAPI = () => {
  const [notes, setNotes] = useState();

  useEffect(() => {
    if (!notes) {
      fetch("/notes")
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setNotes(data);
          } else {
            throw data;
          }
        });
    }
  }, [notes]);

  const addNote = (note) =>
    fetch("/notes", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: note.trim(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setNotes([data, ...notes]);
      });

  const deleteNote = (note) =>
    fetch(`/notes/${note.id}`, { method: "DELETE" }).then(() => {
      setNotes(notes.filter((n) => n.id !== note.id));
    });

  return {
    notes,
    addNote,
    deleteNote,
  };
};

export default useAPI;
