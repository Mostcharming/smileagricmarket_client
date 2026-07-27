"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Lock, ShieldCheck, Sprout, Wheat } from "lucide-react";
import { dashboardProject } from "@/lib/content";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Count a value up from zero once, unless motion is reduced. */
function useCountUp(target: number, enabled: boolean, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, enabled, duration]);

  // When motion is reduced, show the final figure without animating.
  return enabled ? value : target;
}

// Narrow no-break space after ₦ — JetBrains Mono has no naira glyph, so it
// falls back to a wider one; the gap keeps it from touching the figure.
const millions = (n: number) => `₦ ${(n / 1_000_000).toFixed(1)}M`;

const milestoneShort: Record<string, string> = {
  "Land preparation": "Land preparation",
  Planting: "Planting",
  Maintenance: "Maintenance",
  "Harvest & settlement": "Harvest & settlement",
};

export function HeroDashboard() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;
  const p = dashboardProject;

  const raised = useCountUp(p.fundingRaised, animate);
  const percent = useCountUp(p.progressPercent, animate, 1400);

  return (
    <div className="relative">
      {/* Floating confirmation chip — depth, and a real status message */}
      <motion.div
        initial={animate ? { opacity: 0, y: 10, scale: 0.96 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.9 }}
        className="absolute -left-4 top-16 z-20 hidden items-center gap-2.5 rounded-xl border border-border bg-background/95 px-3.5 py-2.5 shadow-[var(--shadow-lift)] backdrop-blur sm:flex"
      >
        <span className="flex size-7 items-center justify-center rounded-lg bg-mint text-leaf">
          <Check className="size-4" />
        </span>
        <span className="text-xs leading-tight">
          <span className="block font-medium text-ink">Disbursement released</span>
          <span className="block font-mono text-[0.7rem] text-muted-foreground">
            Planting · ₦ 6.4M
          </span>
        </span>
      </motion.div>

      {/* Main dashboard card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-lift)] sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-forest text-leaf">
              <Sprout className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{p.name}</p>
              <p className="flex items-center gap-1.5 font-mono text-[0.7rem] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-leaf-600" />
                {p.operator}
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-mint px-2.5 py-1 text-[0.7rem] font-medium text-leaf">
            <span className="relative flex size-1.5">
              {animate ? (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf-600 opacity-75" />
              ) : null}
              <span className="relative inline-flex size-1.5 rounded-full bg-leaf-600" />
            </span>
            Escrow verified
          </span>
        </div>

        {/* Funding progress */}
        <div className="mt-6 rounded-2xl bg-secondary/70 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
              Funding progress
            </span>
            <span className="font-mono text-xs font-medium text-forest-600">
              {Math.round(percent)}% funded
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold text-ink sm:text-[1.7rem]">
              {millions(raised)}
            </span>
            <span className="font-mono text-sm text-muted-foreground">
              / {millions(p.fundingTarget)} target
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-leaf-600 to-leaf"
              initial={{ width: animate ? "0%" : `${p.progressPercent}%` }}
              animate={{ width: `${p.progressPercent}%` }}
              transition={{ duration: 1.4, ease: EASE }}
            />
          </div>
        </div>

        {/* Stat tiles */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatTile
            icon={<Lock className="size-4" />}
            label="Escrow balance"
            value={millions(p.escrowBalance)}
          />
          <StatTile
            icon={<Wheat className="size-4 text-harvest" />}
            label="Harvest window"
            value={p.harvestWindow}
          />
        </div>

        {/* Milestone timeline */}
        <div className="mt-5">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
            Milestone releases
          </p>
          <ul className="mt-3 space-y-0">
            {p.milestones.map((m, i) => {
              const isLast = i === p.milestones.length - 1;
              return (
                <li key={m.label} className="relative flex gap-3 pb-3.5 last:pb-0">
                  {!isLast ? (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px",
                        m.state === "released" ? "bg-leaf-600/60" : "bg-border",
                      )}
                    />
                  ) : null}
                  <MilestoneNode state={m.state} animate={animate} />
                  <div className="flex flex-1 items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {milestoneShort[m.label] ?? m.label}
                      </p>
                      <p className="font-mono text-[0.7rem] capitalize text-muted-foreground">
                        {m.state === "active" ? "In progress" : m.state}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "font-mono text-xs",
                        m.state === "upcoming" ? "text-muted-foreground" : "text-forest",
                      )}
                    >
                      {m.amount}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[0.7rem] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1.5 font-mono text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

function MilestoneNode({
  state,
  animate,
}: {
  state: "released" | "active" | "upcoming";
  animate: boolean;
}) {
  if (state === "released") {
    return (
      <span className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-white">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-forest bg-background">
        <span className="relative flex size-2.5">
          {animate ? (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf-600 opacity-75" />
          ) : null}
          <span className="relative inline-flex size-2.5 rounded-full bg-forest" />
        </span>
      </span>
    );
  }
  return (
    <span className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background">
      <span className="size-2 rounded-full bg-border" />
    </span>
  );
}
