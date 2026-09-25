import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { InvitationMusicProvider } from "./context/InvitationMusicContext";
import { UcapanCopyProvider } from "./context/UcapanCopyContext";
import { LailaMusicProvider } from "./pages/lailaInvitation/LailaMusicContext";
import { PaanMusicProvider } from "./pages/paanInvitation/PaanMusicContext";
import { CongratulationCardPage } from "./pages/CongratulationCardPage";
import { CongratulationPartyPage } from "./pages/CongratulationPartyPage";
import { HomePage } from "./pages/HomePage";
import { InvitePage } from "./pages/InvitePage";
import { RsvpPage } from "./pages/RsvpPage";
import { UcapanCardCopyFormPage } from "./pages/UcapanCardCopyFormPage";
import { BlessingWheelPage } from "./pages/BlessingWheelPage";
import { ScratchCardPage } from "./pages/ScratchCardPage";
import { UcapanCardPage } from "./pages/UcapanCardPage";
import { WeddingInvitationFramePage } from "./pages/WeddingInvitationFramePage";
import { WeddingInvitationFrameMaroonPage } from "./pages/WeddingInvitationFrameMaroonPage";
import { WeddingInvitationFrameWhiteGoldPage } from "./pages/WeddingInvitationFrameWhiteGoldPage";
import { WeddingInvitationFrameMalayClassicPage } from "./pages/WeddingInvitationFrameMalayClassicPage";
import { GalleryPage } from "./pages/GalleryPage";
import { EggRevealCardPage } from "./pages/EggRevealCardPage";
import { EggRevealCardPastelPage } from "./pages/EggRevealCardPastelPage";
import { EggRevealCardMarketingPage } from "./pages/EggRevealCardMarketingPage";
import { RoyalMaroonInvitationPage } from "./pages/royalMaroonInvitation/RoyalMaroonInvitationPage";
import { LailaInvitationPage } from "./pages/lailaInvitation/LailaInvitationPage";
import { LailaRsvpPage } from "./pages/lailaInvitation/LailaRsvpPage";
import { LailaGalleryPage } from "./pages/lailaInvitation/LailaGalleryPage";
import { LailaDashboardPage } from "./pages/lailaInvitation/LailaDashboardPage";
import { PortfolioPage } from "./pages/portfolio/PortfolioPage";
import { PortfolioAdminPage } from "./pages/portfolio/PortfolioAdminPage";
import { DoodleInvitationPage } from "./pages/doodleInvitation/DoodleInvitationPage";
import { TravellersInvitationPage } from "./pages/travellersInvitation/TravellersInvitationPage";
import { CafeInvitationPage } from "./pages/cafeInvitation/CafeInvitationPage";
import { MalayClassicInvitationPage } from "./pages/malayClassicInvitation/MalayClassicInvitationPage";
import { PaanInvitationPage } from "./pages/paanInvitation/PaanInvitationPage";
import { PaanDashboardPage } from "./pages/paanInvitation/PaanDashboardPage";
import { WhiteGoldDashboardPage } from "./pages/whiteGoldInvitation/WhiteGoldDashboardPage";

const routerBasename =
  import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <>
      <BrowserRouter basename={routerBasename}>
        <InvitationMusicProvider>
          <LailaMusicProvider>
          <PaanMusicProvider>
          <UcapanCopyProvider>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/invite" element={<InvitePage />} />
            <Route path="/jemputan-maroon-diraja" element={<RoyalMaroonInvitationPage />} />
            <Route path="/laila" element={<LailaInvitationPage />} />
            <Route path="/laila/rsvp" element={<LailaRsvpPage />} />
            <Route path="/laila/galeri" element={<LailaGalleryPage />} />
            <Route path="/laila/dashboard" element={<LailaDashboardPage />} />
            <Route path="/laila/papan" element={<Navigate to="/laila/dashboard" replace />} />
            <Route path="/doodle" element={<DoodleInvitationPage />} />
            <Route path="/doodle-pastel" element={<DoodleInvitationPage variant="pastel" />} />
            <Route path="/travellers" element={<TravellersInvitationPage />} />
            <Route path="/cafe" element={<CafeInvitationPage />} />
            <Route path="/malay-classic" element={<MalayClassicInvitationPage />} />
            <Route path="/paan" element={<PaanInvitationPage />} />
            <Route path="/paan/dashboard" element={<PaanDashboardPage />} />
            <Route path="/theocodewedding" element={<PortfolioPage />} />
            <Route path="/theocodewedding/admin" element={<PortfolioAdminPage />} />
            <Route path="/portfolio" element={<Navigate to="/theocodewedding" replace />} />
            <Route path="/rsvp" element={<RsvpPage />} />
            <Route path="/ucapan" element={<CongratulationCardPage />} />
            <Route path="/ucapan-party" element={<CongratulationPartyPage />} />
            <Route path="/kad-ucapan" element={<UcapanCardPage />} />
            <Route path="/kad-gosok" element={<ScratchCardPage />} />
            <Route path="/roda-doa" element={<BlessingWheelPage />} />
            <Route path="/jemputan-frame" element={<WeddingInvitationFramePage />} />
            <Route path="/jemputan-frame-maroon" element={<WeddingInvitationFrameMaroonPage />} />
            <Route
              path="/jemputan-frame-malay-classic"
              element={<WeddingInvitationFrameMalayClassicPage />}
            />
            <Route path="/naim-nadhirah-nikah" element={<WeddingInvitationFrameWhiteGoldPage />} />
            <Route path="/naim-nadhirah-nikah/dashboard" element={<WhiteGoldDashboardPage />} />
            <Route
              path="/naim-nadhirah-nikah/papan"
              element={<Navigate to="/naim-nadhirah-nikah/dashboard" replace />}
            />
            <Route
              path="/demo-gold"
              element={<WeddingInvitationFrameWhiteGoldPage variant="demo" />}
            />
            <Route path="/jemputan-frame-white-gold" element={<Navigate to="/naim-nadhirah-nikah" replace />} />
            <Route path="/galeri" element={<GalleryPage />} />
            <Route path="/kad-wedding-badar" element={<EggRevealCardPage />} />
            <Route path="/kad-wedding-badar-pastel" element={<EggRevealCardPastelPage />} />
            <Route path="/kad-wedding-badar-marketing" element={<EggRevealCardMarketingPage />} />
            <Route path="/kad-telur-tahniah" element={<Navigate to="/kad-wedding-badar" replace />} />
            <Route path="/kad-ucapan/sunting" element={<UcapanCardCopyFormPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </UcapanCopyProvider>
          </PaanMusicProvider>
          </LailaMusicProvider>
        </InvitationMusicProvider>
      </BrowserRouter>
    </>
  );
}
