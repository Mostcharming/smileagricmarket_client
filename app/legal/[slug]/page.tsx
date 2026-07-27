import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { legalPolicies } from "@/lib/legal";
import { siteConfig } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return legalPolicies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = legalPolicies.find((p) => p.slug === slug);
  if (!policy) return {};
  return {
    title: policy.title,
    description: `${policy.title} for ${siteConfig.name}. Effective ${policy.effectiveDate}.`,
    alternates: { canonical: `/legal/${policy.slug}` },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const policy = legalPolicies.find((p) => p.slug === slug);
  if (!policy) notFound();

  const otherPolicies = legalPolicies.filter((p) => p.slug !== policy.slug);
  const year = new Date().getFullYear();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf-600"
            aria-label={`${siteConfig.name} — home`}
          >
            <Logo />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {policy.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Effective date: {policy.effectiveDate} · Last updated:{" "}
            {policy.lastUpdated}
          </p>

          <article
            className="mt-10 text-[0.95rem] leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-leaf-600 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink [&_h3]:mt-7 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
            // Static HTML generated at build time from our own legal source
            // document in src/lib/legal.ts — no user input involved.
            dangerouslySetInnerHTML={{ __html: policy.html }}
          />

          <nav
            aria-label="Other policies"
            className="mt-14 border-t border-border pt-8"
          >
            <h2 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Other policies
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {otherPolicies.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/legal/${p.slug}`}
                    className="text-sm font-medium text-ink underline-offset-4 transition-colors hover:text-leaf-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-[0.14em]">
            {siteConfig.domain}
          </p>
        </div>
      </footer>
    </>
  );
}
