"use client";

import { useEffect, useRef, useState } from "react";
import {
  TrendingUp, Users, Globe, BookOpen,
  BarChart3, Lightbulb, Heart, Leaf
} from "lucide-react";
import { cn } from "@/lib/utils";

const expertiseAreas = [
  { icon: TrendingUp, title: "Strategic Management",     desc: "Corporate strategy, competitive dynamics, and organizational transformation." },
  { icon: BarChart3,  title: "Marketing Management",     desc: "Consumer behaviour, brand management, and digital marketing strategies." },
  { icon: Users,      title: "Human Resource Mgmt.",     desc: "Talent development, organizational behaviour, and leadership studies." },
  { icon: Globe,      title: "International Business",   desc: "Global trade, cross-cultural management, and international strategy." },
  { icon: Lightbulb,  title: "Entrepreneurship",         desc: "Startup ecosystems, innovation management, and venture development." },
  { icon: BookOpen,   title: "Research Methodology",     desc: "Quantitative & qualitative research, data analysis, and academic writing." },
  { icon: Heart,      title: "CSR & Ethics",             desc: "Corporate social responsibility, business ethics, and sustainable governance." },
  { icon: Leaf,       title: "Sustainability",           desc: "Green business practices, ESG frameworks, and environmental management." },
];

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

export function ExpertiseSection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="py-section bg-[var(--bg-secondary)]">
      <div className="container-academic">

        {/* Header */}
        <div
          className="mb-14 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)" }}
        >
          <div className="accent-line">
            <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Areas of Expertise</p>
          </div>
          <h2 className="font-display text-display-md text-[var(--text-primary)] max-w-lg">
            Teaching & Research Specialisations
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {expertiseAreas.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="card-base p-6 group cursor-default transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(28px)",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors duration-200">
                <Icon className="w-5 h-5 text-primary-500 group-hover:text-white transition-colors duration-200" />
              </div>
              <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] mb-2 leading-snug">
                {title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}