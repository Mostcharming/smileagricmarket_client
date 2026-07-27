import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Monospace uppercase label — the recurring "verifiable data" signature.
 * The small leaf dash reads like a ledger marker, not decoration.
 */
export function Eyebrow({
  children,
  className,
  tone = "leaf",
}: {
  children: ReactNode;
  className?: string;
  tone?: "leaf" | "muted" | "onDark";
}) {
  const color =
    tone === "onDark"
      ? "text-leaf"
      : tone === "muted"
        ? "text-muted-foreground"
        : "text-leaf-600";

  return (
    <span className={cn("eyebrow", color, className)}>
      <span aria-hidden className="h-px w-5 bg-current opacity-60" />
      {children}
    </span>
  );
}

/**
 * Section heading block — eyebrow + title + optional lead paragraph,
 * with a consistent max width and rhythm across every section.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "default",
  id,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "default" | "onDark";
  id?: string;
  className?: string;
}) {
  const onDark = tone === "onDark";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "max-w-2xl",
        className,
      )}
    >
      <Eyebrow tone={onDark ? "onDark" : "leaf"}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={cn(
          "text-balance text-3xl font-semibold leading-[1.08] sm:text-4xl lg:text-[2.75rem]",
          onDark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "text-pretty text-base leading-relaxed sm:text-lg",
            onDark ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
