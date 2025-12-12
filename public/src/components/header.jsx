import React from "react";

import { styles } from "../constants";

const Header = ({ user }) => {
  return (
    <header style={styles.header}>
      <h1 style={{ margin: 0 }}>Field Notes by Datagotchi Labs</h1>
      <p style={styles.subtitle}>User: {user ? user.email : "Not logged in"}</p>
    </header>
  );
};

export default Header;
