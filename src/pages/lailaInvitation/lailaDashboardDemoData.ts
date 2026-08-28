import type { LailaRsvpRow } from "./lailaRsvpApi";

/**
 * Sample RSVP + wishes for portfolio dashboard demo.
 * No real client names or messages.
 */
export const LAILA_DASHBOARD_DEMO_ROWS: readonly LailaRsvpRow[] = [
  {
    submittedAt: "2026-08-01 10:12",
    name: "Aina Rahman",
    attending: "hadir",
    guests: 2,
    message: "Tahniah! Semoga rumah tangga penuh barakah dan kasih sayang.",
    theme: "demo",
  },
  {
    submittedAt: "2026-08-01 11:05",
    name: "Farid Hakim",
    attending: "hadir",
    guests: 3,
    message: "Selamat pengantin baru. Doa restu sentiasa bersama kalian berdua.",
    theme: "demo",
  },
  {
    submittedAt: "2026-08-02 09:40",
    name: "Siti Nurhaliza B.",
    attending: "hadir",
    guests: 1,
    message: "Cantik sekali jemputan ini. Jumpa di majlis!",
    theme: "demo",
  },
  {
    submittedAt: "2026-08-02 14:22",
    name: "Hafiz & Family",
    attending: "hadir",
    guests: 4,
    message: "Semoga menjadi pasangan yang sakinah, mawaddah, warahmah.",
    theme: "demo",
  },
  {
    submittedAt: "2026-08-03 08:15",
    name: "Amira Latif",
    attending: "tidak",
    guests: 1,
    message: "Maaf tidak dapat hadir. Doa kami bersama — bahagia selalu.",
    theme: "demo",
  },
  {
    submittedAt: "2026-08-03 16:48",
    name: "Danial Iskandar",
    attending: "hadir",
    guests: 2,
    message: "Congrats! Excited to celebrate with you both.",
    theme: "demo",
  },
  {
    submittedAt: "2026-08-04 12:01",
    name: "Nadia & Rizal",
    attending: "hadir",
    guests: 2,
    message: "Wahai pengantin baru, semoga cinta kalian kekal hingga Jannah.",
    theme: "demo",
  },
  {
    submittedAt: "2026-08-05 19:30",
    name: "Khairul Anuar",
    attending: "tidak",
    guests: 1,
    message: "Tidak dapat hadir kerana luar bandar. Tahniah & doa restu!",
    theme: "demo",
  },
  {
    submittedAt: "2026-08-06 07:55",
    name: "Puteri Aisyah",
    attending: "hadir",
    guests: 1,
    message: "So happy for you. May every day be filled with laughter and peace.",
    theme: "demo",
  },
  {
    submittedAt: "2026-08-07 21:10",
    name: "Iqbal & Sofea",
    attending: "hadir",
    guests: 2,
    message: "Tahniah! Terima kasih atas jemputan. Kami akan datang dengan penuh sukacita.",
    theme: "demo",
  },
  {
    submittedAt: "2026-08-08 13:27",
    name: "Mira Hassan",
    attending: "hadir",
    guests: 2,
    message: "",
    theme: "demo",
  },
  {
    submittedAt: "2026-08-08 18:02",
    name: "Zainal Abidin",
    attending: "tidak",
    guests: 1,
    message: "",
    theme: "demo",
  },
] as const;
