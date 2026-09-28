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

export default function Home() {
  return (
    <>
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
