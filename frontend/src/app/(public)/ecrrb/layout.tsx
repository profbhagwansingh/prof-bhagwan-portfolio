import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ECRRB | Prof. (Dr.) Bhagwan Singh",
  description: "Ethical Committee & Research Review Board (ECRRB) guidelines, protocols, and application forms.",
};

export default function EcrrbLayout({ children }: { children: React.ReactNode }) {
  return children;
}
