import { GalleryPage } from "@/components/gallery/GalleryPage";
import { GalleryJsonLd } from "@/components/shared/JsonLd";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photo gallery, videos, and newspaper cuttings from Prof. (Dr.) Bhagwan Singh's academic career — conferences, events, campus life, and achievements.",
  openGraph: {
    title: "Gallery — Prof. (Dr.) Bhagwan Singh",
    description:
      "Photos, videos, and newspaper cuttings from the academic journey of Prof. (Dr.) Bhagwan Singh.",
    url: `${SITE_URL}/gallery`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery — Prof. (Dr.) Bhagwan Singh",
    description: "Academic photos, event videos, and newspaper cuttings.",
  },
  alternates: {
    canonical: `${SITE_URL}/gallery`,
  },
};

export default function Page() {
  return (
    <>
      <GalleryJsonLd />
      <GalleryPage />
    </>
  );
}