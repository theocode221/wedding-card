import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { readPortfolioPreviewSearch } from "../../lib/portfolioPreview";
import { publicUrl } from "../../lib/publicAsset";
import { LAILA_DASHBOARD_PATH } from "./lailaInviteData";
import "./laila-invitation.css";

const LAILA_MUSIC_URL = encodeURI(publicUrl("lela kb/laila-song.mp3"));
const LAILA_MUSIC_VOLUME = 0.48;

function isLailaPublicPath(pathname: string): boolean {
  if (pathname === LAILA_DASHBOARD_PATH) return false;
  return pathname === "/laila" || pathname.startsWith("/laila/");
}

type LailaMusicContextValue = {
  playing: boolean;
  /** Play without seeking — use after navigation or on user gesture. */
  resume: () => void;
  toggle: () => void;
};

const LailaMusicContext = createContext<LailaMusicContextValue | null>(null);

export function LailaMusicProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const isLaila = isLailaPublicPath(location.pathname);
  const isEmbed = readPortfolioPreviewSearch(location.search).isEmbed;

  const resume = useCallback(() => {
    const el = audioRef.current;
    if (!el || isEmbed || userPausedRef.current) return;
    el.volume = LAILA_MUSIC_VOLUME;
    if (el.paused) {
      void el.play().then(() => setPlaying(true)).catch(() => undefined);
    }
  }, [isEmbed]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || isEmbed) return;
    if (el.paused) {
      userPausedRef.current = false;
      el.volume = LAILA_MUSIC_VOLUME;
      void el.play().then(() => setPlaying(true)).catch(() => undefined);
      return;
    }
    userPausedRef.current = true;
    el.pause();
    setPlaying(false);
  }, [isEmbed]);

  useEffect(() => {
    if (!isLaila || isEmbed) return;
    const el = audioRef.current;
    if (!el || userPausedRef.current) return;

    el.volume = LAILA_MUSIC_VOLUME;
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      el.currentTime = 0;
    }

    if (el.paused) {
      void el.play().then(() => setPlaying(true)).catch(() => undefined);
    }
  }, [isLaila, isEmbed, location.pathname]);

  useEffect(() => {
    if (isLaila) return;
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    hasStartedRef.current = false;
    userPausedRef.current = false;
    setPlaying(false);
  }, [isLaila]);

  return (
    <LailaMusicContext.Provider value={{ playing, resume, toggle }}>
      <audio
        ref={audioRef}
        className="laila-music"
        src={LAILA_MUSIC_URL}
        loop
        preload="auto"
        aria-hidden
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {isLaila && !isEmbed ? <LailaMusicToggle playing={playing} onToggle={toggle} /> : null}
      {children}
    </LailaMusicContext.Provider>
  );
}

function LailaMusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={`laila-music-toggle${playing ? " is-on" : ""}`}
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? "Hentikan lagu" : "Mainkan lagu"}
    >
      {playing ? (
        <svg viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M9 5.2v13.6c0 .5-.6.8-1 .5L5.2 16H3.5A1.5 1.5 0 0 1 2 14.5v-5A1.5 1.5 0 0 1 3.5 8h1.7L8 5.7c.4-.3 1 0 1 .5Zm11.2 2.1-1.4 1.4a5.5 5.5 0 0 1 0 6.6l1.4 1.4a7.5 7.5 0 0 0 0-9.4ZM16.4 9.7 15 11.1a2.5 2.5 0 0 1 0 1.8l1.4 1.4a4.5 4.5 0 0 0 0-4.6Z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M9 5.2v13.6c0 .5-.6.8-1 .5L5.2 16H3.5A1.5 1.5 0 0 1 2 14.5v-5A1.5 1.5 0 0 1 3.5 8h1.7L8 5.7c.4-.3 1 0 1 .5Zm13.2.1-1.4 1.4-2.6 2.6-2.6 2.6-2.7 2.7-1.4 1.4 1.4 1.4 1.4-1.4 2.7-2.7 2.6-2.6 2.6-2.6 1.4-1.4Z"
          />
        </svg>
      )}
    </button>
  );
}

export function useLailaMusic() {
  const ctx = useContext(LailaMusicContext);
  if (!ctx) {
    throw new Error("useLailaMusic must be used within LailaMusicProvider");
  }
  return ctx;
}
