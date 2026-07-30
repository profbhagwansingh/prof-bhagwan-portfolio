import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni Connect | Prof. (Dr.) Bhagwan Singh",
  description: "Connect with the alumni network of Prof. (Dr.) Bhagwan Singh and share your professional journey.",
};

export default function AlumniLayout({ children }: { children: React.ReactNode }) {
  return children;
}
