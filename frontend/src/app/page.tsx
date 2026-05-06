import { HeroSection } from "@/components/home/HeroSection";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { PublicationsPreview } from "@/components/home/PublicationsPreview";
import { QuoteSection } from "@/components/home/QuoteSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ExpertiseSection />
      <PublicationsPreview />
      <QuoteSection />
    </>
  );
}