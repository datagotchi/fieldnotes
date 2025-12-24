import React, { useCallback, useEffect, useMemo } from "react";
import { useFieldTransferContext } from "../contexts/useFieldTransferContext";

const FieldControls = ({
  note,
  selectedText,
  setSelectedText,
  fieldDefinitions,
  handleAddNewFieldToNote,
  handleAddExistingFieldToNote,
  setFieldControlsShown,
}) => {
  const [selectedField, setSelectedField] = useFieldTransferContext();

  useEffect(() => {
    if (setFieldControlsShown) {
      setFieldControlsShown(true);
    }
  }, [setFieldControlsShown]);

  const usedFds = useMemo(
    () =>
      note.field_values
        .map((fv) => fv.field_id ?? fv.id)
        .map((fieldId) => fieldDefinitions.find((fd) => fd.id === fieldId)),
    [note]
  );

  const handleSelectField = useCallback(
    async (field) => {
      const alertCantUseExistingField = () => {
        return alert(
          "This field is already used in this note. To edit it, click or tap on its value below."
        );
      };
      if (field.id) {
        if (note.field_values.some((fv) => fv.field_id === field.id)) {
          return alertCantUseExistingField();
        }
        return handleAddExistingFieldToNote(field, selectedText.value);
      } else {
        if (usedFds.some((fd) => fd.name === field.name)) {
          return alertCantUseExistingField();
        }
        return handleAddNewFieldToNote(field, selectedText.value);
      }
    },
    [note.field_values, usedFds, selectedText]
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-indigo-50 rounded-lg">
        <div
          style={{
            display: "flex",
            margin: "5px 0px",
          }}
        >
          <label
            htmlFor="field-to-use-chooser"
            className="block text-sm font-medium text-gray-700"
            style={{ marginRight: "5px" }}
          >
            Use a Field:
          </label>
          <div className="flex space-x-2">
            <label htmlFor="field-to-use-chooser">
              <input
                list="field-to-use"
                id="field-to-use-chooser"
                name="field-to-use-chooser"
                placeholder="Type or choose field"
                style={{ marginRight: "5px" }}
                value={selectedField?.name || ""}
                autoComplete="off"
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const field =
                    fieldDefinitions &&
                    fieldDefinitions.find((fd) => fd.name === selectedName);
                  setSelectedField(
                    field
                      ? {
                          id: field.id,
                          name: field.name,
                          value: "",
                        }
                      : { id: null, name: selectedName, value: "" }
                  );
                }}
              />
            </label>
            <datalist id="field-to-use">
              {fieldDefinitions &&
                fieldDefinitions
                  .filter(
                    (fd) =>
                      !note.field_values
                        .map((fv) => fv.field_id || fv.id)
                        .includes(fd.id)
                  )
                  .map((fd) => (
                    <option key={fd.id} value={fd.name}>
                      {fd.id}
                    </option>
                  ))}
            </datalist>
            <button
              onClick={async () => {
                await handleSelectField(selectedField);
                setSelectedText({});
              }}
              disabled={!selectedField}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-150 active:scale-95 disabled:opacity-50"
            >
              Use Field
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldControls;
