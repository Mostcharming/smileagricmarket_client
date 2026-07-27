import { Lock, Milestone, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { Reveal } from "@/components/primitives/reveal";
import { WaitlistForm } from "@/components/site/waitlist-form";

const assurances = [
  { icon: Lock, label: "Escrow-backed" },
  { icon: Milestone, label: "Milestone releases" },
  { icon: ShieldCheck, label: "Licensed partners" },
];

export function FinalCta() {
  return (
    <section
      id="join"
      aria-labelledby="join-heading"
      className="relative overflow-hidden bg-forest py-16 text-white sm:py-24 lg:py-28"
    >
      <div aria-hidden className="absolute inset-0 bg-forest-grid opacity-50" />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-leaf/15 blur-3xl"
      />
      <div className="container-page relative">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <Reveal>
            <div>
              <Eyebrow tone="onDark">Join the private beta</Eyebrow>
              <h2
                id="join-heading"
                className="mt-5 text-balance text-3xl font-semibold leading-[1.08] text-white sm:text-4xl lg:text-[2.75rem]"
              >
                Invest in farming you can track.
              </h2>
              <p className="mt-5 max-w-md text-pretty text-white/70">
                Reserve early access. We onboard investors and operators in small, verified
                groups so we can vet every project with care.
              </p>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {assurances.map((item) => (
                  <li key={item.label} className="flex items-center gap-2 text-sm text-white/80">
                    <item.icon className="size-4 text-leaf" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-lift)] sm:p-8">
              <WaitlistForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
