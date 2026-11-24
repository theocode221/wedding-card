export type LailaWish = {
  id: string;
  title: string;
  description?: string;
  category: string;
  priceHint?: string;
  link?: string;
  /** Product photo — paste from the store page; the URL alone does not auto-load images. */
  imageUrl?: string;
  qty: number;
  grantedCount: number;
};

/** Sample wishes for UI preview — replace with Google Sheet data later. */
export const LAILA_WISHES_DEMO: readonly LailaWish[] = [
  {
    id: "w001",
    title: "Clothes drying rack",
    description: "Sturdy rack for laundry — neutral tone preferred.",
    category: "Home",
    priceHint: "~ RM 66",
    qty: 1,
    grantedCount: 0,
  },
  {
    id: "w002",
    title: "Wooden towel rack",
    description: "Wall or floor stand for bathroom towels.",
    category: "Home",
    priceHint: "~ RM 45",
    qty: 2,
    grantedCount: 1,
  },
  {
    id: "w003",
    title: "Spice rack",
    category: "Kitchen",
    priceHint: "~ RM 40",
    qty: 1,
    grantedCount: 1,
  },
  {
    id: "w004",
    title: "Vacuum-insulated teapot",
    category: "Kitchen",
    priceHint: "~ RM 70",
    qty: 1,
    grantedCount: 1,
  },
  {
    id: "w005",
    title: "Stand fan",
    description: "Quiet model for the living area.",
    category: "Living",
    priceHint: "~ RM 100",
    qty: 1,
    grantedCount: 0,
  },
  {
    id: "w006",
    title: "Ergonomic office chair",
    category: "Living",
    priceHint: "~ RM 125",
    qty: 1,
    grantedCount: 0,
  },
  {
    id: "w007",
    title: "",
    description: "",
    category: "Kitchen",
    link: "https://www.ikea.com/my/en/p/ikea-365-food-container-with-lid-rectangular-glass-70623830/",
    qty: 1,
    grantedCount: 0,
  },
  {
    id: "w008",
    title: "IKEA gift card",
    description: "Any amount — we can choose pieces together.",
    category: "Flexible",
    qty: 1,
    grantedCount: 1,
  },
];