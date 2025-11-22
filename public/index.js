import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const container = document.getElementById("root");
if (!container) {
  throw new Error(
    'Root element not found. Please ensure your HTML has <div id="root"></div>'
  );
}

createRoot(container).render(<App />);
