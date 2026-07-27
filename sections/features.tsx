import { Section } from "@/components/primitives/section";
import { SectionHeading } from "@/components/primitives/eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/primitives/reveal";
import { features } from "@/lib/content";

export function Features() {
  return (
    <Section id="features" tone="forest" aria-labelledby="features-heading">
      <Reveal>
        <SectionHeading
          id="features-heading"
          tone="onDark"
          eyebrow="What's inside"
          title="The tools that keep everyone accountable"
          lead="You can see where your money is and what it's doing, at any moment."
        />
      </Reveal>

      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
        {features.map((feature) => (
          <StaggerItem key={feature.title}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-leaf-600 to-harvest transition-transform duration-300 group-hover:scale-x-100"
              />
              <span className="flex size-11 items-center justify-center rounded-xl bg-mint text-leaf ring-1 ring-inset ring-leaf/25 transition-transform duration-300 group-hover:scale-105">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
