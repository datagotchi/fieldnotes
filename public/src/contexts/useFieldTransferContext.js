// src/contexts/FieldTransferContext.js
import React, { createContext, useContext, useState, useMemo } from "react";

const FieldTransferContext = createContext(undefined);

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
  /*
    throw new Error(
      "useFieldTransfer must be used within a FieldTransferProvider"
    );
  */
};
