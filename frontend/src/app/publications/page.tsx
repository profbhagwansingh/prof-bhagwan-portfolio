import { PublicationsPage } from "@/components/publications/PublicationsPage";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Publications & Research",
  description:
    "Research publications, journal articles (Scopus, UGC-CARE, peer-reviewed), conference papers, and authored books by Prof. (Dr.) Bhagwan Singh.",
  openGraph: {
    title: "Publications & Research — Prof. (Dr.) Bhagwan Singh",
    description:
      "Browse Scopus-indexed, UGC-CARE listed, and peer-reviewed journal articles, conference papers, and books.",
    url: `${SITE_URL}/publications`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Publications — Prof. (Dr.) Bhagwan Singh",
    description:
      "Research publications, journal articles, and authored books.",
  },
  alternates: {
    canonical: `${SITE_URL}/publications`,
  },
};

export default function Page() {
  return <PublicationsPage />;
}