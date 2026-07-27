import { Check, Minus } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { SectionHeading } from "@/components/primitives/eyebrow";
import { Reveal } from "@/components/primitives/reveal";
import { LogoMark } from "@/components/site/logo";
import { comparisonRows } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export function WhyAgrimarket() {
  return (
    <Section id="why" aria-labelledby="why-heading">
      <Reveal>
        <SectionHeading
          id="why-heading"
          eyebrow="The difference"
          title="Why SmileAgrimarket"
          lead="Informal farm investment asks you to trust a promise. We replace the promise with structure you can inspect."
        />
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">
              Feature comparison between {siteConfig.name} and traditional farm investment
            </caption>
            <colgroup>
              <col className="w-[46%]" />
              <col className="w-[27%]" />
              <col className="w-[27%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="px-4 py-4 text-xs font-medium text-muted-foreground sm:px-6 sm:py-5 sm:text-sm"
                >
                  What you get
                </th>
                <th scope="col" className="bg-mint px-2 py-4 text-center sm:px-6 sm:py-5">
                  <span className="flex flex-col items-center justify-center gap-1 font-heading text-xs font-semibold text-white sm:flex-row sm:gap-2 sm:text-sm">
                    <LogoMark className="size-5 shrink-0" />
                    <span className="sm:hidden">Agrimarket</span>
                    <span className="hidden sm:inline">{siteConfig.name}</span>
                  </span>
                </th>
                <th
                  scope="col"
                  className="px-2 py-4 text-center text-xs font-medium text-muted-foreground sm:px-6 sm:py-5 sm:text-sm"
                >
                  <span className="sm:hidden">Traditional</span>
                  <span className="hidden sm:inline">Traditional farm investment</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.criterion} className="border-b border-border last:border-0">
                  <th scope="row" className="px-4 py-4 align-top font-normal sm:px-6">
                    <span className="block text-sm font-medium text-ink">{row.criterion}</span>
                    <span className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                      {row.note}
                    </span>
                  </th>
                  <td className="bg-mint px-2 py-4 text-center sm:px-6">
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-leaf-600 text-white">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="sr-only">Included</span>
                  </td>
                  <td className="px-2 py-4 text-center sm:px-6">
                    <span className="inline-flex size-6 items-center justify-center rounded-full border border-border text-muted-foreground">
                      <Minus className="size-3.5" />
                    </span>
                    <span className="sr-only">Not included</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
