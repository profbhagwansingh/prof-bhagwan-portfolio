import { GalleryPage } from "@/components/gallery/GalleryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo gallery, videos, and newspaper cuttings from Prof. (Dr.) Bhagwan Singh's academic journey.",
};

export default function Page() {
  return <GalleryPage />;
}