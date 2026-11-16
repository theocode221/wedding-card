import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import { RsvpDashboard, type RsvpDashboardEvent } from "../../components/rsvp-dashboard/RsvpDashboard";
import { PORTFOLIO_DEMO_COUPLE_LABEL, PORTFOLIO_DEMO_VENUE } from "../../data/portfolioDemoNames";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { LAILA_DASHBOARD_DEMO_ROWS } from "./lailaDashboardDemoData";
import { lailaCoupleLabel } from "./lailaInviteData";
import { fetchLailaRsvpRows } from "./lailaRsvpApi";

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

export function LailaDashboardPage() {
  const { isPreview } = usePortfolioPreviewMode();

  return (
    <>
      <PortfolioBackToCatalog />
      <RsvpDashboard
        event={isPreview ? DEMO_EVENT : LAILA_DASHBOARD_EVENT}
        loadRows={fetchLailaRsvpRows}
        demoRows={isPreview ? LAILA_DASHBOARD_DEMO_ROWS : undefined}
        fileSlug="suhailah-hazziq"
      />
    </>
  );
}
