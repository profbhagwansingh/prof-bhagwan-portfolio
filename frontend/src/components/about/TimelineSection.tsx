"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

import api from "@/lib/api";

interface TimelineItem {
  id: string;
  title: string;
  subtitle: string | null;
  organization: string;
  location: string | null;
  dateRange: string;
  externalLink: string | null;
}

export function TimelineSection() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  useEffect(() => {
    api.get("/api/content/timeline").then(res => {
      setTimeline(Array.isArray(res.data) ? res.data : []);
    }).catch(console.error);
  }, []);

  if (timeline.length === 0) return null;

  return (
    <section className="py-section bg-[var(--bg-primary)]">
      <div className="container-academic">
        <div className="mb-14">
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
                key={item.id}
                className="relative flex gap-8"
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
                      {item.subtitle && (
                        <p className="text-sm text-[var(--text-muted)] mb-3">{item.subtitle}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-soft)]">
                        <span className="font-medium text-[var(--text-primary)]">{item.organization}</span>
                        {item.location && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                            <span>{item.location}</span>
                          </>
                        )}
                        <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                        <span className="font-display font-medium text-primary-500">
                          {item.dateRange}
                        </span>
                      </div>
                    </div>
                    {item.externalLink && (
                      <a
                        href={item.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors bg-primary-50 px-3 py-1.5 rounded-lg"
                      >
                        Visit <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
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