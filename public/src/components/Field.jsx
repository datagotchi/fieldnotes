import React from "react";
import EasyEdit from "react-easy-edit";

import useAPI from "../hooks/useAPI";

const Field = ({ user, data }) => {
  const api = useAPI(user);
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
      <strong>{data.name}:</strong>
      <EasyEdit
        type="text"
        value={data.value}
        onSave={async (newValue) => {
          const changes = await api.updateNote({
            id: data.note_id,
            field_values: [
              {
                field_id: data.field_id,
                field_value: newValue,
              },
            ],
          });
          data.value = changes.field_value;
        }}
      />
    </label>
  );
};

export default Field;
