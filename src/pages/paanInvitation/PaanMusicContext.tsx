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
import { PAAN_DASHBOARD_PATH, PAAN_PATH } from "./paanInviteData";
import "./paan-invitation.css";

const PAAN_MUSIC_URL = encodeURI(publicUrl("paan/lagu paan.mp3"));
const PAAN_MUSIC_VOLUME = 0.48;

function isPaanPublicPath(pathname: string): boolean {
  if (pathname === PAAN_DASHBOARD_PATH) return false;
  return pathname === PAAN_PATH || pathname.startsWith(`${PAAN_PATH}/`);
}

type PaanMusicContextValue = {
  playing: boolean;
  /** Start on user gesture — first tap only seeks to the beginning. */
  playFromStart: () => void;
  /** Continue without seeking when moving between Paan pages. */
  resumeIfPaused: () => void;
  toggle: () => void;
};

const PaanMusicContext = createContext<PaanMusicContextValue | null>(null);

export function PaanMusicProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const isPaan = isPaanPublicPath(location.pathname);
  const isEmbed = readPortfolioPreviewSearch(location.search).isEmbed;

  const playFromStart = useCallback(() => {
    const el = audioRef.current;
    if (!el || isEmbed) return;

    el.volume = PAAN_MUSIC_VOLUME;
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
    el.volume = PAAN_MUSIC_VOLUME;
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
      el.volume = PAAN_MUSIC_VOLUME;
      void el.play().catch(() => undefined);
      return;
    }
    userPausedRef.current = true;
    el.pause();
    setPlaying(false);
  }, [isEmbed]);

  useEffect(() => {
    if (!isPaan || isEmbed) return;
    resumeIfPaused();
  }, [isPaan, isEmbed, location.pathname, resumeIfPaused]);

  useEffect(() => {
    if (isPaan) return;
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    hasStartedRef.current = false;
    userPausedRef.current = false;
    setPlaying(false);
  }, [isPaan]);

  return (
    <PaanMusicContext.Provider value={{ playing, playFromStart, resumeIfPaused, toggle }}>
      <audio
        ref={audioRef}
        className="paan-music"
        src={PAAN_MUSIC_URL}
        loop
        preload="metadata"
        playsInline
        aria-hidden
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {isPaan && !isEmbed ? <PaanMusicToggle playing={playing} onToggle={toggle} /> : null}
      {children}
    </PaanMusicContext.Provider>
  );
}

function PaanMusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={`paan-music-toggle${playing ? " is-on" : " is-idle"}`}
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? "Hentikan lagu" : "Mainkan lagu"}
    >
      <span className="paan-music-toggle__glow" aria-hidden />
      <span className="paan-music-toggle__spark paan-music-toggle__spark--1" aria-hidden />
      <span className="paan-music-toggle__spark paan-music-toggle__spark--2" aria-hidden />
      <span className="paan-music-toggle__spark paan-music-toggle__spark--3" aria-hidden />
      <svg className="paan-music-toggle__icon" viewBox="0 0 24 24" aria-hidden>
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

export function usePaanMusic() {
  const ctx = useContext(PaanMusicContext);
  if (!ctx) {
    throw new Error("usePaanMusic must be used within PaanMusicProvider");
  }
  return ctx;
}
