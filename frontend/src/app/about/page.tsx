import { AboutHero } from "@/components/about/AboutHero";
import { TimelineSection } from "@/components/about/TimelineSection";
import { CoursesSection } from "@/components/about/CoursesSection";
import { AchievementsSection } from "@/components/about/AchievementsSection";
import { BooksSection } from "@/components/about/BooksSection";
import { ScholarsSection } from "@/components/about/ScholarsSection";
import { PersonJsonLd } from "@/components/shared/JsonLd";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Prof. (Dr.) Bhagwan Singh — his academic journey, teaching career spanning decades, research contributions, courses taught, and achievements in the field of Management.",
  openGraph: {
    title: "About — Prof. (Dr.) Bhagwan Singh",
    description:
      "Academic journey, career timeline, courses, achievements, and published books of Prof. (Dr.) Bhagwan Singh.",
    url: `${SITE_URL}/about`,
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Prof. (Dr.) Bhagwan Singh",
    description:
      "Academic journey, career timeline, courses, achievements, and published books.",
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <PersonJsonLd />
      <AboutHero />
      <TimelineSection />
      <CoursesSection />
      <AchievementsSection />
      <ScholarsSection />
      <BooksSection />
    </>
  );
}