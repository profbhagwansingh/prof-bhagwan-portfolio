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
        // Fetch folders (without cache buster to prevent timeout on backend)
        const foldersRes = await api.get('/api/gallery/folders');
        const folders = Array.isArray(foldersRes.data) ? foldersRes.data : [];

        if (folders.length === 0) {
          setFolderData([]);
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
        
        // Map the results to our sectioned structure
        const combinedData = folderResults.map((result) => {
          const files = result.files.map((src) => {
            const fileName = src.split('/').pop() || "";
            const caption = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || "Gallery Image";
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
      ) : folderData.length === 0 ? (
        <div className="py-32 text-center text-ink-muted tracking-wide">
          <p className="text-xl font-medium">No gallery content available.</p>
          <p className="text-sm mt-2 opacity-70">Check back later for updates.</p>
        </div>
        <div className="px-4 md:px-8 lg:px-12 max-w-[1800px] mx-auto py-16 space-y-24">
          <style dangerouslySetInnerHTML={{__html: `
            .custom-gallery-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
            }
            @media (min-width: 640px) { .custom-gallery-grid { grid-template-columns: repeat(3, 1fr); } }
            @media (min-width: 768px) { .custom-gallery-grid { grid-template-columns: repeat(4, 1fr); } }
            @media (min-width: 1024px) { .custom-gallery-grid { grid-template-columns: repeat(5, 1fr); } }
            
            .custom-gallery-item {
              aspect-ratio: 1 / 1;
              width: 100%;
              position: relative;
              overflow: hidden;
              border-radius: 12px;
              background-color: #f3f4f6;
              cursor: pointer;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              transition: box-shadow 0.3s ease;
            }
            .custom-gallery-item:hover {
              box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            }
            
            .custom-gallery-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.5s ease-out;
            }
            .custom-gallery-item:hover .custom-gallery-img {
              transform: scale(1.1);
            }
          `}} />
          
          {folderData.map((folder, folderIdx) => {
            if (!folder.files || folder.files.length === 0) return null;
            return (
              <div key={folderIdx} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-ink capitalize tracking-tight">
                    {folder.folder}
                  </h2>
                  <div className="h-px bg-ink/10 flex-1"></div>
                  <span className="text-sm font-medium text-ink-muted bg-ink/5 px-3 py-1 rounded-full">
                    {folder.files.length} {folder.files.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
                
                <div className="custom-gallery-grid">
                  {folder.files.map((file, i) => {
                    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(file.src);

                    return (
                      <div 
                        key={i} 
                        className="custom-gallery-item group"
                        onClick={() => !isVideo && openLightbox(file.src, file.caption)}
                      >
                        {isVideo ? (
                           <a href={file.src} target="_blank" rel="noopener noreferrer" className="block relative w-full h-full">
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
                              className="custom-gallery-img" 
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            
                            {/* Caption Text */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex flex-col pointer-events-none">
                              <span className="text-white font-medium text-xs sm:text-sm leading-tight drop-shadow-md line-clamp-2">{file.caption}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
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