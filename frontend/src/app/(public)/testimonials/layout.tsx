import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials | Prof. (Dr.) Bhagwan Singh",
  description: "Testimonials and feedback from students, peers, and academic collaborators of Prof. (Dr.) Bhagwan Singh.",
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
