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
  /** Start on user gesture — first tap only seeks to the beginning. */
  playFromStart: () => void;
  /** Continue without seeking when moving between Laila pages. */
  resumeIfPaused: () => void;
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

  const playFromStart = useCallback(() => {
    const el = audioRef.current;
    if (!el || isEmbed) return;

    el.volume = LAILA_MUSIC_VOLUME;
    userPausedRef.current = false;

    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      el.currentTime = 0;
    }

    void el.play().catch(() => undefined);
  }, [isEmbed]);

  const resumeIfPaused = useCallback(() => {
    const el = audioRef.current;
    if (!el || !el.paused || isEmbed || userPausedRef.current) return;
    el.volume = LAILA_MUSIC_VOLUME;
    void el.play().catch(() => undefined);
  }, [isEmbed]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || isEmbed) return;
    if (el.paused) {
      userPausedRef.current = false;
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        el.currentTime = 0;
      }
      el.volume = LAILA_MUSIC_VOLUME;
      void el.play().catch(() => undefined);
      return;
    }
    userPausedRef.current = true;
    el.pause();
    setPlaying(false);
  }, [isEmbed]);

  useEffect(() => {
    if (!isLaila || isEmbed) return;
    resumeIfPaused();
  }, [isLaila, isEmbed, location.pathname, resumeIfPaused]);

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
    <LailaMusicContext.Provider value={{ playing, playFromStart, resumeIfPaused, toggle }}>
      <audio
        ref={audioRef}
        className="laila-music"
        src={LAILA_MUSIC_URL}
        loop
        preload="auto"
        playsInline
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
      className={`laila-music-toggle${playing ? " is-on" : " is-idle"}`}
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? "Hentikan lagu" : "Mainkan lagu"}
    >
      <span className="laila-music-toggle__glow" aria-hidden />
      <span className="laila-music-toggle__spark laila-music-toggle__spark--1" aria-hidden />
      <span className="laila-music-toggle__spark laila-music-toggle__spark--2" aria-hidden />
      <span className="laila-music-toggle__spark laila-music-toggle__spark--3" aria-hidden />
      <svg className="laila-music-toggle__icon" viewBox="0 0 24 24" aria-hidden>
        {playing ? (
          <>
            <path fill="currentColor" d="M6 5h3v14H6V5z" />
            <path fill="currentColor" d="M15 5h3v14h-3V5z" />
          </>
        ) : (
          <path
            fill="currentColor"
            d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
          />
        )}
      </svg>
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
