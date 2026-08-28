export type PortfolioPreviewFlags = {
  isPreview: boolean;
  isEmbed: boolean;
  skipCinematic: boolean;
};

export function readPortfolioPreviewSearch(search: string): PortfolioPreviewFlags {
  const params = new URLSearchParams(search);
  return {
    isPreview: params.get("preview") === "1",
    isEmbed: params.get("embed") === "1",
    skipCinematic: params.get("skipCinematic") === "1",
  };
}

function withPreviewParams(path: string, extra: Record<string, string>): string {
  const [pathname, existingSearch] = path.split("?");
  const params = new URLSearchParams(existingSearch ?? "");
  params.set("preview", "1");
  for (const [key, value] of Object.entries(extra)) {
    params.set(key, value);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/** Full demo link — opens design with placeholder couple names. */
export function buildPortfolioDemoPath(path: string): string {
  return withPreviewParams(path, {});
}

/**
 * Keep portfolio `preview` / `embed` query when navigating within a demo card
 * (e.g. cover → details hash, or details → RSVP).
 */
export function withPortfolioSearch(
  to: string | { pathname: string; hash?: string },
  search: string,
): { pathname: string; search: string; hash?: string } {
  const pathname = typeof to === "string" ? to : to.pathname;
  const hash = typeof to === "string" ? undefined : to.hash;
  return {
    pathname,
    search: search.startsWith("?") || search === "" ? search : `?${search}`,
    ...(hash ? { hash } : {}),
  };
}

/** Embedded thumbnail — muted, no footer credit, for portfolio grid iframes. */
export function buildPortfolioEmbedPath(path: string): string {
  const withParams = withPreviewParams(path, { embed: "1" });
  const base = import.meta.env.BASE_URL;
  return `${base}${withParams.replace(/^\//, "")}`;
}
