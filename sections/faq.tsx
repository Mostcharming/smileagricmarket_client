import { Section } from "@/components/primitives/section";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { Reveal } from "@/components/primitives/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export function Faq() {
  return (
    <Section id="faq" tone="haze" aria-labelledby="faq-heading">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <Eyebrow>FAQ</Eyebrow>
            <h2
              id="faq-heading"
              className="mt-4 text-balance text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl"
            >
              Questions, answered plainly
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Still unsure about something? Email{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-medium text-forest-600 underline underline-offset-4 hover:text-forest"
              >
                {siteConfig.email}
              </a>{" "}
              and a real person will reply.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion
            defaultValue={["faq-0"]}
            className="rounded-2xl border border-border bg-card px-5 shadow-[var(--shadow-soft)] sm:px-7"
          >
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`faq-${i}`}>
                <AccordionTrigger className="py-5 text-base font-medium text-ink hover:no-underline sm:text-[1.05rem]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[0.95rem] leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}
