import React from "react";
import EasyEdit from "react-easy-edit";

import useAPI from "../hooks/useAPI";

const Field = ({ label, value }) => {
  const api = useAPI();
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
      <strong>{label}:</strong>
      <EasyEdit
        type="text"
        value={value}
        onSave={async (newValue) => {
          const changes = await api.updateNote({
            id: data.id,
            text: newValue,
          });
          value = changes.text;
        }}
      />
    </label>
  );
};

export default Field;
