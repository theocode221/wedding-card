import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CinematicInvitation } from "../components/wedding-invitation-frame/CinematicInvitation";
import { InvitationContent } from "../components/wedding-invitation-frame/InvitationContent";
import {
  preloadWeddingInvitationFrames,
  WEDDING_INVITATION_CINEMATIC_URLS,
} from "../data/weddingInvitationFrames";
import "../styles/wedding-invitation-frame.css";

const MIN_LOADING_MS = 400;

export function WeddingInvitationFramePage() {
  const [assetsReady, setAssetsReady] = useState(false);
  const [cinematicKey, setCinematicKey] = useState(0);
  const [showInvitation, setShowInvitation] = useState(false);
  const [inviteShellIn, setInviteShellIn] = useState(false);

  const invitationRef = useRef<HTMLDivElement>(null);
  const urls = WEDDING_INVITATION_CINEMATIC_URLS;

  useEffect(() => {
    let cancel = false;
    const start = performance.now();

    preloadWeddingInvitationFrames(urls)
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

  const handleCinematicComplete = useCallback(() => {
    setShowInvitation(true);
  }, []);

  const handleReplay = useCallback(() => {
    setShowInvitation(false);
    setInviteShellIn(false);
    setCinematicKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="wif-page wif-page--cinematic">
      <Link to="/" className="wif-page__back">
        ← Utama
      </Link>

      {!assetsReady && (
        <div className="wif-loading-overlay" role="status" aria-live="polite">
          <div className="wif-loading">
            <div className="wif-loading__ornament" aria-hidden />
            <p className="wif-loading__text">Menyediakan jemputan…</p>
          </div>
        </div>
      )}

      {assetsReady && (
        <CinematicInvitation
          key={cinematicKey}
          urls={urls}
          onComplete={handleCinematicComplete}
          onReplay={handleReplay}
        />
      )}

      {showInvitation && (
        <div
          ref={invitationRef}
          className={[
            "wif-invitation-shell",
            "wif-invitation-shell--over-scene",
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
