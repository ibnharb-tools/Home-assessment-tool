import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Capabilities } from "@/components/landing/Capabilities";
import { VisualPreview } from "@/components/landing/VisualPreview";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Capabilities />
        <VisualPreview />
      </main>
      <Footer />
    </>
  );
}
