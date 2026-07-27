import { Section } from "@/components/primitives/section";
import { SectionHeading } from "@/components/primitives/eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/primitives/reveal";
import { trustCards } from "@/lib/content";

export function Trust() {
  return (
    <Section id="trust" tone="forest" aria-labelledby="trust-heading">
      <Reveal>
        <SectionHeading
          id="trust-heading"
          tone="onDark"
          eyebrow="Why it's safe"
          title="How your money stays protected"
          lead="You commit real money to real farms. We hold your funds in escrow and show you every step of where they go."
        />
      </Reveal>

      <Stagger
        className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.07}
      >
        {trustCards.map((card) => (
          <StaggerItem key={card.title}>
            <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
              <span className="flex size-11 items-center justify-center rounded-xl bg-mint text-leaf transition-transform duration-300 group-hover:scale-105">
                <card.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-ink">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
