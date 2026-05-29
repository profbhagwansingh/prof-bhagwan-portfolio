"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy, Star, Award, Medal } from "lucide-react";
import api from "@/lib/api";

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: number | null;
  category: string;
}

export function AchievementsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    api.get("/api/content/achievements").then(res => {
      setAchievements(Array.isArray(res.data) ? res.data : []);
    }).catch(console.error);
  }, []);

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "award": return Trophy;
      case "fellowship": return Star;
      case "recognition": return Medal;
      default: return Award;
    }
  };

  if (achievements.length === 0) return null;

  return (
    <section className="py-section bg-[var(--bg-primary)]">
      <div className="container-academic">
        <div className="mb-14">
          <div className="accent-line">
            <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Recognition</p>
          </div>
          <h2 className="font-display text-display-md text-[var(--text-primary)]">
            Awards &amp; Achievements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((a) => {
            const Icon = getIcon(a.category);
            return (
              <div
                key={a.id}
                className="card-base p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[var(--accent-light)] flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-200">
                    <Icon className="w-5 h-5 text-primary-500 group-hover:text-white transition-colors duration-200" />
                  </div>
                  {a.year && (
                    <span className="font-display text-2xl font-bold text-[var(--border)] group-hover:text-primary-100 transition-colors">
                      {a.year}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-base font-semibold text-[var(--text-primary)] mb-2">
                  {a.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{a.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}