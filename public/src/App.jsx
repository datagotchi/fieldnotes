import React, { useCallback, useEffect, useState } from "react";

import Header from "./components/header";
import { styles } from "./constants";
import NoteCreator from "./components/NoteCreator";
import Notes from "./components/Notes";
import { useUserContext } from "./contexts/useUserContext";
import FieldCloud from "./components/FieldCloud";
import { useFieldTransferContext } from "./contexts/useFieldTransferContext";

const App = () => {
  const [fieldDefinitions, setFieldDefinitions] = useState();

  const { setActiveSelection } = useFieldTransferContext();

  const { isAuthenticated, api, setUser } = useUserContext();

  useEffect(() => {
    if (api.email && api.token && !fieldDefinitions) {
      api.getFields().then((definitions) => {
        setFieldDefinitions(definitions);
      });
    }
  }, [api, api?.email, api?.token, fieldDefinitions]);

  return (
    <div style={styles.app}>
      <Header />

      <main style={styles.main}>
        {isAuthenticated && (
          <>
            <div style={styles.fieldsHeader}>
              <FieldCloud />
            </div>
            <NoteCreator onSelectionChange={setActiveSelection} />
            <Notes onSelectionChange={setActiveSelection} />
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
