import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeCheck,
  Banknote,
  FileCheck2,
  Landmark,
  LayoutDashboard,
  LineChart,
  Lock,
  Milestone,
  ScrollText,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Wheat,
} from "lucide-react";

/**
 * All page copy and data lives here as typed constants so sections stay
 * presentational and the words are easy to review in one place.
 */

export type TrustCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const trustCards: TrustCard[] = [
  {
    icon: Lock,
    title: "Escrow-backed funding",
    description:
      "Investor funds sit with a licensed trustee, not with SmileAgrimarket. The trustee releases money once the conditions are met.",
  },
  {
    icon: BadgeCheck,
    title: "Verified farm operators",
    description:
      "Every operator is screened for identity, land rights, and track record before a project is listed.",
  },
  {
    icon: Milestone,
    title: "Milestone-based disbursement",
    description:
      "The trustee releases capital in stages that track real farm progress: land prep, planting, maintenance, harvest.",
  },
  {
    icon: LineChart,
    title: "Transparent reporting",
    description:
      "Follow each project through a shared dashboard with updates, photos, and a full record of every disbursement.",
  },
];

export type Step = {
  number: string;
  title: string;
  description: string;
};

export const steps: Step[] = [
  {
    number: "01",
    title: "Browse verified farms",
    description:
      "Review vetted projects with their operator profile, funding target, timeline, and documented risk factors.",
  },
  {
    number: "02",
    title: "Fund through escrow",
    description:
      "Commit to a project. Your funds are held by a licensed trustee partner until milestone conditions are met.",
  },
  {
    number: "03",
    title: "Track farm milestones",
    description:
      "Watch progress in real time. Each disbursement releases as the operator clears a verified stage.",
  },
  {
    number: "04",
    title: "Receive payouts after harvest",
    description:
      "Proceeds are reconciled and distributed through the same trustee once the harvest is sold and settled.",
  },
];

export type Audience = {
  id: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  ctaLabel: string;
};

export const audiences: Audience[] = [
  {
    id: "for-investors",
    eyebrow: "For investors",
    icon: TrendingUp,
    title: "Put capital into farms you can watch",
    description:
      "Back vetted farm projects with clear timelines and documented risk. Follow every naira from escrow to harvest.",
    benefits: [
      "Escrow-held funds released against verified milestones",
      "Project-level dashboard with progress and disbursement history",
      "Documented risk factors before you commit",
      "Payouts reconciled and distributed by a licensed trustee",
    ],
    ctaLabel: "Invest with confidence",
  },
  {
    id: "for-farmers",
    eyebrow: "For farm operators",
    icon: Sprout,
    title: "Fund your next cycle without losing control of your farm",
    description:
      "Reach vetted investors and draw capital in stages as you deliver. Each cycle builds a track record for the next one.",
    benefits: [
      "Structured, milestone-based capital for each growing cycle",
      "A verified profile that builds your funding history",
      "Light reporting tools built for the field",
      "Settlement handled through regulated partners",
    ],
    ctaLabel: "Apply as an operator",
  },
];

export type ComparisonRow = {
  criterion: string;
  agrimarket: boolean;
  traditional: boolean;
  note: string;
};

export const comparisonRows: ComparisonRow[] = [
  { criterion: "Transparency", agrimarket: true, traditional: false, note: "Shared project record, visible to investors" },
  { criterion: "Escrow", agrimarket: true, traditional: false, note: "Funds held by a licensed trustee" },
  { criterion: "Milestones", agrimarket: true, traditional: false, note: "Capital released against verified stages" },
  { criterion: "Progress tracking", agrimarket: true, traditional: false, note: "Real-time updates from the field" },
  { criterion: "Risk visibility", agrimarket: true, traditional: false, note: "Documented before you commit" },
  { criterion: "Investor dashboard", agrimarket: true, traditional: false, note: "One place for every project you back" },
];

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    icon: Lock,
    title: "Escrow protection",
    description:
      "A licensed trustee holds the funds and releases them when milestone conditions are met. The platform never touches your money.",
  },
  {
    icon: BadgeCheck,
    title: "Farm verification",
    description:
      "We check identity, land rights, and operator history before we list any project for funding.",
  },
  {
    icon: Activity,
    title: "Real-time updates",
    description:
      "Field updates, photos, and status changes land in your dashboard as each project moves forward.",
  },
  {
    icon: Milestone,
    title: "Milestone releases",
    description:
      "Capital releases in stages as the operator hits verified progress. Funding stays tied to delivery.",
  },
  {
    icon: LayoutDashboard,
    title: "Performance dashboard",
    description:
      "Track funding, disbursements, and harvest status across every project you back in one view.",
  },
  {
    icon: ScrollText,
    title: "Compliance ready",
    description:
      "Built to work alongside licensed financial, payment, and trustee partners under Nigerian data rules.",
  },
];

export type ComplianceBadge = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const complianceBadges: ComplianceBadge[] = [
  {
    icon: Landmark,
    title: "Licensed partners",
    description: "Regulated financial and trustee partners manage the funds.",
  },
  {
    icon: ShieldCheck,
    title: "NDPR ready",
    description: "Data handling built to align with Nigeria's data protection rules.",
  },
  {
    icon: Lock,
    title: "Escrow enabled",
    description: "Milestone-based disbursement through a licensed escrow structure.",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I've wanted exposure to farming back home for years, but never trusted the informal channels. Seeing funds held in escrow and released against milestones is what made me comfortable joining the beta.",
    name: "Adaeze O.",
    role: "Diaspora investor, London",
    initials: "AO",
  },
  {
    quote:
      "The milestone structure matches how a farm works. I get working capital when I need it, and each cycle builds my delivery record.",
    name: "Ibrahim S.",
    role: "Commercial maize operator, Kaduna",
    initials: "IS",
  },
  {
    quote:
      "The honesty about risk won me over. Nobody dresses up the numbers as guaranteed. That's why I signed up early.",
    name: "Tunde A.",
    role: "Agribusiness operator, Ibadan",
    initials: "TA",
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: "How does SmileAgrimarket work?",
    answer:
      "We list farm projects from vetted operators. Investors fund a project, and the capital is held by a licensed trustee in escrow. Funds are released to the operator in stages as they reach verified milestones, and proceeds are distributed back through the same trustee after harvest.",
  },
  {
    question: "How are funds protected?",
    answer:
      "SmileAgrimarket never holds your money. A licensed trustee holds funds in escrow and releases them when milestone conditions are met. We record every disbursement and show it to the investors backing that project.",
  },
  {
    question: "Who can invest?",
    answer:
      "During the private beta, access is limited and onboarded in stages. We expect to open first to Nigerian residents and members of the diaspora who complete identity verification. Availability depends on the requirements of our regulated partners.",
  },
  {
    question: "When do returns get paid?",
    answer:
      "Proceeds are reconciled after the harvest is sold and settled, then distributed through the trustee. Timelines vary by crop and project and are shown on each listing. Investments carry risk and returns are not guaranteed.",
  },
  {
    question: "Is SmileAgrimarket live?",
    answer:
      "We are in private beta. Joining the waitlist reserves early access and helps us onboard investors and operators in a controlled, compliant way. We will contact you as places open.",
  },
];

/** Small stat set used under the hero for quiet, credible reassurance. */
export type HeroStat = { value: string; label: string; icon: LucideIcon };

export const heroStats: HeroStat[] = [
  { value: "100%", label: "Funds held in escrow", icon: Lock },
  { value: "4", label: "Milestone release stages", icon: Milestone },
  { value: "0", label: "Naira held by the platform", icon: Banknote },
];

/** Dashboard mock data — the hero signature. */
export const dashboardProject = {
  name: "Kaduna Maize · Cycle 14",
  operator: "Verified operator · SA-2291",
  fundingRaised: 18_400_000,
  fundingTarget: 24_000_000,
  progressPercent: 77,
  escrowBalance: 6_200_000,
  harvestWindow: "Nov 2026",
  milestones: [
    { label: "Land preparation", state: "released" as const, amount: "₦ 4.8M" },
    { label: "Planting", state: "released" as const, amount: "₦ 6.4M" },
    { label: "Maintenance", state: "active" as const, amount: "₦ 7.2M" },
    { label: "Harvest & settlement", state: "upcoming" as const, amount: "₦ 5.6M" },
  ],
  ledger: [
    { icon: FileCheck2, label: "Planting milestone verified", meta: "Disbursed · Jun 2026" },
    { icon: ShieldCheck, label: "Escrow balance confirmed", meta: "Trustee · SA-Trust" },
    { icon: Wheat, label: "Maintenance underway", meta: "On schedule" },
  ],
};
