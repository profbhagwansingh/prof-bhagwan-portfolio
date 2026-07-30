import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Prof. (Dr.) Bhagwan Singh",
  description: "Biography, achievements, and professional experience of Prof. (Dr.) Bhagwan Singh, Distinguished Professor of Management.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
