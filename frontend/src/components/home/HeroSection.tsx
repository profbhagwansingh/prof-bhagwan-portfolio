"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Award, GraduationCap } from "lucide-react";

const stats = [
  { icon: BookOpen, value: "50+",  label: "Publications" },
  { icon: Users,    value: "100+", label: "PhD Scholars" },
  { icon: Award,    value: "25+",  label: "Years Experience" },
  { icon: GraduationCap, value: "1000+", label: "Students Mentored" },
];

export function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--accent-light)] -z-10" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl -z-10" />
      <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-primary-400/5 blur-3xl -z-10" />

      {/* Grid texture */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container-academic w-full py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <div>
            {/* Tag */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-light)] border border-primary-200 mb-8 transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: "0ms",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-xs font-medium text-primary-600 font-body tracking-wide uppercase">
                Management Faculty & Researcher
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-display text-display-xl text-[var(--text-primary)] mb-6 text-balance transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "100ms",
              }}
            >
              Prof. (Dr.)
              <br />
              <span className="text-primary-500">Bhagwan Singh</span>
            </h1>

            {/* Philosophy */}
            <p
              className="font-display text-xl italic text-[var(--text-soft)] mb-4 transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "200ms",
              }}
            >
              "Care for People, Planet &amp; Peace"
            </p>

            {/* Description */}
            <p
              className="text-[var(--text-muted)] text-lg leading-relaxed mb-10 max-w-lg transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "300ms",
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
                transitionDelay: "400ms",
              }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Discover My Journey
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/publications"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-soft)] hover:text-primary-500 hover:border-primary-300 rounded-xl font-medium text-sm transition-all duration-200"
              >
                <BookOpen className="w-4 h-4" />
                View Publications
              </Link>
            </div>
          </div>

          {/* Right — Stats Card */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(32px)",
              transitionDelay: "500ms",
            }}
          >
            {/* Profile Card */}
            <div className="card-base p-8 shadow-card">
              {/* Avatar placeholder */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-6 shadow-md">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>

              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-1">
                Prof. (Dr.) Bhagwan Singh
              </h2>
              <p className="text-sm text-primary-500 font-medium mb-4">
                PhD (Management) · DSMM College
              </p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 italic font-display">
                "Invest in Time with positive vibes and ROI will be always good"
              </p>

              {/* Divider */}
              <div className="border-t border-[var(--border)] mb-6" />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-lg text-[var(--text-primary)] leading-none">
                        {value}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}