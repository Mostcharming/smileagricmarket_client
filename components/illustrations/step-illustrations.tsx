/**
 * Hand-drawn cartoon illustrations for the four "funding to harvest" steps.
 * Style follows the client's reference: loose dark-green outlines, flat
 * light-green fills, halftone dot shading, and a harvest-gold accent.
 */

const OUTLINE = "#3d5522";
const LEAF = "#bfe08a";
const LEAF_DEEP = "#8fbb56";
const MINT = "#e4f6cf";
const GOLD = "#e7c80c";

type IllustrationProps = { className?: string };

/** Shared halftone dot pattern — id must be unique per illustration. */
function Halftone({ id }: { id: string }) {
  return (
    <pattern id={id} width="7" height="7" patternUnits="userSpaceOnUse">
      <circle cx="1.6" cy="1.6" r="1.15" fill={OUTLINE} opacity="0.16" />
    </pattern>
  );
}

const strokeProps = {
  fill: "none",
  stroke: OUTLINE,
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** 01 — Browse verified farms: a magnifying glass over a small farm plot. */
function BrowseFarms({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 220 170" className={className} role="img" aria-label="Browsing verified farms">
      <defs>
        <Halftone id="ht-browse" />
      </defs>
      {/* field */}
      <path d="M18 128 Q70 112 118 120 T204 122 L204 150 L18 150 Z" fill={LEAF} stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      <path d="M18 128 Q70 112 118 120 T204 122 L204 150 L18 150 Z" fill="url(#ht-browse)" />
      {/* crop rows */}
      <g {...strokeProps} strokeWidth={2.4}>
        <path d="M48 150 L44 132" />
        <path d="M78 150 L76 129" />
        <path d="M150 150 L154 127" />
        <path d="M180 150 L186 128" />
      </g>
      {/* little barn */}
      <g>
        <path d="M46 122 L46 96 L84 96 L84 122 Z" fill={MINT} stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
        <path d="M42 96 L65 82 L88 96 Z" fill={LEAF_DEEP} stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
        <path d="M60 122 L60 108 L72 108 L72 122" {...strokeProps} strokeWidth={2.6} />
      </g>
      {/* sprout */}
      <g {...strokeProps}>
        <path d="M162 124 L162 108" />
        <path d="M162 112 Q150 108 148 98 Q160 98 162 110" fill={LEAF_DEEP} stroke={OUTLINE} />
        <path d="M162 112 Q174 108 176 98 Q164 98 162 110" fill={LEAF_DEEP} stroke={OUTLINE} />
      </g>
      {/* magnifying glass */}
      <circle cx="118" cy="76" r="38" fill="#ffffff" fillOpacity="0.65" stroke={OUTLINE} strokeWidth={4.5} />
      <circle cx="118" cy="76" r="38" fill="url(#ht-browse)" opacity="0.5" />
      <path d="M146 104 L172 132" stroke={OUTLINE} strokeWidth={8} strokeLinecap="round" />
      {/* verified badge */}
      <g transform="translate(176 40)">
        <path d="M0 -13 L4 -9 L9 -10 L9 -4 L14 0 L9 4 L9 10 L4 9 L0 13 L-4 9 L-9 10 L-9 4 L-14 0 L-9 -4 L-9 -10 L-4 -9 Z" fill={GOLD} stroke={OUTLINE} strokeWidth={2.4} strokeLinejoin="round" />
        <path d="M-5 0 L-1 4 L6 -4" {...strokeProps} strokeWidth={2.6} />
      </g>
    </svg>
  );
}

/** 02 — Fund through escrow: a shield protecting coins, funds flowing in. */
function FundEscrow({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 220 170" className={className} role="img" aria-label="Funding through escrow">
      <defs>
        <Halftone id="ht-fund" />
      </defs>
      {/* incoming coin + arrow */}
      <g transform="translate(48 40)">
        <circle cx="0" cy="0" r="15" fill={GOLD} stroke={OUTLINE} strokeWidth={3} />
        <text x="0" y="6" textAnchor="middle" fontSize="17" fontFamily="ui-sans-serif, system-ui" fontWeight="700" fill={OUTLINE}>₦</text>
      </g>
      <path d="M66 52 Q92 62 100 78" {...strokeProps} strokeDasharray="2 7" strokeWidth={3} />
      <path d="M100 78 l-8 -3 M100 78 l-2 -8" {...strokeProps} />
      {/* shield */}
      <path d="M132 30 L176 46 V92 Q176 128 132 146 Q88 128 88 92 V46 Z" fill={LEAF} stroke={OUTLINE} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M132 30 L176 46 V92 Q176 128 132 146 Q132 30 132 30 Z" fill="url(#ht-fund)" />
      {/* padlock inside shield */}
      <g transform="translate(132 82)">
        <path d="M-10 -6 A10 10 0 0 1 10 -6" {...strokeProps} strokeWidth={3} />
        <rect x="-15" y="-6" width="30" height="26" rx="5" fill={MINT} stroke={OUTLINE} strokeWidth={3} />
        <circle cx="0" cy="4" r="3.5" fill={OUTLINE} />
        <path d="M0 4 L0 12" {...strokeProps} strokeWidth={3} />
      </g>
    </svg>
  );
}

/** 03 — Track farm milestones: a plant growing past checkpoint markers. */
function TrackMilestones({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 220 170" className={className} role="img" aria-label="Tracking farm milestones">
      <defs>
        <Halftone id="ht-track" />
      </defs>
      {/* ground mound */}
      <path d="M20 138 Q70 120 110 128 T200 130 L200 150 L20 150 Z" fill={LEAF} stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      <path d="M20 138 Q70 120 110 128 T200 130 L200 150 L20 150 Z" fill="url(#ht-track)" />
      {/* growing plant */}
      <path d="M58 132 Q56 96 66 74 Q72 60 68 44" {...strokeProps} strokeWidth={3.5} />
      <path d="M62 96 Q44 92 40 78 Q58 76 64 92" fill={LEAF_DEEP} stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      <path d="M64 78 Q82 72 88 58 Q70 56 63 74" fill={LEAF_DEEP} stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      <path d="M68 46 Q60 34 66 24 Q76 32 70 46" fill={LEAF} stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      {/* dotted milestone path */}
      <path d="M96 130 Q140 120 150 82 Q156 56 190 46" {...strokeProps} strokeDasharray="1 9" strokeWidth={3} />
      {/* checkpoints */}
      {[
        { x: 112, y: 122, done: true },
        { x: 150, y: 92, done: true },
        { x: 186, y: 48, done: false },
      ].map((c, i) => (
        <g key={i} transform={`translate(${c.x} ${c.y})`}>
          <circle cx="0" cy="0" r="12" fill={c.done ? GOLD : MINT} stroke={OUTLINE} strokeWidth={3} />
          {c.done ? (
            <path d="M-5 0 L-1 4 L6 -5" {...strokeProps} strokeWidth={2.8} />
          ) : (
            <circle cx="0" cy="0" r="3.2" fill={OUTLINE} />
          )}
        </g>
      ))}
    </svg>
  );
}

/** 04 — Receive payouts after harvest: a harvest basket turning into coins. */
function ReceivePayout({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 220 170" className={className} role="img" aria-label="Receiving payouts after harvest">
      <defs>
        <Halftone id="ht-payout" />
      </defs>
      {/* wheat stalks */}
      <g {...strokeProps} strokeWidth={3}>
        <path d="M96 92 Q92 66 100 44" />
        <path d="M100 60 Q90 56 88 48 Q98 48 101 58" fill={LEAF_DEEP} stroke={OUTLINE} />
        <path d="M100 60 Q110 56 112 48 Q102 48 99 58" fill={LEAF_DEEP} stroke={OUTLINE} />
        <path d="M100 74 Q90 70 88 62 Q98 62 101 72" fill={LEAF_DEEP} stroke={OUTLINE} />
        <path d="M100 74 Q110 70 112 62 Q102 62 99 72" fill={LEAF_DEEP} stroke={OUTLINE} />
      </g>
      {/* falling coins */}
      <g transform="translate(150 52)">
        <circle cx="0" cy="0" r="15" fill={GOLD} stroke={OUTLINE} strokeWidth={3} />
        <text x="0" y="6" textAnchor="middle" fontSize="17" fontFamily="ui-sans-serif, system-ui" fontWeight="700" fill={OUTLINE}>₦</text>
      </g>
      <g transform="translate(132 84)">
        <ellipse cx="0" cy="0" rx="15" ry="7" fill={GOLD} stroke={OUTLINE} strokeWidth={3} />
      </g>
      {/* basket */}
      <path d="M64 100 L156 100 L146 142 Q110 152 74 142 Z" fill={LEAF} stroke={OUTLINE} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M64 100 L156 100 L146 142 Q110 152 74 142 Z" fill="url(#ht-payout)" />
      <g {...strokeProps} strokeWidth={2.6}>
        <path d="M92 104 L86 140" />
        <path d="M110 105 L110 144" />
        <path d="M128 104 L134 140" />
      </g>
      <ellipse cx="110" cy="100" rx="48" ry="11" fill={MINT} stroke={OUTLINE} strokeWidth={3.5} />
    </svg>
  );
}

const illustrations = [BrowseFarms, FundEscrow, TrackMilestones, ReceivePayout];

export function StepIllustration({ index, className }: { index: number; className?: string }) {
  const Ill = illustrations[index] ?? BrowseFarms;
  return <Ill className={className} />;
}
