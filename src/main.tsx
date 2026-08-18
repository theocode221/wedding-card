import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { setupPublicAssets } from "./setupPublicAssets";
import "./styles/main.css";
import "./styles/studio-credit.css";
import "./styles/portfolio-embed.css";
import "./styles/invitation-satellite-maroon.css";
import "./styles/invitation-satellite-white-gold.css";

setupPublicAssets();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
