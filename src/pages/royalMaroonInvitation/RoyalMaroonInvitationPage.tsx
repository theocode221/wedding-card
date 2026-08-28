import { useCallback, useEffect } from "react";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import { RoyalMaroonTheme } from "../../templates/RoyalMaroonTheme/RoyalMaroonTheme";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import {
  royalMaroonInviteForPreview,
  royalMaroonPageTitle,
  royalMaroonRsvpWhatsappUrl,
} from "./royalMaroonInviteData";

/**
 * Standalone luxury invitation — its own URL, copy, and RSVP flow (WhatsApp).
 * Not wired to `/invite` or the multi-theme preview bar.
 */
export function RoyalMaroonInvitationPage() {
  const { isPreview } = usePortfolioPreviewMode();
  const invite = royalMaroonInviteForPreview(isPreview);

  useEffect(() => {
    const prev = document.title;
    document.title = royalMaroonPageTitle(invite);
    return () => {
      document.title = prev;
    };
  }, [invite]);

  const onRsvp = useCallback(() => {
    if (isPreview) return;
    window.open(royalMaroonRsvpWhatsappUrl(invite), "_blank", "noopener,noreferrer");
  }, [invite, isPreview]);

  return (
    <>
      <PortfolioBackToCatalog />
      <RoyalMaroonTheme event={invite} onRsvp={onRsvp} />
    </>
  );
}
