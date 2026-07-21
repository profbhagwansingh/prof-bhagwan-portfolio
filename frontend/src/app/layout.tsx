import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f1a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Prof. (Dr.) Bhagwan Singh — Management Faculty & Researcher",
    template: "%s | Prof. (Dr.) Bhagwan Singh",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Bhagwan Singh",
    "Professor",
    "Management",
    "Research",
    "DSMM",
    "Publications",
    "PhD",
    "Academic Portfolio",
    "Business Administration",
  ],
  authors: [{ name: "Prof. (Dr.) Bhagwan Singh", url: SITE_URL }],
  creator: "Prof. (Dr.) Bhagwan Singh",
  publisher: SITE_NAME,

  // ─── Open Graph ─────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    title: "Prof. (Dr.) Bhagwan Singh — Management Faculty & Researcher",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },

  // ─── Twitter Card ───────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Prof. (Dr.) Bhagwan Singh — Management Faculty & Researcher",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
  },

  // ─── Other Meta ─────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Tangerine:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}