import { GalleryPage } from "@/components/gallery/GalleryPage";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse the professional gallery of Prof. (Dr.) Bhagwan Singh. View photos and media from academic events, lectures, and achievements.",
  openGraph: {
    title: "Gallery — Prof. (Dr.) Bhagwan Singh",
    description: "Browse the professional gallery of Prof. (Dr.) Bhagwan Singh.",
    url: `${SITE_URL}/gallery`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery — Prof. (Dr.) Bhagwan Singh",
    description: "Browse the professional gallery of Prof. (Dr.) Bhagwan Singh.",
  },
  alternates: {
    canonical: `${SITE_URL}/gallery`,
  },
};

export default function Page() {
  return <GalleryPage />;
}
