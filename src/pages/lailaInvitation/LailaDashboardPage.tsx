import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import { RsvpDashboard, type RsvpDashboardEvent } from "../../components/rsvp-dashboard/RsvpDashboard";
import { PORTFOLIO_DEMO_COUPLE_LABEL, PORTFOLIO_DEMO_VENUE } from "../../data/portfolioDemoNames";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { LAILA_DASHBOARD_DEMO_ROWS } from "./lailaDashboardDemoData";
import { lailaCoupleLabel } from "./lailaInviteData";
import { fetchLailaRsvpRows } from "./lailaRsvpApi";
import { LailaWishesAdminPage } from "./LailaWishesAdminPage";
import "../../components/rsvp-dashboard/rsvp-dashboard.css";
import "./laila-invitation.css";

const LAILA_DASHBOARD_EVENT: RsvpDashboardEvent = {
  title: "Walimatul Urus",
  couple: lailaCoupleLabel(),
  date: "Saturday, 12 December 2026",
  time: "11:00 AM – 4:00 PM",
  venue: "Rinching Terrace Wedding & Event, Kajang",
};

const DEMO_EVENT: RsvpDashboardEvent = {
  title: "Walimatul Urus",
  couple: PORTFOLIO_DEMO_COUPLE_LABEL,
  date: "Saturday, 1 January 2027",
  time: "11:00 AM – 4:00 PM",
  venue: PORTFOLIO_DEMO_VENUE,
};

type HubTab = "rsvp" | "wishlist";

export function LailaDashboardPage() {
  const { isPreview } = usePortfolioPreviewMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: HubTab = searchParams.get("tab") === "wishlist" ? "wishlist" : "rsvp";
  const couple = isPreview ? DEMO_EVENT.couple : lailaCoupleLabel();

  const setTab = (next: HubTab) => {
    if (next === "wishlist") setSearchParams({ tab: "wishlist" }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  useEffect(() => {
    const prev = document.title;
    document.title = tab === "wishlist" ? `Wishlist — ${couple}` : `RSVP Dashboard — ${couple}`;
    return () => {
      document.title = prev;
    };
  }, [couple, tab]);

  const event = useMemo(() => (isPreview ? DEMO_EVENT : LAILA_DASHBOARD_EVENT), [isPreview]);

  return (
    <>
      <PortfolioBackToCatalog />
      <div className="laila-couple-hub" lang="en">
        <div className="laila-couple-hub__screen">
          <nav className="laila-couple-hub__tabs" aria-label="Couple dashboard">
            <button
              type="button"
              className={`laila-couple-hub__tab${tab === "rsvp" ? " is-active" : ""}`}
              aria-current={tab === "rsvp" ? "page" : undefined}
              onClick={() => setTab("rsvp")}
            >
              RSVP
            </button>
            <button
              type="button"
              className={`laila-couple-hub__tab${tab === "wishlist" ? " is-active" : ""}`}
              aria-current={tab === "wishlist" ? "page" : undefined}
              onClick={() => setTab("wishlist")}
            >
              Wishlist
            </button>
          </nav>

          {tab === "rsvp" ? (
            <RsvpDashboard
              event={event}
              loadRows={fetchLailaRsvpRows}
              demoRows={isPreview ? LAILA_DASHBOARD_DEMO_ROWS : undefined}
              fileSlug="suhailah-hazziq"
            />
          ) : (
            <LailaWishesAdminPage embedded />
          )}
        </div>
      </div>
    </>
  );
}