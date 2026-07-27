import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/agri-button";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { Reveal } from "@/components/primitives/reveal";
import { HeroDashboard } from "@/components/dashboard/hero-dashboard";
import { heroStats } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Field backdrop */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/images/aerial-tractor.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Keep copy readable: flatter wash on mobile, gradient depth on desktop */}
        <div className="absolute inset-0 bg-haze/80 lg:hidden" />
        <div className="absolute inset-0 hidden bg-linear-to-r from-haze via-haze/85 to-haze/45 lg:block" />
        <div className="absolute inset-0 bg-field-glow" />
      </div>

      <div className="relative container-page grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-10 lg:py-28">
        {/* Copy */}
        <div className="max-w-xl">
          <Reveal>
            <Eyebrow>Private beta · Nigeria</Eyebrow>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-[3.5rem]">
              Invest in real farms. Fund growth.{" "}
              <span className="text-forest-600">Track every naira.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {siteConfig.name} connects investors with vetted farm projects through
              escrow-backed, milestone-based funding. You follow every naira from the day
              you commit it to the day the harvest sells.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink variant="cta" size="xl" href={siteConfig.cta.href}>
                {siteConfig.cta.label}
                <ArrowRight data-icon="inline-end" className="size-4" />
              </ButtonLink>
              <ButtonLink variant="surface" size="xl" href={siteConfig.secondaryCta.href}>
                {siteConfig.secondaryCta.label}
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-leaf-600" />
              Escrow-backed. Investments carry risk and returns are not guaranteed.
            </p>
          </Reveal>

          {/* Quiet, credible stat row */}
          <Reveal delay={0.25}>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-mono text-2xl font-semibold text-ink">{stat.value}</dd>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Signature dashboard */}
        <Reveal delay={0.15} y={24} className="relative lg:pl-4">
          <HeroDashboard />
        </Reveal>
      </div>
    </section>
  );
}
