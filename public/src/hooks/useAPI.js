import { useEffect, useState } from "react";

const useAPI = () => {
  const register = (email, password) =>
    fetch("/users/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((user) => {
        document.cookie = `token=${JSON.stringify(user)}; path=/;`;
        return user;
      });

  const login = (email, password) =>
    fetch("/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((user) => {
        document.cookie = `token=${JSON.stringify(user)}; path=/;`;
        return user;
      });

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

  const useField = (noteId, fieldId, value, newTextValue) => {
    const body = {
      field_values: [
        { field_id: fieldId, note_id: noteId, field_value: value },
      ],
    };
    if (newTextValue) {
      body.text = newTextValue;
    }
    return fetch(`/notes/${noteId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  };

  return {
    register,
    login,
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
