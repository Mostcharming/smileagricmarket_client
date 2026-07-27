import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "haze" | "mint" | "forest";

const toneStyles: Record<Tone, string> = {
  default: "bg-background text-foreground",
  haze: "bg-haze text-foreground",
  mint: "bg-mint text-white",
  forest: "bg-forest text-white",
};

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: Tone;
  /** Vertical rhythm — tuned to a Stripe/Linear cadence. */
  spacing?: "default" | "compact" | "loose";
  as?: "section" | "footer" | "div";
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

const spacingStyles = {
  compact: "py-12 sm:py-16",
  default: "py-16 sm:py-24 lg:py-28",
  loose: "py-20 sm:py-28 lg:py-36",
};

export function Section({
  id,
  children,
  className,
  tone = "default",
  spacing = "default",
  as: Tag = "section",
  ...aria
}: SectionProps) {
  return (
    <Tag id={id} className={cn(toneStyles[tone], spacingStyles[spacing], className)} {...aria}>
      <div className="container-page">{children}</div>
    </Tag>
  );
}
