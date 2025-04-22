import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./Components/App.tsx";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Analytics basePath="/monitor" />
  </StrictMode>
);
