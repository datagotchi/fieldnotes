import React, { useCallback, useEffect, useState } from "react";

import Header from "./components/header";
import { styles } from "./constants";
import useAPI from "./hooks/useAPI";
import NoteCreator from "./components/NoteCreator";
import Notes from "./components/Notes";
import { useUserContext } from "./contexts/useUserContext";
import FieldCloud from "./components/FieldCloud";

const App = () => {
  const [fieldDefinitions, setFieldDefinitions] = useState();
  const [activeSelection, setActiveSelection] = useState({
    noteId: null,
    text: "",
    originalText: "",
  });
  const [newNote, setNewNote] = useState({ text: "", field_values: [] });

  const clearSelection = () =>
    setActiveSelection({ noteId: null, text: "", fullText: "" });

  const { user, loading, isAuthenticated, api, setUser } = useUserContext();

  useEffect(() => {
    if (api.email && api.token && !fieldDefinitions) {
      api.getFields().then((definitions) => {
        setFieldDefinitions(definitions);
      });
    }
  }, [api, api?.email, api?.token, fieldDefinitions]);

  const handlePillClick = useCallback(
    async (field) => {
      if (activeSelection.noteId && activeSelection.text) {
        // 1. Calculate the new note text by removing the selection
        const textBefore = activeSelection.fullText.substring(
          0,
          activeSelection.startIndex
        );
        const textAfter = activeSelection.fullText.substring(
          activeSelection.endIndex
        );
        const newNoteBody = textBefore + textAfter;

        // 2. Perform the PATCH using your existing hook
        await api.useField(
          activeSelection.noteId,
          field.id,
          activeSelection.text,
          newNoteBody
        );

        // 3. Refresh the fields to see that count (n) increment!
        const updatedFields = await api.getFields();
        setFieldDefinitions(updatedFields);
        clearSelection();
      } else {
        // Fallback: Populate the "New Note" control
        setNewNoteField(field.name);
      }
    },
    [activeSelection]
  );

  return (
    <div style={styles.app}>
      <Header />

      <main style={styles.main}>
        {isAuthenticated && (
          <>
            <div style={styles.fieldsHeader}>
              <FieldCloud
                fieldDefinitions={fieldDefinitions}
                handlePillClick={handlePillClick}
              />
            </div>
            <NoteCreator
              fieldDefinitions={fieldDefinitions}
              newNote={newNote}
              setNewNote={setNewNote}
            />
            <Notes
              fieldDefinitions={fieldDefinitions}
              onSelectionChange={setActiveSelection}
            />
          </>
        )}
        {!isAuthenticated && (
          <>
            <h2>Login</h2>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                maxWidth: 300,
                margin: "0 auto",
              }}
              onSubmit={async (e) => {
                e.preventDefault();
                const email = e.target.email.value;
                const password = e.target.password.value;
                const loggedInUser = await api.login(email, password);
                if (loggedInUser) setUser(loggedInUser);
              }}
            >
              <label>
                Email:
                <input type="email" name="email" required />
              </label>
              <label>
                Password:
                <input type="password" name="password" required />
              </label>
              <button type="submit">Login</button>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  const email = prompt("Enter your email:");
                  const password = prompt("Enter your password:");
                  if (email && password) {
                    api.register(email, password).then((registeredUser) => {
                      if (registeredUser) setUser(registeredUser);
                      else alert("Registration failed");
                    });
                  }
                }}
              >
                Register
              </button>
            </form>
          </>
        )}
      </main>

      <footer style={styles.footer}></footer>
    </div>
  );
};

export default App;
