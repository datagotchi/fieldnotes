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
      body: JSON.stringify(note),
    }).then((response) => response.json());

  const deleteNote = (note) => fetch(`/notes/${note.id}`, { method: "DELETE" });

  const updateNote = (notePartial) =>
    fetch(`/notes/${notePartial.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notePartial),
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

  const useField = (fieldId, noteId, value) =>
    fetch(`/notes/${noteId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        field_id: fieldId,
        note_id: noteId,
        field_value: value,
      }),
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
