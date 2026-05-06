import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PublicLayout } from "@/components/layout/PublicLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Prof. (Dr.) Bhagwan Singh — Management Faculty & Researcher",
    template: "%s | Prof. (Dr.) Bhagwan Singh",
  },
  description: "Official portfolio of Prof. (Dr.) Bhagwan Singh — Management faculty, researcher, author, and mentor.",
  keywords: ["Bhagwan Singh", "Professor", "Management", "Research", "DSMM", "Publications", "PhD"],
  authors: [{ name: "Prof. (Dr.) Bhagwan Singh" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Prof. (Dr.) Bhagwan Singh",
    title: "Prof. (Dr.) Bhagwan Singh — Management Faculty & Researcher",
    description: "Official portfolio of Prof. (Dr.) Bhagwan Singh.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <PublicLayout>{children}</PublicLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}