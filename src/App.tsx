import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CongratulationCardPage } from "./pages/CongratulationCardPage";
import { HomePage } from "./pages/HomePage";
import { InvitePage } from "./pages/InvitePage";
import { RsvpPage } from "./pages/RsvpPage";
import { UcapanCardPage } from "./pages/UcapanCardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/invitation" element={<InvitePage />} />
        <Route path="/invite" element={<Navigate to="/invitation" replace />} />
        <Route path="/rsvp" element={<RsvpPage />} />
        <Route path="/ucapan" element={<CongratulationCardPage />} />
        <Route path="/kad-ucapan" element={<UcapanCardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
