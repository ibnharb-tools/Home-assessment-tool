import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Capabilities } from "@/components/landing/Capabilities";
import { VisualPreview } from "@/components/landing/VisualPreview";
import { ClosingCTA } from "@/components/landing/ClosingCTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Capabilities />
        <VisualPreview />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
