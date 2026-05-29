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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div
          className="transition-all duration-700"
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
            With a career spanning over 25 years, Prof. (Dr.) Bhagwan Singh is a renowned academic in the field of management. He currently serves as a Professor in the Department of Business Administration (DBA), School of Management Sciences (SMS) at the Central University of Jharkhand (CUJ), where he has also held key positions including Dean, Head of Department, and Finance Officer (I/c).
            <br/><br/>
            His research primarily focuses on the intersection of Marketing and Information Technology. He has published over 54 papers in esteemed journals and has authored two influential books on digital and internet marketing.
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

        <div
          className="hidden lg:block relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 border border-[var(--border)]"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "scale(0.95) translateY(24px)" }}
        >
          <img src="/media/img/Dr_B_Singh_with_President.jpg" alt="Prof. Bhagwan Singh with President" className="w-full h-full object-cover" />
        </div>
        </div>
      </div>
    </section>
  );
}