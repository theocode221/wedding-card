import { PortfolioBackToCatalog } from "../components/portfolio/PortfolioBackToCatalog";
import { UcapanCardExperience } from "../components/ucapan/UcapanCardExperience";
import "../styles/ucapan.css";
import "../styles/ucapan-party-overrides.css";
import "../styles/ucapan-party-flow.css";

/** Same envelope → tarik surat → ucapan taip → kejutan as `/kad-ucapan`, with neon “party” skin. */
export function CongratulationPartyPage() {
  return (
    <>
      <PortfolioBackToCatalog />
      <UcapanCardExperience variant="party" showHomeLink />
    </>
  );
}
