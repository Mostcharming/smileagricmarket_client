import { SectionHeading } from "@/components/primitives/eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/primitives/reveal";
import { complianceBadges } from "@/lib/content";

export function Compliance() {
  return (
    <section
      id="compliance"
      aria-labelledby="compliance-heading"
      className="relative overflow-hidden bg-forest py-16 text-white sm:py-24 lg:py-28"
    >
      <div aria-hidden className="absolute inset-0 bg-forest-grid opacity-60" />
      <div
        aria-hidden
        className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-leaf/15 blur-3xl"
      />
      <div className="container-page relative">
        <Reveal>
          <SectionHeading
            id="compliance-heading"
            eyebrow="Compliance"
            title="How compliance works here"
            tone="onDark"
            lead={
              <>
                {`SmileAgrimarket works with licensed financial, payment, and trustee
                partners who manage the funds. The platform never takes custody of your
                money.`}
              </>
            }
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-3" stagger={0.1}>
          {complianceBadges.map((badge) => (
            <StaggerItem key={badge.title}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-leaf/40">
                <span className="flex size-11 items-center justify-center rounded-xl bg-leaf/15 text-leaf">
                  <badge.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-white">{badge.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{badge.description}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl font-mono text-xs leading-relaxed text-white/45">
            We&apos;ll publish partner and regulatory details in full as the beta opens. We
            don&apos;t show certifications we haven&apos;t earned.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
