import React from "react";

import { styles } from "../constants";

const Note = ({ data, removeNote }) => {
  return (
    <li key={data.id} style={styles.item}>
      <div style={styles.itemText}>{data.text}</div>
      <div style={styles.itemMeta}>
        <small>{new Date(data.createdAt).toLocaleString()}</small>
        <button onClick={() => removeNote(data.id)} style={styles.delete}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default Note;
