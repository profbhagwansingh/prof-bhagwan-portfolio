import { PublicationsPage } from "@/components/publications/PublicationsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Publications",
    description:
        "Research publications, journal articles, and authored books by Prof. (Dr.) Bhagwan Singh.",
};

export default function Page() {
    return <PublicationsPage />;
}