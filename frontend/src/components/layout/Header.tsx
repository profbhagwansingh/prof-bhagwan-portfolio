"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/",             label: "Home" },
  { href: "/about",        label: "About" },
  { href: "/publications", label: "Publications" },
  { href: "/gallery",      label: "Gallery" },
  { href: "/contact",      label: "Talk to Prof" },
  { href: "/alumni",       label: "Alumni Connect" },
];

/** Live IST clock — updates every second, SSR-safe */
function useLiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });

    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export function Header() {
  const pathname             = usePathname();
  const { theme, setTheme }  = useTheme();
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted,    setMounted]    = useState(false);
  const liveTime = useLiveClock();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[var(--bg-primary)]/95 backdrop-blur-md shadow-nav border-b border-[var(--border)]"
            : "bg-transparent"
        )}
      >
        <div className="container-academic">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo / Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center shadow-sm group-hover:bg-primary-600 transition-colors">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="font-display text-sm font-semibold leading-tight text-[var(--text-primary)]">
                  Prof. (Dr.) Bhagwan Singh
                </p>
                <p className="text-xs text-[var(--text-muted)] font-body leading-tight">
                  Care for People, Planet &amp; Peace
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-body",
                      isActive
                        ? "bg-primary-500 text-white shadow-sm"
                        : "text-[var(--text-soft)] hover:text-primary-500 hover:bg-[var(--accent-light)]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">

              {/* ── Live IST Clock (desktop) ── */}
              {mounted && liveTime && (
                <div
                  title="Indian Standard Time (IST)"
                  className={cn(
                    "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-all duration-300 select-none",
                    scrolled
                      ? "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-muted)]"
                      : "bg-white/10 border-white/15 text-white/75 backdrop-blur-sm"
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0",
                      scrolled ? "bg-primary-500" : "bg-primary-400"
                    )}
                  />
                  {liveTime}
                  <span className={cn(
                    "text-[10px] tracking-wider ml-0.5",
                    scrolled ? "text-[var(--text-muted)]" : "text-white/40"
                  )}>IST</span>
                </div>
              )}

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:bg-[var(--accent-light)] transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  {theme === "dark"
                    ? <Sun className="w-4 h-4" />
                    : <Moon className="w-4 h-4" />
                  }
                </button>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-soft)] hover:bg-[var(--accent-light)] transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-72 bg-[var(--bg-card)] shadow-2xl transition-transform duration-300 flex flex-col",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <div>
              <p className="font-display text-sm font-semibold text-[var(--text-primary)]">
                Prof. (Dr.) Bhagwan Singh
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Care for People, Planet &amp; Peace
              </p>
              {/* Live clock in mobile panel */}
              {mounted && liveTime && (
                <p className="text-xs font-mono text-primary-500 mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse inline-block flex-shrink-0" />
                  {liveTime} <span className="text-[10px] text-[var(--text-muted)]">IST</span>
                </p>
              )}
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col p-4 gap-1 flex-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 font-body",
                    isActive
                      ? "bg-primary-500 text-white"
                      : "text-[var(--text-soft)] hover:text-primary-500 hover:bg-[var(--accent-light)]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Panel Footer */}
          <div className="p-6 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)] italic font-display">
              &ldquo;Invest in Time with positive vibes and ROI will be always good&rdquo;
            </p>
          </div>
        </div>
      </div>
    </>
  );
}