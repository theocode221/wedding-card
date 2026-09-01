import type { WhiteGoldRsvpRow } from "./whiteGoldRsvpApi";

/** Sample RSVP + wishes for portfolio dashboard demo (not real client data). */
export const WHITE_GOLD_DASHBOARD_DEMO_ROWS: readonly WhiteGoldRsvpRow[] = [
  {
    submittedAt: "2026-08-10 09:20",
    name: "Aina & Family",
    attending: "hadir",
    guests: 3,
    message: "Tahniah! Semoga rumah tangga penuh barakah.",
    theme: "whiteGold",
  },
  {
    submittedAt: "2026-08-10 11:45",
    name: "Hafiz Rahman",
    attending: "hadir",
    guests: 2,
    message: "Selamat pengantin baru. Jumpa di majlis!",
    theme: "whiteGold",
  },
  {
    submittedAt: "2026-08-11 14:02",
    name: "Siti Amira",
    attending: "hadir",
    guests: 1,
    message: "Cantik sekali jemputan gold ini. Doa restu selalu.",
    theme: "whiteGold",
  },
  {
    submittedAt: "2026-08-12 08:33",
    name: "Danial Iskandar",
    attending: "tidak",
    guests: 1,
    message: "Maaf tidak dapat hadir. Semoga bahagia selalu.",
    theme: "whiteGold",
  },
  {
    submittedAt: "2026-08-12 19:10",
    name: "Puteri & Rizal",
    attending: "hadir",
    guests: 4,
    message: "Semoga menjadi pasangan yang sakinah, mawaddah, warahmah.",
    theme: "whiteGold",
  },
  {
    submittedAt: "2026-08-13 16:28",
    name: "Khairul Anuar",
    attending: "hadir",
    guests: 2,
    message: "Congrats! Excited to celebrate with you both.",
    theme: "whiteGold",
  },
  {
    submittedAt: "2026-08-14 10:05",
    name: "Nadia Latif",
    attending: "tidak",
    guests: 1,
    message: "Tidak dapat hadir kerana luar bandar. Tahniah!",
    theme: "whiteGold",
  },
  {
    submittedAt: "2026-08-15 12:40",
    name: "Farah & Hakim",
    attending: "hadir",
    guests: 2,
    message: "Alhamdulillah. Doa kami bersama kalian berdua.",
    theme: "whiteGold",
  },
] as const;
