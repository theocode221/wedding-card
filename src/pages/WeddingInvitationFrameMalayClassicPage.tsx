import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PortfolioBackToCatalog } from "../components/portfolio/PortfolioBackToCatalog";
import { CinematicInvitation } from "../components/wedding-invitation-frame/CinematicInvitation";
import { MalayClassicCinematicDecor } from "../components/wedding-invitation-frame/MalayClassicCinematicDecor";
import { MalayClassicFrameInvitationContent } from "../components/wedding-invitation-frame/MalayClassicFrameInvitationContent";
import { useInvitationMusic } from "../context/InvitationMusicContext";
import { usePortfolioPreviewMode } from "../hooks/usePortfolioPreviewMode";
import { PORTFOLIO_DEMO_CINEMATIC_COPY } from "../data/portfolioDemoNames";
import { MALAY_CLASSIC_CINEMATIC_COPY } from "../data/cinematicInvitationCopy";
import {
  preloadWeddingInvitationHero,
  preloadWeddingInvitationFrames,
  WEDDING_INVITATION_MALAY_CLASSIC_CINEMATIC_URLS,
} from "../data/weddingInvitationFrames";
import {
  classicInviteForPreview,
  classicPageTitle,
} from "./malayClassicInvitation/classicInviteData";
import "../styles/wedding-invitation-frame.css";
import "../styles/wedding-invitation-frame-malay-classic.css";

const MIN_LOADING_MS = 120;

type InvitationFrameLocationState = {
  skipCinematic?: boolean;
  scrollTo?: "details" | "top";
};

/** Malay Classic look on the shared cinematic frame shell. */
export function WeddingInvitationFrameMalayClassicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const preview = usePortfolioPreviewMode();
  const { skipCinematic: skipFromState = false, scrollTo } =
    (location.state as InvitationFrameLocationState | null) ?? {};

  const invite = classicInviteForPreview(preview.isPreview);

  const [assetsReady, setAssetsReady] = useState(false);
  const [cinematicKey, setCinematicKey] = useState(0);
  const [showInvitation, setShowInvitation] = useState(false);
  const [inviteShellIn, setInviteShellIn] = useState(false);

  const invitationRef = useRef<HTMLDivElement>(null);
  const { playFromStart, stop: stopInvitationMusic, resumeIfPaused } = useInvitationMusic();
  const urls = WEDDING_INVITATION_MALAY_CLASSIC_CINEMATIC_URLS;

  useEffect(() => {
    const prev = document.title;
    document.title = classicPageTitle(invite);
    return () => {
      document.title = prev;
    };
  }, [invite]);

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
    navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: {} });
    setShowInvitation(false);
    setInviteShellIn(false);
    setCinematicKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate, location.pathname, location.search, stopInvitationMusic]);

  const skipCinematic = skipFromState || preview.skipCinematic;
  const cinematicCopy = preview.isPreview ? PORTFOLIO_DEMO_CINEMATIC_COPY : MALAY_CLASSIC_CINEMATIC_COPY;

  return (
    <main
      className={[
        "wif-page",
        "wif-page--malay-classic",
        "wif-page--cinematic",
        skipCinematic ? "wif-page--invitation-only" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <PortfolioBackToCatalog />
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
          copy={cinematicCopy}
          onComplete={handleCinematicComplete}
          onOpenCinematic={playFromStart}
          decorMidLayer={<MalayClassicCinematicDecor />}
          autoStart={preview.isEmbed}
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
          <MalayClassicFrameInvitationContent onReplay={handleReplay} demoMode={preview.isPreview} />
        </div>
      )}
    </main>
  );
}
