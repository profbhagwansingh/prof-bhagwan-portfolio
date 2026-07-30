import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Prof. (Dr.) Bhagwan Singh",
  description: "Explore the professional and academic journey of Prof. (Dr.) Bhagwan Singh through photos and media.",
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
