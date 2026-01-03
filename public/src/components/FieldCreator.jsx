import React from "react";

import { useFieldTransferContext } from "../contexts/useFieldTransferContext";
import { useUserContext } from "../contexts/useUserContext";

const FieldCreator = () => {
  const { activeSelection, setActiveSelection, addValueToNote } =
    useFieldTransferContext();
  const { api } = useUserContext();

  if (!activeSelection) return null;

  const handlePromotion = async () => {
    const field = await api.addField(activeSelection.text);

    // 2. Link it to the current note as a value
    await addValueToNote({ field_id: field.id, value: activeSelection });

    // 3. Clear selection to hide the button
    setActiveSelection(null);
  };

  return (
    <button
      onClick={handlePromotion}
      className="fixed bottom-20 right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-xl animate-bounce"
    >
      + Create Field: &quot;{activeSelection}&quot;
    </button>
  );
};

export default FieldCreator;
