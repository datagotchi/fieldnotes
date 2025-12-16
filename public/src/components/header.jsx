import React from "react";

import { styles } from "../constants";
import { useUserContext } from "../contexts/useUserContext";

const Header = () => {
  const { user, api } = useUserContext();

  return (
    <header style={styles.header}>
      <h1 style={{ margin: 0 }}>Field Notes by Datagotchi Labs</h1>
      <p style={styles.subtitle}>
        User: {user ? user.email : "Not logged in"}{" "}
        {user && (
          <a
            href=""
            onClick={async (e) => {
              e.preventDefault();
              document.cookie = `token=; path=/;`;
              await api.logout(user.email);
              window.location.reload();
            }}
          >
            Logout
          </a>
        )}
      </p>
    </header>
  );
};

export default Header;
