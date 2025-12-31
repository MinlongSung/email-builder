import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.tsx";
import "@/richtext/core/extensions/nodes/table/table.css";
import "@/richtext/core/extensions/marks/link/link.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
