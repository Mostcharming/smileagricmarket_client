import { Section } from "@/components/primitives/section";
import { SectionHeading } from "@/components/primitives/eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/primitives/reveal";
import { StepIllustration } from "@/components/illustrations/step-illustrations";
import { steps } from "@/lib/content";

export function HowItWorks() {
  return (
    <Section id="how-it-works" aria-labelledby="how-heading">
      <Reveal>
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title="Four steps from funding to harvest"
          lead="One path, start to finish. Every stage clears before the next one opens."
        />
      </Reveal>

      <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
        {steps.map((step, i) => (
          <StaggerItem key={step.number}>
            <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
              {/* Illustration panel */}
              <div className="relative rounded-2xl bg-linear-to-br from-haze to-mint/12 px-4 pb-2 pt-4">
                <span className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-xl bg-forest font-mono text-sm font-semibold text-leaf shadow-[var(--shadow-soft)]">
                  {step.number}
                </span>
                <StepIllustration index={i} className="mx-auto h-32 w-auto" />
              </div>
              {/* Copy */}
              <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                <h3 className="text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
