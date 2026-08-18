import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { readPortfolioPreviewSearch } from "../lib/portfolioPreview";

export function usePortfolioPreviewMode() {
  const [searchParams] = useSearchParams();
  const flags = useMemo(
    () => readPortfolioPreviewSearch(searchParams.toString()),
    [searchParams],
  );

  useEffect(() => {
    if (!flags.isEmbed) return;
    document.documentElement.classList.add("portfolio-embed");
    return () => {
      document.documentElement.classList.remove("portfolio-embed");
    };
  }, [flags.isEmbed]);

  return flags;
}
