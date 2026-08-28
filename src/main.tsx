import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { STUDIO_NAME } from "./data/studioBrand";
import { readPortfolioPreviewSearch } from "./lib/portfolioPreview";
import { setupPublicAssets } from "./setupPublicAssets";
import "./styles/main.css";
import "./styles/studio-credit.css";
import "./styles/portfolio-embed.css";
import "./styles/invitation-satellite-maroon.css";
import "./styles/invitation-satellite-white-gold.css";

setupPublicAssets();

/** Avoid flashing a client couple name in the tab before the route sets its title. */
const previewFlags = readPortfolioPreviewSearch(window.location.search);
document.title = previewFlags.isPreview || previewFlags.isEmbed ? `${STUDIO_NAME} — Demo` : STUDIO_NAME;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
