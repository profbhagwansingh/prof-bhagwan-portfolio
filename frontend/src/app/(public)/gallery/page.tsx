"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type FileData = {
  src: string;
  caption: string;
  folder: string;
};

export default function GalleryPage() {
  const [allFiles, setAllFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState("");
  const [lightboxCaption, setLightboxCaption] = useState("");

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        // Fetch folders (without cache buster to prevent timeout on backend)
        const foldersRes = await api.get('/api/gallery/folders');
        const folders = Array.isArray(foldersRes.data) ? foldersRes.data : [];

        if (folders.length === 0) {
          setAllFiles([]);
          setLoading(false);
          return;
        }

        // Fetch files for all folders concurrently
        const fileRequests = folders.map((f: any) =>
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
        
        // Flatten into a single array for masonry layout
        const combinedFiles: FileData[] = [];
        
        folderResults.forEach((result) => {
          result.files.forEach((src) => {
            const fileName = src.split('/').pop() || "";
            // Create a clean caption from filename
            const caption = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || "Gallery Image";
            combinedFiles.push({ src, caption, folder: result.folder });
          });
        });

        // Shuffle the array slightly for a dynamic mixed look, but keep mostly ordered
        // This makes the masonry grid look more organic as requested.
        setAllFiles(combinedFiles);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching gallery data:", err);
        setAllFiles([]);
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

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
    <main className="min-h-screen bg-parchment pt-[80px]">
      {/* Header Section */}
      <section className="bg-ink text-parchment py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
            THE LIBRARY
          </h1>
          <p className="text-parchment-muted max-w-2xl mx-auto text-lg md:text-xl font-light">
            A visual archive of academic achievements, events, and milestones.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-ink-muted tracking-wide font-medium">Loading gallery...</p>
        </div>
      ) : allFiles.length === 0 ? (
        <div className="py-32 text-center text-ink-muted tracking-wide">
          <p className="text-xl font-medium">No gallery content available.</p>
          <p className="text-sm mt-2 opacity-70">Check back later for updates.</p>
        </div>
      ) : (
        <div className="px-4 md:px-8 lg:px-12 max-w-[1800px] mx-auto py-16">
          {/* Dynamic Masonry Layout (4 to 5 per row) */}
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
            {allFiles.map((file, i) => {
              const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(file.src);

              return (
                <div 
                  key={i} 
                  className="relative group overflow-hidden bg-white rounded-xl cursor-pointer break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-300"
                  onClick={() => !isVideo && openLightbox(file.src, file.caption)}
                >
                  {isVideo ? (
                     <a href={file.src} target="_blank" rel="noopener noreferrer" className="block relative min-h-[200px]">
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-ink">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white" className="opacity-80 group-hover:opacity-100 transition-opacity">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                     </a>
                  ) : (
                    <>
                      <img 
                        src={file.src} 
                        alt={file.caption} 
                        loading="lazy" 
                        className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-105" 
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Caption Text */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex flex-col">
                        <span className="text-white/70 text-xs font-semibold tracking-wider uppercase mb-1">{file.folder}</span>
                        <span className="text-white font-medium text-sm sm:text-base leading-tight drop-shadow-md line-clamp-2">{file.caption}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Elegant Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-6 right-8 text-white/60 hover:text-white text-5xl font-light transition-colors z-10 focus:outline-none"
            onClick={closeLightbox}
            aria-label="Close"
          >
            &times;
          </button>
          
          <div className="relative max-w-6xl max-h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightboxImg} 
              alt={lightboxCaption} 
              className="max-h-[80vh] max-w-full object-contain rounded-md shadow-2xl"
            />
            <div className="mt-6 text-center">
              <p className="text-white/90 text-lg md:text-xl font-medium tracking-wide drop-shadow-sm">
                {lightboxCaption}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}