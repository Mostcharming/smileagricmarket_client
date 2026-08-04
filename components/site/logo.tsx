import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { LogoIcon } from "@/components/icons";

export function LogoMark({ className }: { className?: string }) {
  return (
    <LogoIcon className={cn("h-9 w-9", className)} />
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
