// src/contexts/FieldTransferContext.js
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

const FieldTransferContext = createContext(undefined);

// TODO: If this context grows too big, split into FieldDefinitionContext and ActiveSelectionContext to prevent unnecessary re-renders.
export const FieldTransferProvider = ({ children }) => {
  const [fieldDefinitions, setFieldDefinitions] = useState([]);
  const [selectedField, setSelectedField] = useState();
  const [updatedNote, setUpdatedNote] = useState();

  // The "Transfer Payload"
  const [activeSelection, setActiveSelection] = useState({
    noteId: null,
    text: "",
    fullText: "",
    startIndex: 0,
    endIndex: 0,
  });

  const handlePillClick = useCallback(
    async (e) => {
      const fieldName = e.currentTarget.childNodes[0].nodeValue;
      const field = fieldDefinitions.find((fd) => fd.name === fieldName);
      if (activeSelection.noteId && activeSelection.text) {
        // 1. Calculate the new note text by removing the selection
        const textBefore = activeSelection.fullText.substring(
          0,
          activeSelection.startIndex
        );
        const textAfter = activeSelection.fullText.substring(
          activeSelection.endIndex
        );
        const newNoteBody = textBefore + textAfter;

        // 2. Perform the PATCH using your existing hook
        const updatedNote = await api.useField(
          activeSelection.noteId,
          field.id,
          activeSelection.text,
          newNoteBody
        );
        setUpdatedNote(updatedNote);

        // 3. Refresh the fields to see that count (n) increment!
        const updatedFields = await api.getFields();
        setFieldDefinitions(updatedFields);
        clearSelection();
      } else {
        setSelectedField(field);
      }
    },
    [fieldDefinitions, activeSelection]
  );

  const clearSelection = () =>
    setActiveSelection({
      noteId: null,
      text: "",
      fullText: "",
      startIndex: 0,
      endIndex: 0,
    });

  const contextValue = useMemo(
    () => ({
      fieldDefinitions,
      setFieldDefinitions,
      selectedField,
      setSelectedField,
      activeSelection,
      setActiveSelection,
      clearSelection,
      updatedNote,
      setUpdatedNote,
      handlePillClick,
    }),
    [fieldDefinitions, selectedField, activeSelection]
  );

  return (
    <FieldTransferContext.Provider value={contextValue}>
      {children}
    </FieldTransferContext.Provider>
  );
};

export const useFieldTransferContext = () => {
  const context = useContext(FieldTransferContext);
  return context ?? {};
};
