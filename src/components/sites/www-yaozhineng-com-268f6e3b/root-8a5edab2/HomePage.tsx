import { DemoModal } from "./DemoModal";
import { FeaturesSection } from "./FeaturesSection";
import { HeroBackground } from "./HeroBackground";
import { HeroSection } from "./HeroSection";
import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";

export function HomePage() {
  return (
    <div className="relative isolate min-h-screen bg-[#f8f9fc] leading-relaxed text-[#1a1f36]">
      <HeroBackground />
      <SiteNav />
      <HeroSection />
      <FeaturesSection />
      <SiteFooter />
      {/* Isolated subscriber — opening demo does not re-render HeroSection. */}
      <DemoModal />
    </div>
  );
}
