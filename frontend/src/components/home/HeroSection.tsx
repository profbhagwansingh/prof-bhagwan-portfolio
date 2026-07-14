"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Award, GraduationCap } from "lucide-react";
import api from "@/lib/api";

/* ─── Slideshow: loaded dynamically from filesystem API ────────── */
const MAX_SLIDES = 20; // limit for performance

/* Ken Burns direction presets – each slide gets a different pan/zoom */
const KB_VARIANTS = [
  "hero-kb-zoom-in",
  "hero-kb-pan-left",
  "hero-kb-zoom-out",
  "hero-kb-pan-right",
  "hero-kb-pan-up",
] as const;

const SLIDE_DURATION = 6000; // ms per slide

/* ─── Stats ─────────────────────────────────────────────────────── */
const stats = [
  { icon: BookOpen,      value: "54+",   label: "Publications" },
  { icon: Users,         value: "12",    label: "PhD Scholars" },
  { icon: Award,         value: "25+",   label: "Years Experience" },
  { icon: GraduationCap, value: "1000+", label: "Students Mentored" },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [images, setImages]   = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [ready, setReady]     = useState(false);
  const timerRef              = useRef<ReturnType<typeof setInterval>>();

  /* ── Entrance animation ──────────────────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  /* ── Load slideshow images from filesystem API ──────────────── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/api/gallery/admin/slideshow-files");
        const urls: string[] = Array.isArray(data) ? data : [];
        if (!cancelled && urls.length > 0) {
          setImages(urls.slice(0, MAX_SLIDES));
        }
      } catch {
        // If API fails, leave empty — no hardcoded fallback
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── Preload the first image so the hero doesn't flash blank ── */
  useEffect(() => {
    if (images.length === 0) {
      setReady(true); // show content even with no images
      return;
    }
    const img = new window.Image();
    img.src = images[0];
    img.onload = () => setReady(true);
    img.onerror = () => setReady(true);
    const t = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(t);
  }, [images]);

  /* ── Auto-advance slides ─────────────────────────────────────── */
  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    timerRef.current = setInterval(advance, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [advance]);

  /* ── Jump to slide via indicator dots ─────────────────────────── */
  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, SLIDE_DURATION);
  }, [advance]);

  return (
    <section className="hero-section relative min-h-[100vh] flex items-center overflow-hidden">

      {/* ══════════ Background – Ken Burns Crossfade ══════════ */}
      <div className="absolute inset-0 z-0">
        {images.length === 0 && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
        )}
        {images.map((src, i) => (
          <div
            key={src}
            className={`hero-kb-slide ${KB_VARIANTS[i % KB_VARIANTS.length]} ${
              i === current ? "hero-kb-active" : ""
            }`}
            aria-hidden
          >
            <img
              src={src}
              alt=""
              loading={i < 3 ? "eager" : "lazy"}
              draggable={false}
              className="hero-kb-img"
              onError={(e) => {
                // Remove broken images from slideshow
                const target = e.currentTarget;
                target.style.display = 'none';
                setImages(prev => {
                  const filtered = prev.filter(url => url !== src);
                  if (current >= filtered.length && filtered.length > 0) setCurrent(0);
                  return filtered;
                });
              }}
            />
          </div>
        ))}

        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 z-10 hero-overlay" />

        {/* Bottom vignette */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a14]/70 via-transparent to-transparent" />
      </div>

      {/* ══════════ Decorative Elements ══════════ */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary-500/8 blur-3xl z-[1] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-primary-400/6 blur-3xl z-[1] pointer-events-none" />

      {/* Fine grain texture */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ══════════ Content ══════════ */}
      <div
        className="container-academic w-full relative z-[2] py-28 lg:py-32"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 0.8s ease" }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ─── Left — Text ─────────────────────────────────── */}
          <div>
            {/* Tag */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-8 transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: "0ms",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-xs font-medium text-primary-200 font-body tracking-wide uppercase">
                Management Faculty &amp; Researcher
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-display text-display-xl text-white mb-6 text-balance transition-all duration-700 drop-shadow-lg"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "120ms",
              }}
            >
              Prof. (Dr.)
              <br />
              <span className="hero-name-gradient">Bhagwan Singh</span>
            </h1>

            {/* Philosophy */}
            <p
              className="font-display text-xl italic text-white/70 mb-4 transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "240ms",
              }}
            >
              &ldquo;Care for People, Planet &amp; Peace&rdquo;
            </p>

            {/* Description */}
            <p
              className="text-white/55 text-lg leading-relaxed mb-10 max-w-lg transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "360ms",
              }}
            >
              A dedicated management educator, prolific researcher, and compassionate mentor
              shaping future business leaders with values-driven pedagogy.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-4 transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "480ms",
              }}
            >
              <Link
                href="/about"
                className="hero-cta-primary group"
              >
                Discover My Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/publications"
                className="hero-cta-secondary"
              >
                <BookOpen className="w-4 h-4" />
                View Publications
              </Link>
            </div>
          </div>

          {/* ─── Right — Profile Card (glassmorphism) ────────── */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(32px)",
              transitionDelay: "600ms",
            }}
          >
            <div className="hero-profile-card">
              {/* Photo */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-6 shadow-xl ring-2 ring-white/20">
                <img
                  src="/media/img/WhatsApp Image 2026-01-01 at 7.51.07 PM.jpeg"
                  alt="Prof. (Dr.) Bhagwan Singh"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="font-display text-xl font-semibold text-white mb-1">
                Prof. (Dr.) Bhagwan Singh
              </h2>
              <p className="text-sm text-primary-300 font-medium mb-4">
                Professor of Management · CUJ, Ranchi
              </p>
              <p className="text-sm text-white/50 leading-relaxed mb-6 italic font-display">
                &ldquo;Invest in Time with positive vibes and ROI will be always good&rdquo;
              </p>

              {/* Divider */}
              <div className="border-t border-white/10 mb-6" />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-lg text-white leading-none">
                        {value}
                      </p>
                      <p className="text-xs text-white/45 mt-0.5">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ Slide Indicators ══════════ */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex items-center gap-2 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transitionDelay: "800ms" }}
      >
        {images.slice(0, Math.min(images.length, 8)).map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className="group relative h-1.5 rounded-full transition-all duration-500 overflow-hidden"
            style={{ width: i === current ? 32 : 12 }}
          >
            <span className="absolute inset-0 rounded-full bg-white/25" />
            {i === current && (
              <span
                className="absolute inset-0 rounded-full bg-white/90"
                style={{
                  animation: `hero-progress ${SLIDE_DURATION}ms linear forwards`,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}