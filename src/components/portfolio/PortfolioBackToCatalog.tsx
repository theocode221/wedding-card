import { Link } from "react-router-dom";
import { PORTFOLIO_CATALOG_PATH } from "../../data/portfolioDemoNames";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import "./portfolio-demo-chrome.css";

type PortfolioBackToCatalogProps = {
  /** Force show (e.g. `/demo-gold` without `?preview=1`). */
  force?: boolean;
  className?: string;
};

/** Shown on full-page demo opens — hidden in portfolio embed iframes. */
export function PortfolioBackToCatalog({ force = false, className = "" }: PortfolioBackToCatalogProps) {
  const { isPreview, isEmbed } = usePortfolioPreviewMode();
  if (isEmbed) return null;
  if (!force && !isPreview) return null;

  return (
    <Link
      to={PORTFOLIO_CATALOG_PATH}
      className={["portfolio-back-catalog", className].filter(Boolean).join(" ")}
    >
      ← Katalog
    </Link>
  );
}
