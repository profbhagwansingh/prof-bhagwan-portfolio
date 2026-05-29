"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Loader2, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

type FolderInfo = { folder: string; label: string; count: number };

export function GalleryPage() {
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [foldersLoading, setFoldersLoading] = useState(true);
  
  const [activeFolder, setActiveFolder] = useState<string>("ALL"); // "ALL" means show all folders, or specific folder name
  
  const [allFiles, setAllFiles] = useState<string[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  // 1. Fetch folders on mount
  useEffect(() => {
    let active = true;
    const loadFolders = async () => {
      try {
        const { data } = await api.get("/api/gallery/admin/folders");
        if (active) {
          setFolders(Array.isArray(data) ? data : []);
          setFoldersLoading(false);
        }
      } catch (e) {
        if (active) setFoldersLoading(false);
      }
    };
    loadFolders();
    return () => { active = false; };
  }, []);

  // 2. Fetch files when active folder changes
  useEffect(() => {
    let active = true;
    const loadFiles = async () => {
      setFilesLoading(true);
      setAllFiles([]);
      try {
        if (activeFolder === "ALL") {
          // Fetch all files from all folders in parallel
          const promises = folders.map(f => api.get(`/api/gallery/admin/files?folder=${encodeURIComponent(f.folder)}`));
          const responses = await Promise.all(promises);
          if (active) {
            const combined = responses.flatMap(r => Array.isArray(r.data) ? r.data : []);
            setAllFiles(combined);
          }
        } else {
          const { data } = await api.get(`/api/gallery/admin/files?folder=${encodeURIComponent(activeFolder)}`);
          if (active) setAllFiles(Array.isArray(data) ? data : []);
        }
      } catch (e) {
      } finally {
        if (active) setFilesLoading(false);
      }
    };
    
    // Only load if folders are loaded (so ALL can know what to fetch)
    if (!foldersLoading) {
      loadFiles();
    }
    return () => { active = false; };
  }, [activeFolder, folders, foldersLoading]);

  // ── Lightbox Logic ──
  const openLightbox = (idx: number) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);

  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + allFiles.length) % allFiles.length));
  }, [allFiles.length]);

  const next = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % allFiles.length));
  }, [allFiles.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeLightbox();
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
      <section className="py-section bg-[var(--bg-primary)] min-h-[50vh]">
        <div className="container-academic">

          {foldersLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Folder Tabs */}
              <div className="flex flex-wrap gap-2 mb-12">
                <button
                  onClick={() => setActiveFolder("ALL")}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 capitalize",
                    activeFolder === "ALL"
                      ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                      : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-primary-300 hover:text-primary-500"
                  )}
                >
                  <ImageIcon className="w-4 h-4" />
                  All Media
                  <span className="text-xs opacity-70">
                    {folders.reduce((acc, f) => acc + f.count, 0)}
                  </span>
                </button>
                {folders.map((f) => (
                  <button
                    key={f.folder}
                    onClick={() => setActiveFolder(f.folder)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 capitalize",
                      activeFolder === f.folder
                        ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                        : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-primary-300 hover:text-primary-500"
                    )}
                  >
                    <FolderOpen className="w-4 h-4" />
                    {f.label}
                    <span className="text-xs opacity-70">{f.count}</span>
                  </button>
                ))}
              </div>

              {/* Masonry-style Grid */}
              {filesLoading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
                  <p className="text-[var(--text-muted)] text-sm">Loading images...</p>
                </div>
              ) : allFiles.length === 0 ? (
                <div className="py-20 text-center">
                  <ImageIcon className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
                  <p className="text-[var(--text-muted)]">No images found in this folder.</p>
                </div>
              ) : (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                  {allFiles.map((fileUrl, i) => (
                    <div
                      key={fileUrl}
                      onClick={() => openLightbox(i)}
                      className="break-inside-avoid relative overflow-hidden rounded-xl cursor-pointer group shadow-sm hover:shadow-md transition-all duration-500 border border-[var(--border)] bg-[var(--bg-card)]"
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "none" : "translateY(20px)",
                        transitionDelay: `${(i % 10) * 40}ms`,
                      }}
                    >
                      <img 
                        src={fileUrl} 
                        alt={fileUrl.split("/").pop()?.replace(/\.[^.]+$/, "") || "Gallery image"}
                        loading="lazy"
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 lg:p-10"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 lg:top-6 lg:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 lg:left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            className="max-w-5xl w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={allFiles[lightbox]} 
              alt="Gallery Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white/90 text-center mt-6 font-display text-lg px-8">
              {allFiles[lightbox].split("/").pop()?.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}
            </p>
            <p className="text-white/50 text-center text-sm mt-1">
              {lightbox + 1} / {allFiles.length}
            </p>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 lg:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
}