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

  const getFields = () => fetch("/fields").then((response) => response.json());

  const addField = (fieldName) =>
    fetch("/fields", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: fieldName }),
    }).then((response) => response.json());

  const useField = (fieldId, noteId) =>
    fetch("/field_values", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ field_id: fieldId, node_id: noteId }),
    }).then((response) => response.json());

  return {
    getNotes,
    addNote,
    deleteNote,
    updateNote,
    getFields,
    addField,
    useField,
  };
};

export default useAPI;
