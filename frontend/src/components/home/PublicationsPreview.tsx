"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

const featured = [
  {
    tag: "Scopus",
    title: "Impact of Digital Marketing on Consumer Purchase Behaviour in Emerging Markets",
    journal: "Journal of Marketing Research",
    year: 2023,
  },
  {
    tag: "Peer Reviewed",
    title: "Sustainable HRM Practices and Organisational Performance: A Systematic Review",
    journal: "International Journal of Human Resource Management",
    year: 2022,
  },
  {
    tag: "UGC CARE",
    title: "Corporate Social Responsibility and Firm Value: Evidence from Indian Manufacturing",
    journal: "Indian Journal of Corporate Governance",
    year: 2023,
  },
];

const tagColors: Record<string, string> = {
  "Scopus":       "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
  "Peer Reviewed":"bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
  "UGC CARE":     "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
};

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function PublicationsPreview() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="py-section">
      <div className="container-academic">

        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)" }}
        >
          <div>
            <div className="accent-line">
              <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Research Output</p>
            </div>
            <h2 className="font-display text-display-md text-[var(--text-primary)]">
              Featured Publications
            </h2>
          </div>
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors group flex-shrink-0"
          >
            View all publications
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Publication Cards */}
        <div className="space-y-4">
          {featured.map((pub, i) => (
            <div
              key={i}
              className="card-base p-6 flex flex-col sm:flex-row sm:items-start gap-4 transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(24px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {/* Year */}
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[var(--accent-light)] flex items-center justify-center">
                <span className="font-display text-xs font-bold text-primary-500 text-center leading-tight">
                  {pub.year}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${tagColors[pub.tag]}`}>
                    {pub.tag}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-[var(--text-primary)] leading-snug mb-1">
                  {pub.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] italic">
                  {pub.journal}
                </p>
              </div>

              {/* Link */}
              <div className="flex-shrink-0">
                <Link
                  href="/publications"
                  className="w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-300 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}