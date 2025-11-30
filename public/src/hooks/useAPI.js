import { useEffect, useState } from "react";

const useAPI = () => {
  const getNotes = () => fetch("/notes").then((response) => response.json());

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
    }).then((response) => response.json());

  const deleteNote = (note) => fetch(`/notes/${note.id}`, { method: "DELETE" });

  const updateNote = (note) =>
    fetch(`/notes/${note.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    }).then((response) => response.json());

  return {
    getNotes,
    addNote,
    deleteNote,
    updateNote,
  };
};

export default useAPI;
