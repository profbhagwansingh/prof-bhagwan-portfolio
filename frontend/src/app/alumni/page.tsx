import { AlumniPage } from "@/components/alumni/AlumniPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni Connect",
  description: "Alumni registration for students of Prof. (Dr.) Bhagwan Singh — stay connected and share your journey.",
};

export default function Page() {
  return <AlumniPage />;
}