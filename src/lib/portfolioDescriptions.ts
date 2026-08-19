import { PORTFOLIO_ITEMS } from "../data/portfolioCatalog";

const DESCRIPTIONS_KEY = "theocodewedding-portfolio-descriptions";
const CHANGE_EVENT = "theocodewedding-portfolio-descriptions-change";

export type PortfolioDescriptionMap = Record<string, string>;

export function readPortfolioDescriptions(): PortfolioDescriptionMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DESCRIPTIONS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: PortfolioDescriptionMap = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "string" && value.trim()) out[id] = value.trim();
    }
    return out;
  } catch {
    return {};
  }
}

function persist(map: PortfolioDescriptionMap) {
  window.localStorage.setItem(DESCRIPTIONS_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function catalogDescriptionFor(id: string): string {
  return PORTFOLIO_ITEMS.find((item) => item.id === id)?.description ?? "";
}

export function resolvedPortfolioDescription(id: string, catalogDescription: string, overrides = readPortfolioDescriptions()): string {
  const custom = overrides[id]?.trim();
  return custom || catalogDescription;
}

export function writePortfolioDescription(id: string, value: string) {
  const map = readPortfolioDescriptions();
  const trimmed = value.trim();
  if (!trimmed || trimmed === catalogDescriptionFor(id)) {
    delete map[id];
  } else {
    map[id] = trimmed;
  }
  persist(map);
}

export function resetPortfolioDescription(id: string) {
  const map = readPortfolioDescriptions();
  delete map[id];
  persist(map);
}

export const PORTFOLIO_DESCRIPTIONS_CHANGE_EVENT = CHANGE_EVENT;
