import { ContactPage } from "@/components/contact/ContactPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talk to Prof",
  description: "Get in touch with Prof. (Dr.) Bhagwan Singh — send a message or find contact details.",
};

export default function Page() {
  return <ContactPage />;
}