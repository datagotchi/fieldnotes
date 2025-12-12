import { useCallback, useEffect, useState } from "react";

const useAPI = (cookieUser) => {
  const [email, setEmail] = useState();
  const [token, setToken] = useState();
  useEffect(() => {
    if (cookieUser) {
      if (!email) {
        setEmail(cookieUser.email);
      }
      if (!token) {
        setToken(cookieUser.token);
      }
    }
  }, [cookieUser, email, token]);

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

  const getNotes = useCallback(
    () =>
      fetch("/notes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-email": email,
        },
      }).then((response) => response.json()),
    [token, email]
  );

  const addNote = useCallback(
    (note) =>
      fetch("/notes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-email": email,
        },
        body: JSON.stringify(note),
      }).then((response) => response.json()),
    [token, email]
  );

  const deleteNote = useCallback(
    (note) =>
      fetch(`/notes/${note.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "x-email": email },
      }),
    [token, email]
  );

  const updateNote = useCallback(
    (notePartial) =>
      fetch(`/notes/${notePartial.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-email": email,
        },
        body: JSON.stringify(notePartial),
      }).then((response) => response.json()),
    [token, email]
  );

  const getFields = useCallback(
    () =>
      fetch("/fields", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "x-email": email },
      }).then((response) => response.json()),
    [token, email]
  );

  const addField = useCallback(
    (fieldName) =>
      fetch("/fields", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-email": email,
        },
        body: JSON.stringify({ name: fieldName }),
      }).then((response) => response.json()),
    [token, email]
  );

  const useField = useCallback(
    (noteId, fieldId, value, newTextValue) => {
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
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-email": email,
        },
        body: JSON.stringify(body),
      }).then((response) => response.json());
    },
    [email, token]
  );

  return {
    email,
    token,
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
