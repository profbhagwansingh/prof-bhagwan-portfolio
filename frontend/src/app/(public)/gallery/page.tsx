"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

interface FolderInfo {
  folder: string;
  label: string;
  count: number;
}

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState("");
  const [lightboxCaption, setLightboxCaption] = useState("");

  const [allFiles, setAllFiles] = useState<{ src: string; caption: string }[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const foldersRes = await api.get(`/api/gallery/folders?t=${Date.now()}`);
        const folders: FolderInfo[] = Array.isArray(foldersRes.data) ? foldersRes.data : [];

        if (folders.length === 0) {
          setAllFiles([]);
          setLoading(false);
          return;
        }

        const fileRequests = folders.map(f =>
          api.get(`/api/gallery/files?folder=${encodeURIComponent(f.folder)}&t=${Date.now()}`)
            .then(res => Array.isArray(res.data) ? res.data as string[] : [])
            .catch(() => [] as string[])
        );

        const folderFilesArrays = await Promise.all(fileRequests);
        
        // Flatten all files from all folders into a single array
        const combinedFiles: { src: string; caption: string }[] = [];
        folderFilesArrays.forEach(files => {
          files.forEach(src => {
            const caption = src.split('/').pop()?.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || "Gallery Image";
            combinedFiles.push({ src, caption });
          });
        });

        setAllFiles(combinedFiles);
      } catch (err) {
        console.error("Failed to fetch gallery data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  const openLightbox = (src: string, alt: string) => {
    setLightboxImg(src);
    setLightboxCaption(alt);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <main className="bg-white min-h-screen">
      <section className="text-center py-16 border-b border-gray-100 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold tracking-[0.2em] uppercase text-gray-900">THE LIBRARY</h1>
      </section>

      {loading ? (
        <div className="py-20 text-center text-gray-500 tracking-wide">
          <p>Loading gallery...</p>
        </div>
      ) : allFiles.length === 0 ? (
        <div className="py-20 text-center text-gray-500 tracking-wide">
          <p>No gallery content available.</p>
        </div>
      ) : (
        <div className="px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {(expanded ? allFiles : allFiles.slice(0, 20)).map((file, i) => {
              const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(file.src);

              return (
                <div 
                  key={i} 
                  className="relative group overflow-hidden bg-gray-100 rounded-xl cursor-pointer aspect-[4/3]"
                  onClick={() => !isVideo && openLightbox(file.src, file.caption)}
                >
                  {isVideo ? (
                     <a href={file.src} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                        <div className="w-full h-full flex items-center justify-center bg-[#111]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
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
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        <span className="text-white font-medium text-xs sm:text-sm tracking-wide line-clamp-2">{file.caption}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {allFiles.length > 20 && (
            <div className="mt-12 text-center">
              <button 
                className="text-sm font-semibold tracking-widest uppercase border border-gray-900 text-gray-900 px-8 py-3 hover:bg-gray-900 hover:text-white transition-colors duration-300" 
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'View Less' : `View More (${allFiles.length - 20} more)`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-5 right-6 text-white/80 hover:text-white text-4xl font-light transition-colors z-10"
            onClick={closeLightbox}
          >
            &times;
          </button>
          <img 
            src={lightboxImg} 
            alt={lightboxCaption} 
            className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-0 right-0 text-center text-white/80 text-lg tracking-wide">
            {lightboxCaption}
          </div>
        </div>
      )}
    </main>
  );
}