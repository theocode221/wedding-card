import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  defaultUcapanCardCopy,
  mergeUcapanCardCopy,
  type UcapanCardCopy,
} from "../data/ucapanCardCopy";

const STORAGE_KEY = "wedding-kad-ucapan-copy";

function loadFromStorage(): UcapanCardCopy {
  if (typeof window === "undefined") return { ...defaultUcapanCardCopy };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultUcapanCardCopy };
    const parsed = JSON.parse(raw) as Partial<UcapanCardCopy>;
    return mergeUcapanCardCopy(parsed);
  } catch {
    return { ...defaultUcapanCardCopy };
  }
}

function saveToStorage(copy: UcapanCardCopy) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
  } catch {
    /* quota / private mode */
  }
}

type UcapanCopyContextValue = {
  copy: UcapanCardCopy;
  setCopy: (next: UcapanCardCopy) => void;
  updateCopy: (patch: Partial<UcapanCardCopy>) => void;
  resetCopy: () => void;
};

const UcapanCopyContext = createContext<UcapanCopyContextValue | null>(null);

export function UcapanCopyProvider({ children }: { children: ReactNode }) {
  const [copy, setCopyState] = useState<UcapanCardCopy>(() => loadFromStorage());

  const setCopy = useCallback((next: UcapanCardCopy) => {
    const merged = mergeUcapanCardCopy(next);
    setCopyState(merged);
    saveToStorage(merged);
  }, []);

  const updateCopy = useCallback((patch: Partial<UcapanCardCopy>) => {
    setCopyState((prev) => {
      const merged = mergeUcapanCardCopy({ ...prev, ...patch });
      saveToStorage(merged);
      return merged;
    });
  }, []);

  const resetCopy = useCallback(() => {
    const fresh = { ...defaultUcapanCardCopy };
    setCopyState(fresh);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ copy, setCopy, updateCopy, resetCopy }),
    [copy, setCopy, updateCopy, resetCopy],
  );

  return <UcapanCopyContext.Provider value={value}>{children}</UcapanCopyContext.Provider>;
}

export function useUcapanCopy(): UcapanCopyContextValue {
  const ctx = useContext(UcapanCopyContext);
  if (!ctx) {
    throw new Error("useUcapanCopy must be used within UcapanCopyProvider");
  }
  return ctx;
}

/** For pages that may render outside provider (should not happen if App is wrapped). */