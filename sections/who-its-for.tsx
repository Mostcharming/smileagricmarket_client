import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { SectionHeading, Eyebrow } from "@/components/primitives/eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/primitives/reveal";
import { ButtonLink } from "@/components/ui/agri-button";
import { audiences } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const audienceImages = [
  { src: "/images/greenhouse-inspection.jpg", alt: "An agronomist inspecting greenhouse crops with a clipboard" },
  { src: "/images/farmers-field.jpg", alt: "Farm operators tending young crops in the field" },
];

export function WhoItsFor() {
  return (
    <Section tone="forest" aria-labelledby="audience-heading">
      <Reveal>
        <SectionHeading
          id="audience-heading"
          tone="onDark"
          eyebrow="Who it's for"
          title="For investors and the operators they back"
          lead="Investors want accountable exposure to farming. Operators need structured capital to grow. Both start in the same place."
        />
      </Reveal>

      <Stagger className="mt-14 grid gap-6 lg:grid-cols-2" stagger={0.12}>
        {audiences.map((audience, index) => (
          <StaggerItem key={audience.id}>
            <article
              id={audience.id}
              className={cn(
                "flex h-full scroll-mt-24 flex-col overflow-hidden rounded-3xl border shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
                index === 0 ? "border-border bg-card" : "border-forest/15 bg-forest text-white",
              )}
            >
              {/* Header photo */}
              <div className="relative h-44 w-full sm:h-52">
                <Image
                  src={audienceImages[index].src}
                  alt={audienceImages[index].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-0",
                    index === 0
                      ? "bg-linear-to-t from-black/25 to-transparent"
                      : "bg-linear-to-t from-forest via-forest/30 to-transparent",
                  )}
                />
                <Eyebrow
                  tone="onDark"
                  className="absolute bottom-4 left-6 text-white [&>span]:bg-white/80"
                >
                  {audience.eyebrow}
                </Eyebrow>
              </div>

              {/* Copy */}
              <div className="flex flex-1 flex-col p-8 sm:p-10">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl",
                      index === 0 ? "bg-mint text-leaf" : "bg-white/10 text-leaf",
                    )}
                  >
                    <audience.icon className="size-6" />
                  </span>
                  <h3
                    className={cn(
                      "text-2xl font-semibold leading-tight",
                      index === 0 ? "text-ink" : "text-white",
                    )}
                  >
                    {audience.title}
                  </h3>
                </div>

                <p
                  className={cn(
                    "mt-4 text-sm leading-relaxed sm:text-base",
                    index === 0 ? "text-muted-foreground" : "text-white/70",
                  )}
                >
                  {audience.description}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {audience.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-sm">
                      <span
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                          index === 0 ? "bg-mint text-leaf" : "bg-white/10 text-leaf",
                        )}
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      <span className={index === 0 ? "text-ink/80" : "text-white/80"}>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <ButtonLink
                    variant={index === 0 ? "cta" : "surface"}
                    size="lg"
                    className={cn(
                      "h-11 rounded-lg px-5",
                      index === 1 &&
                        "border-white/20 bg-white/10 text-white hover:border-leaf hover:bg-white/15",
                    )}
                    href={siteConfig.cta.href}
                  >
                    {audience.ctaLabel}
                    <ArrowRight data-icon="inline-end" className="size-4" />
                  </ButtonLink>
                </div>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
