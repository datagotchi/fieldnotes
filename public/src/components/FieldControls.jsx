import React, { useCallback, useEffect, useState } from "react";

const FieldControls = ({
  data,
  // setData, // FIXME: use this?
  fieldDefinitions,
  handleAddNewFieldToNote,
  handleSelectExistingField,
}) => {
  const [newFieldName, setNewFieldName] = useState("");
  const [selectedField, setSelectedField] = useState();
  const [selectedText, setSelectedText] = useState("");

  const handleSelection = () => {
    const text = window.getSelection().toString();
    setSelectedText(text);
  };

  useEffect(() => document.addEventListener("select", handleSelection), []);

  const handleSelectField = useCallback((field) => {
    if (field.id) {
      return handleSelectExistingField(field, data.text);
    } else {
      return handleAddNewFieldToNote(field, data.text);
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        Incremental Formalization Controls
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-indigo-50 rounded-lg">
        {selectedText && (
          <div
            style={{
              display: "flex",
              margin: "5px 0px",
            }}
          >
            <label
              htmlFor="select-field"
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
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const field = fieldDefinitions.find(
                      (fd) => fd.name === selectedName
                    );
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
                {fieldDefinitions.map((fd) => (
                  <option key={fd.id} value={fd.name}>
                    {fd.id}
                  </option>
                ))}
              </datalist>
              <button
                onClick={() => handleSelectField(selectedField)}
                disabled={!selectedField}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-150 active:scale-95 disabled:opacity-50"
              >
                Use Field
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldControls;
