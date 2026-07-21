import { PublicationsPage } from "@/components/publications/PublicationsPage";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Publications & Research",
  description: "Explore the academic publications, research papers, books, book chapters, and invited lectures by Prof. (Dr.) Bhagwan Singh.",
  openGraph: {
    title: "Publications & Research — Prof. (Dr.) Bhagwan Singh",
    description: "Explore the academic publications, research papers, books, book chapters, and invited lectures by Prof. (Dr.) Bhagwan Singh.",
    url: `${SITE_URL}/publications`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Publications & Research — Prof. (Dr.) Bhagwan Singh",
    description: "Explore the academic publications, research papers, and lectures.",
  },
  alternates: {
    canonical: `${SITE_URL}/publications`,
  },
};

export default function Page() {
  return <PublicationsPage />;
}
