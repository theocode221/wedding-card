import { PortfolioBackToCatalog } from "../components/portfolio/PortfolioBackToCatalog";
import { UcapanCardExperience } from "../components/ucapan/UcapanCardExperience";
import "../styles/ucapan.css";

export function UcapanCardPage() {
  return (
    <>
      <PortfolioBackToCatalog />
      <UcapanCardExperience variant="traditional" />
    </>
  );
}
