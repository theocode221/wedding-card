import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { publicUrl } from "../lib/publicAsset";
import "../styles/wedding-invitation-frame.css";

/** Must respect Vite `base` (e.g. GitHub Pages `/repo-name/`). */
const INVITATION_MUSIC_URL = publicUrl("wedding-invitation/song.mp3");
const INVITATION_MUSIC_VOLUME = 0.42;

/** Routes where invitation BGM may continue (same “card” flow as jemputan). */
const ROUTES_ALLOW_INVITATION_BGM = new Set(["/jemputan-frame", "/galeri", "/rsvp"]);

type InvitationMusicContextValue = {
  /** Start or restart from the beginning (e.g. “Buka Jemputan”). */
  playFromStart: () => void;
  /** Pause and reset to the beginning (e.g. “Main semula”). */
  stop: () => void;
  /** If paused, play without seeking — for skip-cinematic entry when music may already be playing from galeri. */
  resumeIfPaused: () => void;
};

const InvitationMusicContext = createContext<InvitationMusicContextValue | null>(null);

export function InvitationMusicProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playFromStart = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = INVITATION_MUSIC_VOLUME;
    el.currentTime = 0;
    void el.play().catch(() => undefined);
  }, []);

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, []);

  const resumeIfPaused = useCallback(() => {
    const el = audioRef.current;
    if (!el || !el.paused) return;
    el.volume = INVITATION_MUSIC_VOLUME;
    void el.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (ROUTES_ALLOW_INVITATION_BGM.has(location.pathname)) return;
    audioRef.current?.pause();
  }, [location.pathname]);

  return (
    <InvitationMusicContext.Provider value={{ playFromStart, stop, resumeIfPaused }}>
      <audio
        ref={audioRef}
        className="wif-page__music"
        src={INVITATION_MUSIC_URL}
        loop
        preload="auto"
        aria-hidden
      />
      {children}
    </InvitationMusicContext.Provider>
  );
}

export function useInvitationMusic() {
  const ctx = useContext(InvitationMusicContext);
  if (!ctx) {
    throw new Error("useInvitationMusic must be used within InvitationMusicProvider");
  }
  return ctx;
}
