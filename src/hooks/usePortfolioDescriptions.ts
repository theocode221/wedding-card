import { useEffect, useState } from "react";
import {
  PORTFOLIO_DESCRIPTIONS_CHANGE_EVENT,
  readPortfolioDescriptions,
  type PortfolioDescriptionMap,
} from "../lib/portfolioDescriptions";

export function usePortfolioDescriptions() {
  const [descriptions, setDescriptions] = useState<PortfolioDescriptionMap>(() =>
    typeof window === "undefined" ? {} : readPortfolioDescriptions(),
  );

  useEffect(() => {
    const sync = () => setDescriptions(readPortfolioDescriptions());
    window.addEventListener("storage", sync);
    window.addEventListener(PORTFOLIO_DESCRIPTIONS_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(PORTFOLIO_DESCRIPTIONS_CHANGE_EVENT, sync);
    };
  }, []);

  return descriptions;
}
