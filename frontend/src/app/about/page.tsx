import { AboutHero } from "@/components/about/AboutHero";
import { TimelineSection } from "@/components/about/TimelineSection";
import { CoursesSection } from "@/components/about/CoursesSection";
import { AchievementsSection } from "@/components/about/AchievementsSection";
import { BooksSection } from "@/components/about/BooksSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about Prof. (Dr.) Bhagwan Singh — his academic journey, teaching experience, research, and achievements.",
};

export default function AboutPage() {
    return (
        <>
            <AboutHero />
            <TimelineSection />
            <CoursesSection />
            <AchievementsSection />
            <BooksSection />
        </>
    );
}