"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/agri-button";
import { siteConfig } from "@/lib/site";

/**
 * Sticky CTA shown on small screens after the hero scrolls away, and hidden
 * again once the user reaches the waitlist section so it never doubles up.
 */
export function MobileStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [atJoin, setAtJoin] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = document.getElementById("join");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setAtJoin(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !atJoin;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: reduceMotion ? 0 : 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduceMotion ? 0 : 80, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
        >
          <div className="border-t border-border bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0 text-leaf-600" />
                <span className="truncate">Escrow-backed · Private beta</span>
              </p>
              <ButtonLink
                variant="cta"
                size="lg"
                className="ml-auto h-11 shrink-0 whitespace-nowrap rounded-lg px-5"
                href={siteConfig.cta.href}
              >
                Join beta
              </ButtonLink>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
