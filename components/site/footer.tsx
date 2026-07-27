"use client";

import { Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { siteConfig } from "@/lib/site";

type FooterLink = { label: string; href: string };
type FooterColumn = { heading: string; links: FooterLink[] };

const columns: FooterColumn[] = [
  {
    heading: "Platform",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Farm opportunities", href: "#why" },
      { label: "For investors", href: "#for-investors" },
      { label: "For farmers", href: "#for-farmers" },
      { label: "Beta access", href: "#join" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#top" },
      { label: "Compliance", href: "#compliance" },
      { label: "FAQs", href: "#faq" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Privacy policy", href: "/legal/privacy-policy" },
      { label: "Terms", href: "/legal/terms-and-conditions" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      if (targetId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const elem = document.getElementById(targetId);
        if (elem) {
          const offsetTop = elem.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <footer id="contact" className="bg-ink text-white/70">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="max-w-sm">
            <Logo onDark />
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Technology-enabled agri-investment marketplace connecting investors with
              vetted farm projects through escrow-backed, milestone-based funding.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <p className="flex items-center gap-2.5 text-white/70">
                <MapPin className="size-4 text-leaf" />
                {siteConfig.country}
              </p>
              <p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2.5 text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
                >
                  <Mail className="size-4 text-leaf" />
                  {siteConfig.email}
                </a>
              </p>
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/45">
                {column.heading}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleScrollTo(e, link.href)}
                      className="text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="max-w-4xl text-xs leading-relaxed text-white/45">
            {siteConfig.name} is a technology platform connecting users with agricultural
            investment opportunities. Investor funds are managed through licensed financial
            and trustee partners. Investments carry risk and returns are not guaranteed.
          </p>
          <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-white/45 sm:flex-row sm:items-center">
            <p>
              © {year} {siteConfig.name}. All rights reserved.
            </p>
            <p className="font-mono uppercase tracking-[0.14em]">{siteConfig.domain}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
