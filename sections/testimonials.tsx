import { Quote } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { SectionHeading } from "@/components/primitives/eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/primitives/reveal";
import { testimonials } from "@/lib/content";

export function Testimonials() {
  return (
    <Section aria-labelledby="testimonials-heading">
      <Reveal>
        <SectionHeading
          id="testimonials-heading"
          eyebrow="Early voices"
          title="What beta participants told us"
          lead="Placeholder notes from early investors and operators in the private beta."
        />
      </Reveal>

      <Stagger className="mt-14 grid gap-4 md:grid-cols-3" stagger={0.1}>
        {testimonials.map((testimonial) => (
          <StaggerItem key={testimonial.name}>
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <Quote aria-hidden className="size-6 text-leaf-600" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/85">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span
                  aria-hidden
                  className="flex size-10 items-center justify-center rounded-full bg-mint font-mono text-sm font-semibold text-leaf"
                >
                  {testimonial.initials}
                </span>
                <span className="text-sm">
                  <span className="block font-medium text-ink">{testimonial.name}</span>
                  <span className="block text-xs text-muted-foreground">{testimonial.role}</span>
                </span>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
