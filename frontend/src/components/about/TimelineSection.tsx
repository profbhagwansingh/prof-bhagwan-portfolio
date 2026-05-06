"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

const timeline = [
  {
    title: "Professor & Head of Department",
    organization: "DSMM College",
    location: "India",
    dateRange: "2010 — Present",
    subtitle: "Department of Management Studies",
    link: "",
  },
  {
    title: "Associate Professor",
    organization: "DSMM College",
    location: "India",
    dateRange: "2005 — 2010",
    subtitle: "Teaching UG & PG Management Programmes",
    link: "",
  },
  {
    title: "Assistant Professor",
    organization: "Institute of Management",
    location: "India",
    dateRange: "2000 — 2005",
    subtitle: "Marketing & Strategic Management",
    link: "",
  },
  {
    title: "PhD in Management",
    organization: "University",
    location: "India",
    dateRange: "1997 — 2001",
    subtitle: "Doctoral Research in Management Studies",
    link: "",
  },
  {
    title: "MBA (Gold Medallist)",
    organization: "University",
    location: "India",
    dateRange: "1995 — 1997",
    subtitle: "Master of Business Administration",
    link: "",
  },
];

export function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-section bg-[var(--bg-primary)]">
      <div className="container-academic">
        <div
          className="mb-14 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)" }}
        >
          <div className="accent-line">
            <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Career Journey</p>
          </div>
          <h2 className="font-display text-display-md text-[var(--text-primary)]">
            Professional Timeline
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-[var(--border)] hidden md:block" />

          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div
                key={i}
                className="relative flex gap-8 transition-all duration-700"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateX(-24px)",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                {/* Dot */}
                <div className="hidden md:flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] border-2 border-primary-500 flex items-center justify-center z-10 shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                  </div>
                </div>

                {/* Card */}
                <div className="card-base p-6 flex-1 hover:shadow-card-hover">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-primary-500 font-medium text-sm mb-1">
                        {item.organization} · {item.location}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">{item.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="px-3 py-1 rounded-full bg-[var(--accent-light)] text-primary-600 text-xs font-medium border border-primary-200">
                        {item.dateRange}
                      </span>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-300 transition-all">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}