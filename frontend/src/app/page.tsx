import { HeroSection } from "@/components/home/HeroSection";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { PublicationsPreview } from "@/components/home/PublicationsPreview";
import { QuoteSection } from "@/components/home/QuoteSection";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/shared/JsonLd";

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <WebSiteJsonLd />
      <HeroSection />
      <ExpertiseSection />
      <PublicationsPreview />
      <QuoteSection />
    </>
  );
}