import { useCallback, useEffect } from "react";
import { RoyalMaroonTheme } from "../../templates/RoyalMaroonTheme/RoyalMaroonTheme";
import { ROYAL_MAROON_INVITE, royalMaroonRsvpWhatsappUrl } from "./royalMaroonInviteData";

const PAGE_TITLE = "Walimatul Urus —  NAIM & NADHIRAH";

/**
 * Standalone luxury invitation — its own URL, copy, and RSVP flow (WhatsApp).
 * Not wired to `/invite` or the multi-theme preview bar.
 */
export function RoyalMaroonInvitationPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = PAGE_TITLE;
    return () => {
      document.title = prev;
    };
  }, []);

  const onRsvp = useCallback(() => {
    const href = royalMaroonRsvpWhatsappUrl(ROYAL_MAROON_INVITE);
    window.open(href, "_blank", "noopener,noreferrer");
  }, []);

  return <RoyalMaroonTheme event={ROYAL_MAROON_INVITE} onRsvp={onRsvp} />;
}
