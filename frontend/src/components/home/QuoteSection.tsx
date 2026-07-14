"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function QuoteSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-section bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden"
    >
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="container-academic relative">
        <div
          className="max-w-3xl mx-auto text-center transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)" }}
        >
          {/* Large quote mark */}
          <div className="font-display text-8xl text-white/20 leading-none mb-4 select-none">"</div>

          <blockquote className="font-display text-2xl md:text-3xl text-white leading-relaxed font-medium mb-6 -mt-8">
            Invest in Time with positive vibes and ROI will be always good
          </blockquote>

          <p className="text-primary-200 text-sm font-medium mb-10 tracking-wide">
            — Prof. (Dr.) Bhagwan Singh
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 hover:bg-primary-50 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:-translate-y-0.5"
            >
              Talk to Prof
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/alumni"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-medium text-sm transition-all duration-200"
            >
              Alumni Connect
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}