"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sprout, X } from "lucide-react";
import { WaitlistForm } from "@/components/site/waitlist-form";

const DELAY_MS = 5_000;

/**
 * "Join the private beta" modal that auto-opens 5 seconds after the visitor
 * lands, while they scroll. Dismissible via the close button, backdrop, or Esc;
 * background scroll is locked while it's open.
 */
export function BetaPopup() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Open once, 5 seconds after the page loads.
  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Lock scroll + wire Esc-to-close while open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="beta-popup-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-lift)] outline-none sm:p-8"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
            >
              <X className="size-5" />
            </button>

            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-mint text-leaf">
              <Sprout className="size-6" />
            </span>
            <h2
              id="beta-popup-title"
              className="mt-4 text-2xl font-semibold leading-tight text-ink"
            >
              Join the private beta
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We onboard investors and operators in small, verified groups. Reserve your
              early access in under a minute.
            </p>

            <div className="mt-6">
              <WaitlistForm />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
