"use client";

import { useEffect, useState } from "react";
import { UserCircle2, GraduationCap, Briefcase } from "lucide-react";
import api from "@/lib/api";

interface Scholar {
  id: string;
  name: string;
  imageUrl: string | null;
  status: "PURSUING" | "COMPLETED";
  researchTopic: string | null;
  currentPosition: string | null;
}

export function ScholarsSection() {
  const [scholars, setScholars] = useState<Scholar[]>([]);

  useEffect(() => {
    api.get("/api/content/scholars").then(res => {
      setScholars(Array.isArray(res.data) ? res.data : []);
    }).catch(console.error);
  }, []);

  if (scholars.length === 0) return null;

  return (
    <section className="py-section bg-[var(--bg-secondary)]">
      <div className="container-academic">
        <div className="mb-14">
          <div className="accent-line">
            <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Mentorship</p>
          </div>
          <h2 className="font-display text-display-md text-[var(--text-primary)]">
            PhD Scholars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholars.map((scholar) => (
            <div
              key={scholar.id}
              onClick={() => scholar.imageUrl && window.open(scholar.imageUrl, '_blank')}
              className={`card-base p-6 group flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1 ${scholar.imageUrl ? 'cursor-pointer hover:shadow-lg' : ''}`}
            >
              <div className="flex items-center gap-4 border-b border-[var(--border)] pb-4">
                {scholar.imageUrl ? (
                  <img
                    src={scholar.imageUrl}
                    alt={scholar.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[var(--border)]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--border)] flex items-center justify-center">
                    <UserCircle2 className="w-8 h-8 text-[var(--text-muted)]" />
                  </div>
                )}
                <div>
                  <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                    {scholar.name}
                  </h3>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      scholar.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20"
                    }`}
                  >
                    {scholar.status}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {scholar.researchTopic && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide mb-1">
                      <GraduationCap className="w-3.5 h-3.5" /> Research Topic
                    </div>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                      {scholar.researchTopic}
                    </p>
                  </div>
                )}

                {scholar.currentPosition && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wide mb-1">
                      <Briefcase className="w-3.5 h-3.5" /> Current Position
                    </div>
                    <p className="text-sm text-[var(--text-primary)] font-medium">
                      {scholar.currentPosition}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
