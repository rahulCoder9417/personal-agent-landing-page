import type { Metadata } from "next";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Pricing } from "@/components/pricing";
import { plans, pricingFaqs } from "@/lib/content";
import { site } from "@/lib/site";

const price = (name: string) => plans.find((p) => p.name === name)?.price;

// Prices come from content.ts so the search snippet can't drift from the plans.
const description = `Textcrew plans and credits: start free with 100 credits, or go Pro for ${price("Pro")} a month or Max for ${price("Max")} a month. If you joined the waitlist, your first month is 50% off.`;

export const metadata: Metadata = {
  title: "Pricing",
  description,
  alternates: { canonical: "/pricing" },
  // Setting openGraph here replaces the root one, so the shared social image is listed again.
  openGraph: { type: "website", siteName: site.name, title: "Textcrew pricing", description, url: "/pricing", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

export default function PricingPage() {
  return (
    <>
      <Nav current="/pricing" />
      <main className="flex-1">
        <Pricing />
        <Faq title="Plans and credits, answered." items={pricingFaqs} className="bg-surface-2/50" />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
