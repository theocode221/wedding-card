import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { InvitationMusicProvider } from "./context/InvitationMusicContext";
import { UcapanCopyProvider } from "./context/UcapanCopyContext";
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
import { GalleryPage } from "./pages/GalleryPage";
import { EggRevealCardPage } from "./pages/EggRevealCardPage";

const routerBasename =
  import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <>
      <BrowserRouter basename={routerBasename}>
        <InvitationMusicProvider>
          <UcapanCopyProvider>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/invite" element={<InvitePage />} />
            <Route path="/rsvp" element={<RsvpPage />} />
            <Route path="/ucapan" element={<CongratulationCardPage />} />
            <Route path="/ucapan-party" element={<CongratulationPartyPage />} />
            <Route path="/kad-ucapan" element={<UcapanCardPage />} />
            <Route path="/kad-gosok" element={<ScratchCardPage />} />
            <Route path="/roda-doa" element={<BlessingWheelPage />} />
            <Route path="/jemputan-frame" element={<WeddingInvitationFramePage />} />
            <Route path="/galeri" element={<GalleryPage />} />
            <Route path="/kad-wedding-badar" element={<EggRevealCardPage />} />
            <Route path="/kad-telur-tahniah" element={<Navigate to="/kad-wedding-badar" replace />} />
            <Route path="/kad-ucapan/sunting" element={<UcapanCardCopyFormPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </UcapanCopyProvider>
        </InvitationMusicProvider>
      </BrowserRouter>
    </>
  );
}
