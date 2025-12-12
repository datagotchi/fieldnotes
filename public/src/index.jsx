import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { UserProvider } from "./contexts/useUserContext";

const container = document.getElementById("root");
if (!container) {
  throw new Error(
    'Root element not found. Please ensure your HTML has <div id="root"></div>'
  );
}

createRoot(container).render(
  <UserProvider>
    <App />
  </UserProvider>
);
