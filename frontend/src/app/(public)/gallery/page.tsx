"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type FileData = {
  src: string;
  caption: string;
  folder: string;
};

export default function GalleryPage() {
  const [folderData, setFolderData] = useState<{ folder: string; files: FileData[] }[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState("");
  const [lightboxCaption, setLightboxCaption] = useState("");

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        // Fetch folders
        const foldersRes = await api.get('/api/gallery/folders');
        const rawFolders = Array.isArray(foldersRes.data) ? foldersRes.data : [];

        // Filter out any internal backup or private directories
        const publicFolders = rawFolders.filter((f: any) => {
          const name = (f.label || f.folder || "").toLowerCase();
          return !name.includes("backup") && 
                 !name.includes("original") && 
                 !f.folder.startsWith("_") &&
                 !f.folder.includes("/_");
        });

        if (publicFolders.length === 0) {
          setFolderData([]);
          setLoading(false);
          return;
        }

        // Fetch files for all public folders concurrently
        const fileRequests = publicFolders.map((f: any) =>
          api.get(`/api/gallery/files?folder=${encodeURIComponent(f.folder)}`)
            .then(res => ({
              folder: f.label || f.folder,
              files: Array.isArray(res.data) ? (res.data as string[]) : []
            }))
            .catch(() => ({
              folder: f.label || f.folder,
              files: [] as string[]
            }))
        );

        const folderResults = await Promise.all(fileRequests);
        
        // Map the results to clean sectioned structure
        const combinedData = folderResults.map((result) => {
          const files = result.files.map((src) => {
            const fileName = src.split('/').pop() || "";
            const caption = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || "Archival Image";
            return { src, caption, folder: result.folder };
          });
          return { folder: result.folder, files };
        });

        setFolderData(combinedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching gallery data:", err);
        setFolderData([]);
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // Keyboard navigation for lightbox (Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxOpen) {
        closeLightbox();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  const openLightbox = (imgSrc: string, caption: string) => {
    setLightboxImg(imgSrc);
    setLightboxCaption(caption);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <main className="min-h-screen bg-[#faf9f8] text-[#1a1a2e]">
      {/* ─── Stage 1 Header Section ─── */}
      <header className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 text-center border-b border-gray-200/70 bg-gradient-to-b from-white via-[#faf9f8] to-[#faf9f8]">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-[#5061C4] font-semibold mb-2">
            Academic Portfolio &bull; Visual Archive
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-[#1a1a2e] tracking-tight">
            The Library
          </h1>
          <div className="w-14 h-[3px] bg-[#5061C4] mx-auto mt-4 mb-4 rounded-full" />
          <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-xl mx-auto">
            A visual archive of academic achievements, conferences, and institutional milestones.
          </p>
        </div>
      </header>

      {/* ─── Centered Main Gallery Container (max-w-7xl) ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-3 border-[#5061C4]/20 border-t-[#5061C4] rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-500 tracking-wide">Loading library collection...</p>
          </div>
        ) : folderData.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-medium text-gray-700">No public gallery items available at this time.</p>
            <p className="text-sm text-gray-500 mt-1">Please check back soon.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {folderData.map((folder, folderIdx) => {
              if (!folder.files || folder.files.length === 0) return null;
              return (
                <section key={folderIdx} className="space-y-6">
                  {/* Album / Section Title */}
                  <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#1a1a2e] capitalize tracking-tight">
                        {folder.folder}
                      </h2>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {folder.files.length} {folder.files.length === 1 ? "Item" : "Items"}
                      </span>
                    </div>
                  </div>

                  {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3-4 on desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {folder.files.map((file, i) => {
                      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(file.src);

                      return (
                        <div
                          key={i}
                          tabIndex={0}
                          role="button"
                          aria-label={`View ${file.caption}`}
                          className="group relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5061C4] focus:ring-offset-2"
                          onClick={() => !isVideo && openLightbox(file.src, file.caption)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              if (!isVideo) openLightbox(file.src, file.caption);
                            }
                          }}
                        >
                          {isVideo ? (
                            <a
                              href={file.src}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full h-full flex items-center justify-center bg-[#1a1a2e]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="44"
                                height="44"
                                viewBox="0 0 24 24"
                                fill="white"
                                className="opacity-80 group-hover:opacity-100 transition-opacity"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </a>
                          ) : (
                            <>
                              <img
                                src={file.src}
                                alt={file.caption}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                              />
                              {/* Soft Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

                              {/* Caption */}
                              <div className="absolute bottom-0 inset-x-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                                <p className="text-white text-xs sm:text-sm font-medium line-clamp-2 drop-shadow">
                                  {file.caption}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Accessible Lightbox Modal ─── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#1a1a2e]/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            &times;
          </button>

          <div
            className="relative max-w-5xl max-h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg}
              alt={lightboxCaption}
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            {lightboxCaption && (
              <div className="mt-4 text-center px-4">
                <p className="text-white/95 text-base sm:text-lg font-medium drop-shadow">
                  {lightboxCaption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}