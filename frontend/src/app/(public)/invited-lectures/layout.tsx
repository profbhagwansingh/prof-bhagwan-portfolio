import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invited Lectures | Prof. (Dr.) Bhagwan Singh",
  description: "A comprehensive record of invited lectures, seminars, and keynote addresses delivered by Prof. (Dr.) Bhagwan Singh.",
};

export default function LecturesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
