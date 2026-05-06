"use client";

import { useEffect, useState } from "react";
import { GraduationCap, BookOpen, Award, Users } from "lucide-react";

export function AboutHero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-500/5 blur-3xl -z-10" />

      <div className="container-academic">
        <div
          className="max-w-3xl transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
        >
          <div className="accent-line">
            <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">
              Academic Profile
            </p>
          </div>
          <h1 className="font-display text-display-lg text-[var(--text-primary)] mb-6">
            About the Professor
          </h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-8 max-w-2xl">
            Prof. (Dr.) Bhagwan Singh is a dedicated management educator and researcher
            with over two decades of experience in shaping future business leaders.
            His work spans strategic management, marketing, human resources, and
            sustainability — guided always by the philosophy of care for people, planet, and peace.
          </p>

          {/* Quick facts */}
          <div className="flex flex-wrap gap-4">
            {[
              { icon: GraduationCap, text: "PhD in Management" },
              { icon: BookOpen,      text: "50+ Publications" },
              { icon: Users,         text: "PhD Supervisor" },
              { icon: Award,         text: "25+ Years Experience" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-soft)]"
              >
                <Icon className="w-4 h-4 text-primary-500" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}