import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";

/**
 * Thin top bar announcing the beta. Kept static (no dismiss) so it never
 * shifts layout, and links straight to the waitlist form.
 */
export function AnnouncementBar() {
  return (
    <div className="relative z-50 bg-forest text-white">
      <div className="container-page flex items-center justify-center gap-x-3 gap-y-1 py-2.5 text-center text-[0.8rem] sm:text-sm">
        <span className="inline-flex items-center gap-2 font-medium">
          <span
            aria-hidden
            className="inline-block size-1.5 rounded-full bg-leaf shadow-[0_0_0_3px_rgba(111,195,70,0.25)]"
          />
          Private Beta is now open.
        </span>
        <a
          href={siteConfig.cta.href}
          className="group inline-flex items-center gap-1 font-medium text-leaf underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
        >
          Join waitlist
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
