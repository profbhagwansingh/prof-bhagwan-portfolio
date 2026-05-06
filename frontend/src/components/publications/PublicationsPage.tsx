"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, BookOpen, FileText } from "lucide-react";

type Tag = "ALL" | "SCOPUS" | "PEER_REVIEWED" | "UGC_CARE" | "CONFERENCE";

const publications = [
  { tag: "SCOPUS",        year: 2023, title: "Impact of Digital Marketing on Consumer Purchase Behaviour in Emerging Markets",                   journal: "Journal of Marketing Research" },
  { tag: "PEER_REVIEWED", year: 2023, title: "Corporate Social Responsibility and Firm Value: Evidence from Indian Manufacturing",               journal: "Indian Journal of Corporate Governance" },
  { tag: "SCOPUS",        year: 2022, title: "Sustainable HRM Practices and Organisational Performance: A Systematic Review",                    journal: "International Journal of Human Resource Management" },
  { tag: "UGC_CARE",      year: 2022, title: "Entrepreneurship Ecosystem in India: Challenges and Opportunities Post-Pandemic",                  journal: "Journal of Entrepreneurship & Innovation" },
  { tag: "PEER_REVIEWED", year: 2022, title: "Leadership Styles and Employee Engagement in Higher Education Institutions",                       journal: "Management & Labour Studies" },
  { tag: "CONFERENCE",    year: 2022, title: "Digital Transformation in SMEs: A Framework for Strategic Adoption",                              journal: "International Conference on Business Strategy" },
  { tag: "SCOPUS",        year: 2021, title: "Green Marketing Strategies and Consumer Perception: A Study of FMCG Sector",                      journal: "Journal of Consumer Marketing" },
  { tag: "UGC_CARE",      year: 2021, title: "Work-Life Balance and Organisational Commitment Among Faculty Members",                           journal: "Indian Journal of Industrial Relations" },
  { tag: "PEER_REVIEWED", year: 2021, title: "Corporate Governance and Financial Performance: Evidence from BSE Listed Companies",              journal: "Finance India" },
  { tag: "SCOPUS",        year: 2020, title: "Knowledge Management and Competitive Advantage in Service Sector Firms",                          journal: "Journal of Knowledge Management" },
  { tag: "UGC_CARE",      year: 2020, title: "E-Commerce Adoption Barriers in Rural India: An Empirical Analysis",                             journal: "Asian Journal of Management" },
  { tag: "CONFERENCE",    year: 2020, title: "Sustainability Reporting Practices in Indian Corporations: A Content Analysis",                   journal: "National Conference on Sustainable Business" },
];

const tagConfig: Record<string, { label: string; class: string }> = {
  ALL:          { label: "All",          class: "" },
  SCOPUS:       { label: "Scopus",       class: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300" },
  PEER_REVIEWED:{ label: "Peer Reviewed",class: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300" },
  UGC_CARE:     { label: "UGC CARE",     class: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300" },
  CONFERENCE:   { label: "Conference",   class: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300" },
};

const books = [
  { title: "Strategic Management: Theory & Practice",             year: 2022, color: "from-primary-500 to-primary-700" },
  { title: "Marketing Management in the Digital Age",             year: 2021, color: "from-emerald-500 to-emerald-700" },
  { title: "Human Resource Management: A Values Approach",        year: 2020, color: "from-amber-500 to-amber-700" },
  { title: "Research Methodology for Management Studies",         year: 2019, color: "from-rose-500 to-rose-700" },
];

export function PublicationsPage() {
  const [activeTag, setActiveTag] = useState<Tag>("ALL");
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const filtered = activeTag === "ALL"
    ? publications
    : publications.filter((p) => p.tag === activeTag);

  const grouped = filtered.reduce<Record<number, typeof publications>>((acc, pub) => {
    (acc[pub.year] ??= []).push(pub);
    return acc;
  }, {});

  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)]">
        <div className="container-academic">
          <div
            className="max-w-3xl transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
          >
            <div className="accent-line">
              <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Research Output</p>
            </div>
            <h1 className="font-display text-display-lg text-[var(--text-primary)] mb-6">
              Publications &amp; Research
            </h1>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed">
              A body of scholarly work spanning strategic management, marketing, human resources,
              sustainability, and entrepreneurship — contributing to academic knowledge and industry practice.
            </p>
          </div>
        </div>
      </section>

      {/* Publications List */}
      <section className="py-section bg-[var(--bg-primary)]">
        <div className="container-academic">

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            {(Object.keys(tagConfig) as Tag[]).map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  activeTag === tag
                    ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                    : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-primary-300 hover:text-primary-500"
                }`}
              >
                {tagConfig[tag].label}
                {tag !== "ALL" && (
                  <span className="ml-2 text-xs opacity-70">
                    {publications.filter((p) => p.tag === tag).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Grouped by Year */}
          <div className="space-y-12" ref={ref}>
            {years.map((year) => (
              <div key={year}>
                {/* Year heading */}
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">{year}</h2>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <span className="text-sm text-[var(--text-muted)]">
                    {grouped[year].length} paper{grouped[year].length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {grouped[year].map((pub, i) => (
                    <div
                      key={i}
                      className="card-base p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary-500" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${tagConfig[pub.tag].class}`}>
                            {tagConfig[pub.tag].label}
                          </span>
                        </div>
                        <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] leading-snug mb-0.5">
                          {pub.title}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] italic">{pub.journal}</p>
                      </div>

                      <button className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-300 transition-all flex-shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-section bg-[var(--bg-secondary)]">
        <div className="container-academic">
          <div className="mb-14">
            <div className="accent-line">
              <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Authored Works</p>
            </div>
            <h2 className="font-display text-display-md text-[var(--text-primary)]">Books Published</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book, i) => (
              <div key={i} className="card-base overflow-hidden group">
                <div className={`h-44 bg-gradient-to-br ${book.color} flex items-center justify-center relative`}>
                  <BookOpen className="w-14 h-14 text-white/40" />
                  <span className="absolute top-3 right-3 font-display text-white/80 text-sm font-bold">{book.year}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] leading-snug">
                    {book.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}