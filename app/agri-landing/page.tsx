import { AnnouncementBar } from "@/components/site/announcement-bar";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { MobileStickyCta } from "@/components/site/mobile-sticky-cta";
import { BetaPopup } from "@/components/site/beta-popup";
import { Hero } from "@/sections/hero";
import { Trust } from "@/sections/trust";
import { HowItWorks } from "@/sections/how-it-works";
import { WhoItsFor } from "@/sections/who-its-for";
import { WhyAgrimarket } from "@/sections/why-agrimarket";
import { Features } from "@/sections/features";
import { Compliance } from "@/sections/compliance";
import { Faq } from "@/sections/faq";
import { FinalCta } from "@/sections/final-cta";
import { faqSchema, organizationSchema, websiteSchema } from "@/lib/schema";

export default function AgriLandingPage() {
  const schemas = [organizationSchema(), websiteSchema(), faqSchema()];

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <Trust />
        <HowItWorks />
        <WhoItsFor />
        <WhyAgrimarket />
        <Features />
        <Compliance />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileStickyCta />
      <BetaPopup />

      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
