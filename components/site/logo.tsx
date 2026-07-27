import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label={`${siteConfig.name} logo`}
    >
      <rect width="40" height="40" rx="11" fill="#28421b" />
      {/* Two leaves meeting over a stem — growth that also reads as a smile */}
      <path
        d="M20 21.5C18 14.5 13 11 8.8 12C9.8 18.2 14 22.2 20 21.5Z"
        fill="#6FC346"
      />
      <path
        d="M20 21.5C22 14.5 27 11 31.2 12C30.2 18.2 26 22.2 20 21.5Z"
        fill="#8ad86a"
      />
      <path
        d="M20 21.2V30.5"
        stroke="#6FC346"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20.8" r="1.7" fill="#E7C80C" />
    </svg>
  );
}

export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn(
          "font-heading text-lg font-semibold tracking-tight",
          onDark ? "text-white" : "text-ink",
        )}
      >
        {siteConfig.name}
      </span>
    </span>
  );
}
