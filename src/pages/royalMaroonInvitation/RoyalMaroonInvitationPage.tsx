import { useCallback, useEffect } from "react";
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
    const href = royalMaroonRsvpWhatsappUrl(invite);
    window.open(href, "_blank", "noopener,noreferrer");
  }, [invite]);

  return <RoyalMaroonTheme event={invite} onRsvp={onRsvp} />;
}
