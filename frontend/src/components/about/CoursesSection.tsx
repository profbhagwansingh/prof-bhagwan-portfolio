"use client";

import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";

const courses = [
  { name: "Strategic Management",          category: "PG" },
  { name: "Marketing Management",          category: "PG" },
  { name: "Human Resource Management",     category: "PG" },
  { name: "Research Methodology",          category: "PG" },
  { name: "Organisational Behaviour",      category: "UG" },
  { name: "Business Communication",        category: "UG" },
  { name: "International Business",        category: "PG" },
  { name: "Entrepreneurship Development",  category: "UG" },
  { name: "Corporate Social Responsibility", category: "PG" },
  { name: "Business Ethics",               category: "UG" },
  { name: "Principles of Management",      category: "UG" },
  { name: "Marketing Research",            category: "PG" },
];

const categoryColors: Record<string, string> = {
  PG: "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950 dark:text-primary-300",
  UG: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
};

export function CoursesSection() {
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
            <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Pedagogy</p>
          </div>
          <h2 className="font-display text-display-md text-[var(--text-primary)]">
            Courses Taught
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, i) => (
            <div
              key={course.name}
              className="card-base p-5 flex items-center justify-between gap-4 group transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(20px)",
                transitionDelay: `${i * 50}ms`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 transition-colors">
                  <FileText className="w-4 h-4 text-primary-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-medium text-[var(--text-soft)]">{course.name}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${categoryColors[course.category]}`}>
                {course.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}