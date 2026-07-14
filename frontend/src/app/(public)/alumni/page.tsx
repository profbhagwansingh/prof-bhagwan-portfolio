import { AlumniPage } from "@/components/alumni/AlumniPage";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Alumni Connect",
  description:
    "Alumni registration for former students of Prof. (Dr.) Bhagwan Singh — stay connected, share your journey, and join the alumni network.",
  openGraph: {
    title: "Alumni Connect — Prof. (Dr.) Bhagwan Singh",
    description:
      "Register as an alumnus of Prof. (Dr.) Bhagwan Singh and stay connected with the academic community.",
    url: `${SITE_URL}/alumni`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Alumni Connect — Prof. (Dr.) Bhagwan Singh",
    description: "Register and stay connected with the alumni network.",
  },
  alternates: {
    canonical: `${SITE_URL}/alumni`,
  },
};

export default function Page() {
  return <AlumniPage />;
}