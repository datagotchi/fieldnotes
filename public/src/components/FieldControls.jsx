import React, { useState } from "react";

// credit: Gemini 2.5 flash

/**
 * FieldControls Component
 * Manages the UI for creating new field definitions and selecting existing ones
 * to be added to the current note.
 * * @param {object} props
 * @param {Array<object>} fieldDefinitions - List of existing reusable field definitions.
 * @param {function} handleAddNewFieldToNote - Handler to create a new definition and add it to the note.
 * @param {function} handleSelectExistingField - Handler to add a pre-existing definition to the note.
 */
const FieldControls = ({
  fieldDefinitions,
  handleAddNewFieldToNote,
  handleSelectExistingField,
}) => {
  const [newFieldName, setNewFieldName] = useState("");
  const [selectedFieldId, setSelectedFieldId] = useState(1);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        Incremental Formalization Controls
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-indigo-50 rounded-lg">
        {/* Add Existing Field */}
        <div className="space-y-2">
          <label
            htmlFor="select-field"
            className="block text-sm font-medium text-gray-700"
          >
            Select Existing Field:
          </label>
          <div className="flex space-x-2">
            <select
              id="select-field"
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            >
              <option value="" disabled>
                Choose a reusable field ({fieldDefinitions.length} defined)...
              </option>
              {fieldDefinitions.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleSelectExistingField}
              disabled={!selectedFieldId}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-150 active:scale-95 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        {/* Create and Add New Field */}
        <div className="space-y-2">
          <label
            htmlFor="new-field-name"
            className="block text-sm font-medium text-gray-700"
          >
            Create & Add New Field:
          </label>
          <div className="flex space-x-2">
            <input
              id="new-field-name"
              type="text"
              placeholder="e.g., Affective Goal"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            />
            <button
              onClick={() => handleAddNewFieldToNote(newFieldName)}
              disabled={!newFieldName.trim()}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-150 active:scale-95 disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldControls;
