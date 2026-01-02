import React, { useMemo, useState } from "react";

const EmojiSelection = () => {
  const [selectedEmoji, setSelectedEmoji] = useState("😀");

  const reactOptions = useMemo(() => {
    const firstEmojiCode = "😀".codePointAt(0);
    return Array.from({ length: 80 }, (_, i) => {
      const char = String.fromCodePoint((firstEmojiCode ?? 0) + i);
      return (
        <option value={char} key={`emoji-${char}`}>
          {char}
        </option>
      );
    });
  }, []);

  return (
    <div className="fieldnote-selector">
      <label htmlFor="emoji-reaction">Select Reaction:</label>
      <select
        id="emoji-reaction"
        style={{ fontSize: "2rem", padding: "5px" }}
        value={selectedEmoji}
        onChange={(e) => setSelectedEmoji(e.target.value)}
      >
        {reactOptions}
      </select>
    </div>
  );
};

export default EmojiSelection;
