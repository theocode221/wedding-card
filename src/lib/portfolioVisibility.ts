import { PORTFOLIO_ITEMS } from "../data/portfolioCatalog";

const HIDDEN_KEY = "theocodewedding-portfolio-hidden-v2";
const SESSION_KEY = "theocodewedding-portfolio-admin";
const ADMIN_PASSWORD = "12345";
const CHANGE_EVENT = "theocodewedding-portfolio-hidden-change";

export const PORTFOLIO_DEFAULT_HIDDEN_IDS = PORTFOLIO_ITEMS.filter((item) => !item.showOnDemo).map(
  (item) => item.id,
);

export function readHiddenPortfolioIds(): string[] {
  if (typeof window === "undefined") return [...PORTFOLIO_DEFAULT_HIDDEN_IDS];
  try {
    const raw = window.localStorage.getItem(HIDDEN_KEY);
    if (raw === null) return [...PORTFOLIO_DEFAULT_HIDDEN_IDS];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [...PORTFOLIO_DEFAULT_HIDDEN_IDS];
  } catch {
    return [...PORTFOLIO_DEFAULT_HIDDEN_IDS];
  }
}

export function writeHiddenPortfolioIds(ids: string[]) {
  window.localStorage.setItem(HIDDEN_KEY, JSON.stringify([...new Set(ids)]));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function hidePortfolioItem(id: string) {
  writeHiddenPortfolioIds([...readHiddenPortfolioIds(), id]);
}

export function showPortfolioItem(id: string) {
  writeHiddenPortfolioIds(readHiddenPortfolioIds().filter((item) => item !== id));
}

export function isPortfolioAdminUnlocked(): boolean {
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

export function unlockPortfolioAdmin(password: string): boolean {
  if (password !== ADMIN_PASSWORD) return false;
  window.sessionStorage.setItem(SESSION_KEY, "1");
  return true;
}

export function lockPortfolioAdmin() {
  window.sessionStorage.removeItem(SESSION_KEY);
}

export const PORTFOLIO_HIDDEN_CHANGE_EVENT = CHANGE_EVENT;
