"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, ExternalLink } from "lucide-react";

const books = [
  {
    title: "Strategic Management: Theory & Practice",
    year: 2022,
    subtitle: "A comprehensive guide for management students and practitioners.",
    isbn: "978-XXXXXXXXXX",
    coverColor: "from-primary-500 to-primary-700",
  },
  {
    title: "Marketing Management in the Digital Age",
    year: 2021,
    subtitle: "Bridging traditional marketing principles with modern digital strategies.",
    isbn: "978-XXXXXXXXXX",
    coverColor: "from-emerald-500 to-emerald-700",
  },
  {
    title: "Human Resource Management: A Values Approach",
    year: 2020,
    subtitle: "People-centric HRM practices for sustainable organisational growth.",
    isbn: "978-XXXXXXXXXX",
    coverColor: "from-amber-500 to-amber-700",
  },
  {
    title: "Research Methodology for Management Studies",
    year: 2019,
    subtitle: "A practical guide to qualitative and quantitative research methods.",
    isbn: "978-XXXXXXXXXX",
    coverColor: "from-rose-500 to-rose-700",
  },
];

export function BooksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-section bg-[var(--bg-secondary)]">
      <div className="container-academic">
        <div
          className="mb-14 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)" }}
        >
          <div className="accent-line">
            <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Authored Works</p>
          </div>
          <h2 className="font-display text-display-md text-[var(--text-primary)]">
            Books Published
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book, i) => (
            <div
              key={book.title}
              className="card-base overflow-hidden group transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(32px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {/* Book Cover */}
              <div className={`h-48 bg-gradient-to-br ${book.coverColor} flex items-center justify-center relative`}>
                <BookOpen className="w-16 h-16 text-white/40" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <span className="absolute top-3 right-3 font-display text-white/80 text-sm font-bold">
                  {book.year}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] leading-snug mb-2">
                  {book.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                  {book.subtitle}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)]">ISBN: {book.isbn}</span>
                  <button className="w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-300 transition-all">
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}