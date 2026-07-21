import { ContactPage } from "@/components/contact/ContactPage";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact / Talk to Prof",
  description: "Get in touch with Prof. (Dr.) Bhagwan Singh. Send a message, request an appointment, or discuss research opportunities.",
  openGraph: {
    title: "Talk to Prof — Prof. (Dr.) Bhagwan Singh",
    description: "Get in touch with Prof. (Dr.) Bhagwan Singh. Send a message, request an appointment, or discuss research opportunities.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Talk to Prof — Prof. (Dr.) Bhagwan Singh",
    description: "Get in touch with Prof. (Dr.) Bhagwan Singh.",
  },
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

export default function Page() {
  return <ContactPage />;
}
