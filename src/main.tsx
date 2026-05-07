import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { setupPublicAssets } from "./setupPublicAssets";
import "./styles/main.css";
import "./styles/invitation-satellite-maroon.css";

setupPublicAssets();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
