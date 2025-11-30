import React from "react";
import EasyEdit from "react-easy-edit";

import { styles } from "../constants";
import useAPI from "../hooks/useAPI";

const Note = ({ data, removeNote }) => {
  const api = useAPI();

  return (
    <li key={data.id} style={styles.item}>
      <div style={{ ...styles.itemText, whiteSpace: "pre-line" }}>
        <EasyEdit
          type="textarea"
          inputAttributes={{ rows: 10, cols: 100 }}
          value={data.text}
          onSave={async (newValue) => {
            const changes = await api.updateNote({
              ...data,
              text: newValue,
            });
            data.text = changes.text;
          }}
          renderValue={(value) => <span>{value}</span>}
        />
      </div>
      <div style={styles.itemMeta}>
        <small>{new Date(data.datetime).toLocaleString()}</small>
        <button
          onClick={() => {
            if (confirm("Are you sure?")) {
              removeNote(data);
            }
          }}
          style={styles.delete}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default Note;
