/**
 * Central site configuration — name, URLs, navigation, and the single
 * primary call-to-action reused everywhere so the vocabulary stays consistent.
 */

export const siteConfig = {
  name: "SmileAgrimarket",
  shortName: "Agrimarket",
  domain: "smileagrimarket.com",
  url: "https://smileagrimarket.com",
  email: "hello@smileagrimarket.com",
  country: "Nigeria",
  tagline: "Invest in real farms with transparency you can verify.",
  description:
    "SmileAgrimarket connects investors with vetted farm projects through escrow-backed, milestone-based funding built for transparency and accountability.",
  // The single primary action, worded identically across the page.
  cta: {
    label: "Join Private Beta",
    href: "#join",
  },
  secondaryCta: {
    label: "Learn More",
    href: "#how-it-works",
  },
} as const;

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "For investors", href: "#for-investors" },
  { label: "For farmers", href: "#for-farmers" },
  { label: "FAQ", href: "#faq" },
];
