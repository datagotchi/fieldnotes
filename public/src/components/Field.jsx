import React, { useCallback } from "react";
import EasyEdit from "react-easy-edit";

import { useUserContext } from "../contexts/useUserContext";
import { useFieldTransferContext } from "../contexts/useFieldTransferContext";

const Field = ({ data, isStaged = false }) => {
  const { api } = useUserContext();
  const { setNewNote, newNote, updatedNote, setUpdatedNote } =
    useFieldTransferContext();

  const handleSave = useCallback(
    async (newValue) => {
      if (isStaged) {
        // Update the local staged state in the context
        setNewNote({
          ...newNote,
          field_values: newNote.field_values.map((fv) =>
            fv.id === data.id ? { ...fv, value: newValue } : fv
          ),
        });
      } else if (api?.token) {
        // Persist changes to the database for existing notes
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
      }
    },
    [isStaged, api?.token]
  );

  return (
    <tr>
      <td>
        <strong>{data.name}:</strong>
      </td>
      <td>
        <div style={{ display: "flex" }}>
          <EasyEdit type="text" value={data.value} onSave={handleSave} />
          <button
            onClick={async () => {
              if (confirm("Are you sure?")) {
                if (isStaged) {
                  setNewNote({
                    ...newNote,
                    field_values: newNote.field_values.filter(
                      (item) => item.id !== data.id
                    ),
                  });
                } else {
                  const result = await api.updateNote({
                    id: data.note_id,
                    field_values: [
                      {
                        field_id: data.field_id,
                        field_value: newValue,
                      },
                    ],
                  });

                  setUpdatedNote(result);
                }
              }
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#ff4d4f",
              fontSize: "1.2rem",
              padding: "0 5px",
            }}
            title="Remove field"
          >
            ×
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Field;
