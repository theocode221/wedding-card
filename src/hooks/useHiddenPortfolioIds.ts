import { useEffect, useState } from "react";
import {
  PORTFOLIO_HIDDEN_CHANGE_EVENT,
  readHiddenPortfolioIds,
} from "../lib/portfolioVisibility";

export function useHiddenPortfolioIds() {
  const [hiddenIds, setHiddenIds] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readHiddenPortfolioIds(),
  );

  useEffect(() => {
    const sync = () => setHiddenIds(readHiddenPortfolioIds());
    window.addEventListener("storage", sync);
    window.addEventListener(PORTFOLIO_HIDDEN_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(PORTFOLIO_HIDDEN_CHANGE_EVENT, sync);
    };
  }, []);

  return hiddenIds;
}
