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
      const results = [];
      results.push(
        await fetch(`/api/field_values`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-email": email,
          },
          body: JSON.stringify(newField),
        })
          .then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json();
              throw {
                ...errorData,
                status: response.status,
              };
            }
            return response.json();
          })
          .catch((err) => {
            throw err;
          })
      );

      if (newTextValue !== undefined) {
        results.push(await updateNote({ id: noteId, text: newTextValue }));
      }
      return {
        id: noteId,
        field_values: [results[0]],
        text: results[1]?.text,
      };
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

  const deleteField = useCallback(
    (noteId, fieldId) =>
      fetch(`/api/field_values/${noteId}/${fieldId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "x-email": email },
      }),
    [email, token]
  );

  // FIXME: implement these skeleton functions
  /**
   * Normalizes vendor data into a standardized internal schema.
   * Prevents system-wide fragmentation by ensuring all downstream components
   * receive a consistent 'Gig' object regardless of source API changes.
   * @returns {Array<Object>} Normalized Gig objects {id, date, location, status}
   */
  const getRedRoverGigs = async () => {
    const fetchRedRoverData = async () => {
      // use fetch() to send a GET request to the rr API
    };
    const rawData = await fetchRedRoverData(); // Your helper for the API call
    return rawData.map((item) => ({
      id: item.AssignmentId, // Red Rover's specific key
      date: item.StartDate,
      location: item.SchoolName,
      status: item.Status === "Confirmed" ? "active" : "pending",
    }));
  };
  /**
   * Send username and password over HTTPS to get a session token used
   * in other RR API calls.
   *
   * @returns {String} The token for other API calls.
   */
  const loginToRedRover = () => {};
  /**
   * Resilience Check: Verifies today's assignment status.
   * Implements a "First Light" check to reduce morning uncertainty.
   * @param token {string} the API token obtained from logging in.
   * @returns {Promise<boolean>} True if gig is active/confirmed.
   */
  const verifyRedRoverGigToday = async (token) => {
    const gigs = await getRedRoverGigs();
    const today = new Date().toISOString().split("T")[0];
    const todaysGig = gigs.find((g) => g.date === today);
    return todaysGig?.status === "active";
  };
  /**
   * Interoperability Layer: Syncs normalized data to GSheets.
   * Automates the financial ledger to remove manual entry friction.
   * @param {Object} gig - The normalized Gig object.
   */
  const createGoogleSheetGig = async (gig) => {
    // logic to append to GSheet using googleapis library
    // Ensures 'One-Touch' data integrity between scheduling and budgeting.
  };

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
    deleteField,
  };
};

export default useAPI;
