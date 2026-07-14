"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { SocialSidebar } from "./SocialSidebar";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <SocialSidebar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}