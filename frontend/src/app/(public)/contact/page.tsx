import { ContactPage } from "@/components/contact/ContactPage";
import { ContactPageJsonLd } from "@/components/shared/JsonLd";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Talk to Prof",
  description:
    "Get in touch with Prof. (Dr.) Bhagwan Singh — send a direct message, ask about research collaborations, or reach out for academic guidance.",
  openGraph: {
    title: "Talk to Prof — Prof. (Dr.) Bhagwan Singh",
    description:
      "Send a message to Prof. (Dr.) Bhagwan Singh — contact form for research queries, collaboration, and guidance.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Talk to Prof — Prof. (Dr.) Bhagwan Singh",
    description: "Get in touch for research collaboration and academic guidance.",
  },
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

export default function Page() {
  return (
    <>
      <ContactPageJsonLd />
      <ContactPage />
    </>
  );
}