"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path ? "active" : "";

  return (
    <header>
      <div className="container">
        <div className="logo">
          <Link href="/" className="logo-link">
            <div className="logo-container">
              <div className="logo-image">
                <img src="/media/img/WhatsApp Image 2026-01-01 at 7.51.07 PM.jpeg" alt="Prof. (Dr.) Bhagwan Singh" />
              </div>
              <h1 className="logo-text">Prof. (Dr.) Bhagwan Singh</h1>
            </div>
          </Link>
        </div>

        <nav className="desktop-nav">
          <ul>
            <li><Link href="/" className={isActive("/")}>Home</Link></li>
            <li><Link href="/about" className={isActive("/about")}>About</Link></li>
            <li><Link href="/publications" className={isActive("/publications")}>Publication & Research</Link></li>
            <li><Link href="/invited-lectures" className={isActive("/invited-lectures")}>Invited Lectures</Link></li>
            <li><Link href="/gallery" className={isActive("/gallery")}>Gallery</Link></li>
            <li><Link href="/alumni" className={isActive("/alumni")}>Alumni Connect</Link></li>
            <li><Link href="/testimonials" className={isActive("/testimonials")}>Testimonials</Link></li>
            <li><Link href="/contact" className={isActive("/contact")}>Talk to Prof</Link></li>
            <li><Link href="/ecrrb" className={isActive("/ecrrb")}>Ethical Committee</Link></li>
          </ul>
        </nav>

        <button 
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      <nav className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
        <ul>
          <li><Link href="/" className={isActive("/")} onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
          <li><Link href="/about" className={isActive("/about")} onClick={() => setMobileMenuOpen(false)}>About</Link></li>
          <li><Link href="/publications" className={isActive("/publications")} onClick={() => setMobileMenuOpen(false)}>Publication & Research</Link></li>
          <li><Link href="/invited-lectures" className={isActive("/invited-lectures")} onClick={() => setMobileMenuOpen(false)}>Invited Lectures</Link></li>
          <li><Link href="/gallery" className={isActive("/gallery")} onClick={() => setMobileMenuOpen(false)}>Gallery</Link></li>
          <li><Link href="/alumni" className={isActive("/alumni")} onClick={() => setMobileMenuOpen(false)}>Alumni Connect</Link></li>
          <li><Link href="/testimonials" className={isActive("/testimonials")} onClick={() => setMobileMenuOpen(false)}>Testimonials</Link></li>
          <li><Link href="/contact" className={isActive("/contact")} onClick={() => setMobileMenuOpen(false)}>Talk to Prof</Link></li>
          <li><Link href="/ecrrb" className={isActive("/ecrrb")} onClick={() => setMobileMenuOpen(false)}>Ethical Committee</Link></li>
        </ul>
      </nav>
    </header>
  );
}