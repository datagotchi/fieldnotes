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

  const _setCookieAndReturnUser = (user) => {
    // Set the cookie to expire in 7 days (7 days * 24 hours * 60 minutes * 60 seconds)
    const expirationTimeInSeconds = 7 * 24 * 60 * 60;

    // TODO: enable secure cookie when we switch to HTTPS
    // document.cookie = `token=${JSON.stringify(
    //   user
    // )}; path=/; max-age=${expirationTimeInSeconds}; SameSite=Lax; Secure`;

    document.cookie = `token=${JSON.stringify(
      user
    )}; path=/; max-age=${expirationTimeInSeconds}; SameSite=Lax`;
    return user;
  };

  const register = (email, password) =>
    fetch("/api/users/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        return data;
      })
      .then(_setCookieAndReturnUser)
      .catch((err) => alert(err));

  const login = (email, password) =>
    fetch("/api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          return alert(data.error);
        }
        return data;
      })
      .then(_setCookieAndReturnUser);

  const logout = (email) =>
    fetch(`/api/users/logout/${encodeURIComponent(email)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "x-email": email },
    });

  const getNotes = useCallback(
    () =>
      fetch("/api/notes", {
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
      fetch("/api/notes", {
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
      fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "x-email": email },
      }),
    [token, email]
  );

  const updateNote = useCallback(
    (notePartial) =>
      fetch(`/api/notes/${notePartial.id}`, {
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
      fetch("/api/fields", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "x-email": email },
      }).then((response) => response.json()),
    [token, email]
  );

  const addField = useCallback(
    (fieldName) =>
      fetch("/api/fields", {
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
    async (noteId, fieldId, value, newTextValue) => {
      const newField = {
        field_id: fieldId,
        note_id: noteId,
        value,
      };
      const promises = [];
      promises.push(
        fetch(`/api/field_values`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-email": email,
          },
          body: JSON.stringify(newField),
        }).then((response) => response.json())
      );

      if (newTextValue !== undefined) {
        promises.push(
          fetch(`/api/notes/${noteId}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-email": email,
            },
            body: JSON.stringify({ text: newTextValue }),
          }).then((response) => response.json())
        );
      }
      return Promise.all(promises).then((results) => {
        return {
          id: noteId,
          field_values: [results[0]],
          text: results[1]?.text,
        };
      });
    },
    [email, token]
  );

  const updateFieldValue = useCallback(
    (noteId, fieldId, value) =>
      fetch(`/api/field_values/${noteId}/${fieldId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-email": email,
        },
        body: JSON.stringify({ value }),
      }).then((response) => response.json()),
    [email, token]
  );

  return {
    email,
    token,
    register,
    login,
    logout,
    getNotes,
    addNote,
    deleteNote,
    updateNote,
    getFields,
    addField,
    useField,
    updateFieldValue,
  };
};

export default useAPI;
