import { publicUrl } from "../lib/publicAsset";

export type PortfolioCategory = "jemputan" | "ucapan" | "interaktif";

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  path: string;
  category: PortfolioCategory;
  previewImage?: string;
  previewGradient?: string;
  /** Skip the Demo / couple-name overlay when the poster already includes names. */
  posterHasCopy?: boolean;
  /** When false, hidden on the public demo grid until admin unhides it. */
  showOnDemo?: boolean;
  tags?: readonly string[];
};

export const PORTFOLIO_CATEGORIES: readonly { id: PortfolioCategory; label: string }[] = [
  { id: "jemputan", label: "Jemputan" },
  { id: "ucapan", label: "Ucapan & tahniah" },
  { id: "interaktif", label: "Interaktif" },
];

export const PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  {
    id: "laila",
    title: "Maroon Tradisional",
    description: "Latar oval maroon, nama tulisan tangan, RSVP, galeri & ucapan tetamu.",
    path: "/laila",
    category: "jemputan",
    previewImage: publicUrl("demo/laila.png"),
    posterHasCopy: true,
    showOnDemo: true,
    tags: ["RSVP", "Galeri", "Ucapan"],
  },
  {
    id: "white-gold",
    title: "White & Gold",
    description: "Tema ivory putih dengan aksen emas champagne dan animasi pembuka.",
    path: "/naim-nadhirah-nikah",
    category: "jemputan",
    previewImage: publicUrl("wedding-invitation/1 gold.png"),
    showOnDemo: true,
    tags: ["Animasi", "RSVP"],
  },
  {
    id: "doodle",
    title: "Doodle — Sketchbook",
    description: "Kad sketsa tangan, kertas bergaris, dan suasana playful.",
    path: "/doodle",
    category: "jemputan",
    previewImage: publicUrl("demo/doodle.png"),
    posterHasCopy: true,
    showOnDemo: true,
    tags: ["Doodle", "RSVP"],
  },
  {
    id: "doodle-pastel",
    title: "Doodle — Pastel",
    description: "Tema doodle lembut dengan blush, mint, dan tulisan tangan.",
    path: "/doodle-pastel",
    category: "jemputan",
    previewImage: publicUrl("demo/doodle.png"),
    posterHasCopy: true,
    showOnDemo: false,
    tags: ["Doodle", "Pastel"],
  },
  {
    id: "travellers",
    title: "Travellers — Boarding Pass",
    description: "Tema travel dengan boarding pass, flight path, backpack & passport stamps.",
    path: "/travellers",
    category: "jemputan",
    previewGradient: "linear-gradient(155deg, #d7e7f2 0%, #f3efe6 48%, #1c2f4a 100%)",
    showOnDemo: false,
    tags: ["Travel", "RSVP"],
  },
  {
    id: "cafe",
    title: "Café — Today's Special",
    description: "Menu café, steam, dan suasana date-night — RSVP & countdown.",
    path: "/cafe",
    category: "jemputan",
    previewGradient: "linear-gradient(155deg, #d9e2d8 0%, #f4efe6 48%, #1f1410 100%)",
    showOnDemo: false,
    tags: ["Cafe", "RSVP"],
  },
  {
    id: "malay-classic",
    title: "Malay Classic — Gold",
    description: "Foto penuh, aksen emas, floral lembut — jemputan Melayu klasik.",
    path: "/malay-classic",
    category: "jemputan",
    previewGradient: "linear-gradient(155deg, #f0e2c0 0%, #efe6d6 42%, #2c241c 100%)",
    showOnDemo: false,
    tags: ["Classic", "Gold", "RSVP"],
  },
  {
    id: "maroon-gold",
    title: "Maroon & Gold (Bingkai)",
    description: "Jemputan berbingkai dengan tema maroon diraja dan emas.",
    path: "/jemputan-frame-maroon",
    category: "jemputan",
    previewImage: publicUrl("wedding-invitation/1.png"),
    tags: ["Animasi", "RSVP"],
  },
  {
    id: "frame",
    title: "Jemputan Bingkai",
    description: "Animasi pembuka berbingkai, kemudian kandungan jemputan penuh.",
    path: "/jemputan-frame",
    category: "jemputan",
    previewImage: publicUrl("wedding-invitation/1.png"),
  },
  {
    id: "royal-maroon",
    title: "Maroon Diraja",
    description: "Templat luxury maroon dengan tipografi elegan.",
    path: "/jemputan-maroon-diraja",
    category: "jemputan",
    previewGradient: "linear-gradient(145deg, #3a0c14 0%, #5c101c 45%, #b0893a 100%)",
  },
  {
    id: "demo-gold",
    title: "Demo Gold",
    description: "Preview tema gold dengan nama contoh (Nama & Nama).",
    path: "/demo-gold",
    category: "jemputan",
    previewImage: publicUrl("wedding-invitation/1 gold.png"),
    tags: ["Demo"],
  },
  {
    id: "kad-ucapan",
    title: "Kad Ucapan",
    description: "Aliran sampul, tarik surat, ucapan taip, dan kejutan.",
    path: "/kad-ucapan",
    category: "ucapan",
    previewGradient: "linear-gradient(160deg, #f6efe4 0%, #d4b896 55%, #5c101c 100%)",
  },
  {
    id: "congrats",
    title: "Congratulation Card",
    description: "Kad ucapan tahniah ringkas untuk pengantin baru.",
    path: "/ucapan",
    category: "ucapan",
    previewGradient: "linear-gradient(160deg, #fff8f0 0%, #e8d5c4 100%)",
  },
  {
    id: "party",
    title: "Party Congrats",
    description: "Kad ucapan dengan tema neon dan aliran kejutan.",
    path: "/ucapan-party",
    category: "ucapan",
    previewImage: encodeURI(publicUrl("assets/party!/2.png")),
    tags: ["Neon"],
  },
  {
    id: "scratch",
    title: "Kad Gosok",
    description: "Gosok untuk membuka ucapan rahsia — tiada imej luaran diperlukan.",
    path: "/kad-gosok",
    category: "interaktif",
    previewGradient: "linear-gradient(145deg, #c9a962 0%, #f6efe4 50%, #5c101c 100%)",
  },
  {
    id: "wheel",
    title: "Roda Doa",
    description: "Pusing roda berkat — ucapan mengikut segmen terpilih.",
    path: "/roda-doa",
    category: "interaktif",
    previewGradient: "linear-gradient(160deg, #f6efe4 0%, #7a1828 100%)",
  },
  {
    id: "egg",
    title: "Kad Telur Tahniah",
    description: "Pecahkan telur untuk membuka ucapan dan kejutan.",
    path: "/kad-wedding-badar",
    category: "interaktif",
    previewImage: publicUrl("assets/cartoon-newlywed1.png"),
  },
  {
    id: "egg-pastel",
    title: "Kad Telur (Pastel)",
    description: "Versi pastel lembut dengan animasi yang sama.",
    path: "/kad-wedding-badar-pastel",
    category: "interaktif",
    previewGradient: "linear-gradient(160deg, #fceef5 0%, #e8d4f0 55%, #f6efe4 100%)",
  },
];
