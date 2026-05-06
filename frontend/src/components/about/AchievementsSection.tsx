"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy, Star, Award, Medal } from "lucide-react";

const achievements = [
  { icon: Trophy, title: "Best Teacher Award",         year: 2022, desc: "Recognised for outstanding contribution to management education." },
  { icon: Star,   title: "Research Excellence Award",  year: 2021, desc: "Awarded for prolific research output and citation impact." },
  { icon: Award,  title: "Academic Leadership Award",  year: 2019, desc: "Honoured for leadership in curriculum development and faculty mentoring." },
  { icon: Medal,  title: "Distinguished Educator",     year: 2018, desc: "Conferred by the state education board for 20 years of service." },
  { icon: Trophy, title: "Best PhD Supervisor",        year: 2020, desc: "Awarded for mentoring the highest number of successful PhD scholars." },
  { icon: Star,   title: "Community Impact Award",     year: 2023, desc: "Recognised for CSR initiatives and community development programs." },
];

export function AchievementsSection() {
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
            <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Recognition</p>
          </div>
          <h2 className="font-display text-display-md text-[var(--text-primary)]">
            Awards &amp; Achievements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map(({ icon: Icon, title, year, desc }, i) => (
            <div
              key={title}
              className="card-base p-6 group transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(28px)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[var(--accent-light)] flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-200">
                  <Icon className="w-5 h-5 text-primary-500 group-hover:text-white transition-colors duration-200" />
                </div>
                <span className="font-display text-2xl font-bold text-[var(--border)] group-hover:text-primary-100 transition-colors">
                  {year}
                </span>
              </div>
              <h3 className="font-display text-base font-semibold text-[var(--text-primary)] mb-2">
                {title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}