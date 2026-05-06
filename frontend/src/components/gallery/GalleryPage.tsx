"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Image, Video, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "ALL" | "PHOTO" | "VIDEO" | "CLIPPING";

const galleryItems = [
  { type: "PHOTO",    caption: "Academic Conference 2023",          color: "from-blue-400 to-blue-600" },
  { type: "PHOTO",    caption: "PhD Scholar Felicitation",          color: "from-purple-400 to-purple-600" },
  { type: "PHOTO",    caption: "Guest Lecture at IIM",              color: "from-emerald-400 to-emerald-600" },
  { type: "PHOTO",    caption: "Book Launch Ceremony",              color: "from-amber-400 to-amber-600" },
  { type: "PHOTO",    caption: "Annual Management Conclave",        color: "from-rose-400 to-rose-600" },
  { type: "PHOTO",    caption: "Faculty Development Programme",     color: "from-cyan-400 to-cyan-600" },
  { type: "PHOTO",    caption: "Research Workshop 2022",            color: "from-indigo-400 to-indigo-600" },
  { type: "PHOTO",    caption: "Convocation Ceremony",              color: "from-teal-400 to-teal-600" },
  { type: "PHOTO",    caption: "International Seminar",             color: "from-orange-400 to-orange-600" },
  { type: "VIDEO",    caption: "Keynote Address — Business Summit", color: "from-primary-400 to-primary-600" },
  { type: "VIDEO",    caption: "Interview on Management Education", color: "from-violet-400 to-violet-600" },
  { type: "VIDEO",    caption: "Lecture Series: Strategic Mgmt.",   color: "from-sky-400 to-sky-600" },
  { type: "CLIPPING", caption: "Times of India — Education Feature", color: "from-slate-400 to-slate-600" },
  { type: "CLIPPING", caption: "Hindustan Times — Research Award",   color: "from-zinc-400 to-zinc-600" },
  { type: "CLIPPING", caption: "Business Standard — Profile",        color: "from-stone-400 to-stone-600" },
];

const filters: { key: Category; label: string; icon: React.ElementType }[] = [
  { key: "ALL",      label: "All Media",          icon: Image },
  { key: "PHOTO",    label: "Photos",             icon: Image },
  { key: "VIDEO",    label: "Videos",             icon: Video },
  { key: "CLIPPING", label: "Press Coverage",     icon: Newspaper },
];

export function GalleryPage() {
  const [active,      setActive]      = useState<Category>("ALL");
  const [lightbox,    setLightbox]    = useState<number | null>(null);
  const [visible,     setVisible]     = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const filtered = active === "ALL"
    ? galleryItems
    : galleryItems.filter((i) => i.type === active);

  const openLightbox  = (idx: number) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);

  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const next = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

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
              <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Visual Archive</p>
            </div>
            <h1 className="font-display text-display-lg text-[var(--text-primary)] mb-6">
              Gallery
            </h1>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed">
              A visual chronicle of academic events, conferences, lectures, felicitations,
              and media coverage across a distinguished career.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-section bg-[var(--bg-primary)]">
        <div className="container-academic">

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            {filters.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200",
                  active === key
                    ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                    : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-primary-300 hover:text-primary-500"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                <span className="text-xs opacity-70">
                  {key === "ALL" ? galleryItems.length : galleryItems.filter((i) => i.type === key).length}
                </span>
              </button>
            ))}
          </div>

          {/* Masonry-style Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {filtered.map((item, i) => (
              <div
                key={i}
                onClick={() => openLightbox(i)}
                className="break-inside-avoid card-base overflow-hidden cursor-pointer group transition-all duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(20px)",
                  transitionDelay: `${i * 40}ms`,
                }}
              >
                {/* Placeholder image */}
                <div
                  className={cn(
                    "w-full bg-gradient-to-br relative overflow-hidden",
                    item.type === "CLIPPING" ? "h-48" : i % 3 === 0 ? "h-72" : "h-56",
                    item.color
                  )}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-200" />

                  {/* Type badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
                      {item.type === "VIDEO"    && <Video    className="w-3 h-3" />}
                      {item.type === "PHOTO"    && <Image    className="w-3 h-3" />}
                      {item.type === "CLIPPING" && <Newspaper className="w-3 h-3" />}
                      {item.type}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Image className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <div className="p-4">
                  <p className="text-sm font-medium text-[var(--text-soft)]">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Image */}
          <div
            className="max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cn(
              "w-full h-96 rounded-2xl bg-gradient-to-br",
              filtered[lightbox].color
            )} />
            <p className="text-white/80 text-center mt-4 font-display text-lg">
              {filtered[lightbox].caption}
            </p>
            <p className="text-white/40 text-center text-sm mt-1">
              {lightbox + 1} / {filtered.length}
            </p>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}