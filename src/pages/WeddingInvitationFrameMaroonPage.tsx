import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CinematicInvitation } from "../components/wedding-invitation-frame/CinematicInvitation";
import { MaroonBokehDrift } from "../components/wedding-invitation-frame/MaroonBokehDrift";
import { InvitationContent } from "../components/wedding-invitation-frame/InvitationContent";
import { useInvitationMusic } from "../context/InvitationMusicContext";
import {
  preloadWeddingInvitationHero,
  preloadWeddingInvitationFrames,
  WEDDING_INVITATION_CINEMATIC_URLS,
} from "../data/weddingInvitationFrames";
import "../styles/wedding-invitation-frame.css";
import "../styles/wedding-invitation-frame-maroon.css";

/** Same flow as `WeddingInvitationFramePage` — maroon & gold skin only. */
const MIN_LOADING_MS = 120;

type InvitationFrameLocationState = {
  skipCinematic?: boolean;
  scrollTo?: "details" | "top";
};

export function WeddingInvitationFrameMaroonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { skipCinematic: skipFromState = false, scrollTo } =
    (location.state as InvitationFrameLocationState | null) ?? {};

  const [assetsReady, setAssetsReady] = useState(false);
  const [cinematicKey, setCinematicKey] = useState(0);
  const [showInvitation, setShowInvitation] = useState(false);
  const [inviteShellIn, setInviteShellIn] = useState(false);

  const invitationRef = useRef<HTMLDivElement>(null);
  const { playFromStart, stop: stopInvitationMusic, resumeIfPaused } = useInvitationMusic();
  const urls = WEDDING_INVITATION_CINEMATIC_URLS;

  useEffect(() => {
    let cancel = false;
    const start = performance.now();

    preloadWeddingInvitationHero(urls)
      .catch(() => undefined)
      .finally(() => {
        if (cancel) return;
        const elapsed = performance.now() - start;
        const wait = Math.max(0, MIN_LOADING_MS - elapsed);
        window.setTimeout(() => {
          if (!cancel) setAssetsReady(true);
        }, wait);
      });

    return () => {
      cancel = true;
    };
  }, [urls]);

  useEffect(() => {
    if (urls.length < 3) return;
    preloadWeddingInvitationFrames([urls[1], urls[2]]).catch(() => undefined);
  }, [urls]);

  useLayoutEffect(() => {
    if (!assetsReady || !skipFromState) return;
    setShowInvitation(true);
  }, [assetsReady, skipFromState]);

  useEffect(() => {
    if (!assetsReady || !skipFromState || !showInvitation) return;
    resumeIfPaused();
  }, [assetsReady, skipFromState, showInvitation, resumeIfPaused]);

  useEffect(() => {
    if (!assetsReady) return;
    document.body.style.overflow = showInvitation ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [assetsReady, showInvitation]);

  useEffect(() => {
    if (!showInvitation) {
      setInviteShellIn(false);
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setInviteShellIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [showInvitation]);

  useEffect(() => {
    if (!inviteShellIn) return;
    invitationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [inviteShellIn]);

  useEffect(() => {
    if (!inviteShellIn || scrollTo !== "details") return;
    const id = window.setTimeout(() => {
      document.getElementById("wif-invitation-details")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 450);
    return () => window.clearTimeout(id);
  }, [inviteShellIn, scrollTo]);

  const handleCinematicComplete = useCallback(() => {
    setShowInvitation(true);
  }, []);

  const handleReplay = useCallback(() => {
    stopInvitationMusic();
    navigate(location.pathname, { replace: true, state: {} });
    setShowInvitation(false);
    setInviteShellIn(false);
    setCinematicKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate, location.pathname, stopInvitationMusic]);

  const skipCinematic = skipFromState;

  return (
    <main
      className={[
        "wif-page",
        "wif-page--maroon-gold",
        "wif-page--cinematic",
        skipCinematic ? "wif-page--invitation-only" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {!assetsReady && (
        <div className="wif-loading-overlay" role="status" aria-live="polite">
          <div className="wif-loading">
            <div className="wif-loading__ornament" aria-hidden />
            <p className="wif-loading__text">Menyediakan jemputan…</p>
          </div>
        </div>
      )}

      {assetsReady && !skipCinematic && !showInvitation && (
        <CinematicInvitation
          key={cinematicKey}
          urls={urls}
          onComplete={handleCinematicComplete}
          onOpenCinematic={playFromStart}
          decorMidLayer={<MaroonBokehDrift />}
        />
      )}

      {showInvitation && (
        <div
          ref={invitationRef}
          className={[
            "wif-invitation-shell",
            "wif-invitation-shell--over-scene",
            skipCinematic ? "wif-invitation-shell--direct" : "",
            inviteShellIn ? "wif-invitation-shell--in" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <InvitationContent onReplay={handleReplay} />
        </div>
      )}
    </main>
  );
}
