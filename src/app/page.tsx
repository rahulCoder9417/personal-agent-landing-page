import type { Metadata } from "next";
import { Apps, UseCases } from "@/components/apps";
import { Automations } from "@/components/automations";
import { Crew } from "@/components/crew";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Nav } from "@/components/nav";
import { Pricing } from "@/components/pricing";
import { Features, Trust } from "@/components/trust";
import { faqs, plans } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// schema.org data for search engines: who we are, the app and its plans, and the FAQ.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: `${site.url}/icon-512.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: site.url,
      description: site.description,
      publisher: { "@id": `${site.url}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: site.name,
      url: site.url,
      description: site.description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, Telegram",
      publisher: { "@id": `${site.url}/#organization` },
      offers: plans.map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: p.price.replace(/[^0-9.]/g, ""),
        priceCurrency: "USD",
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so the JSON can never close the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Apps />
        <UseCases />
        <Automations />
        <Crew />
        <Trust />
        <Features />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
