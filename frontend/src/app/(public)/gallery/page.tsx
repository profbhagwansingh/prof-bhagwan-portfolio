"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

interface FolderInfo {
  folder: string;
  label: string;
  count: number;
}

interface FolderData {
  info: FolderInfo;
  files: string[];
  expanded: boolean;
}

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState("");
  const [lightboxCaption, setLightboxCaption] = useState("");

  const [folderData, setFolderData] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const foldersRes = await api.get(`/api/gallery/folders?t=${Date.now()}`);
        const folders: FolderInfo[] = Array.isArray(foldersRes.data) ? foldersRes.data : [];

        if (folders.length === 0) {
          setFolderData([]);
          setLoading(false);
          return;
        }

        const fileRequests = folders.map(f =>
          api.get(`/api/gallery/files?folder=${encodeURIComponent(f.folder)}&t=${Date.now()}`)
            .then(res => Array.isArray(res.data) ? res.data as string[] : [])
            .catch(() => [] as string[])
        );

        const allFiles = await Promise.all(fileRequests);

        const combined: FolderData[] = folders
          .map((info, i) => ({
            info,
            files: allFiles[i],
            expanded: false,
          }))
          .filter(fd => fd.files.length > 0);

        setFolderData(combined);
      } catch (err) {
        console.error("Failed to fetch gallery data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  const toggleExpand = (index: number) => {
    setFolderData(prev =>
      prev.map((fd, i) => i === index ? { ...fd, expanded: !fd.expanded } : fd)
    );
  };

  const openLightbox = (src: string, alt: string) => {
    setLightboxImg(src);
    setLightboxCaption(alt);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const formatCaption = (filename: string) => {
    return filename.split('/').pop()?.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || "Gallery Image";
  };

  return (
    <main className="bg-[#fcfcfc] min-h-screen">
      <section className="gallery-section text-center py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">THE LIBRARY</h1>
      </section>

      {loading ? (
        <div className="media-category">
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading gallery...</p>
        </div>
      ) : folderData.length === 0 ? (
        <div className="media-category">
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No gallery content available.</p>
        </div>
      ) : (
        <div className="px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
          {folderData.map((fd, index) => (
            <div key={fd.info.folder} className="mb-16">
              <h2 className="text-2xl uppercase tracking-wider mb-8 text-gray-800 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-gray-400"></span>
                {fd.info.label}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[250px] md:auto-rows-[300px] gap-4">
                {(fd.expanded ? fd.files : fd.files.slice(0, 6)).map((src, i) => {
                  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);
                  
                  // Bento grid span logic matching the image (1, 2, 1 | 2, 1, 1)
                  let spanClass = "col-span-1";
                  if (i % 6 === 1 || i % 6 === 3) {
                    spanClass = "md:col-span-2";
                  }

                  const caption = formatCaption(src);

                  return (
                    <div 
                      key={i} 
                      className={`relative group overflow-hidden bg-gray-100 cursor-pointer ${spanClass}`}
                      onClick={() => !isVideo && openLightbox(src, caption)}
                    >
                      {isVideo ? (
                         <a href={src} target="_blank" rel="noopener noreferrer" className="w-full h-full block relative">
                            <div className="w-full h-full flex items-center justify-center bg-[#111]">
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                         </a>
                      ) : (
                        <>
                          <img 
                            src={src} 
                            alt={caption} 
                            loading="lazy" 
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white text-sm md:text-base font-medium tracking-wide truncate">{caption}</h3>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {fd.files.length > 6 && (
                <div className="mt-8">
                  <button 
                    className="text-sm font-medium tracking-wide uppercase border border-gray-300 px-6 py-2 hover:bg-gray-100 transition-colors" 
                    onClick={() => toggleExpand(index)}
                  >
                    {fd.expanded ? 'View Less' : `View More (${fd.files.length - 6} more)`}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <div id="lightboxModal" className="lightbox" style={{ display: lightboxOpen ? 'flex' : 'none', zIndex: 50, position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', alignItems: 'center', justifyItems: 'center', flexDirection: 'column', padding: '20px' }}>
        <span className="close-lightbox" style={{ position: 'absolute', top: '20px', right: '30px', color: 'white', fontSize: '40px', cursor: 'pointer' }} onClick={closeLightbox}>&times;</span>
        <img className="lightbox-content" id="lightboxImg" src={lightboxImg} alt={lightboxCaption} style={{ maxHeight: '80vh', maxWidth: '100%', objectFit: 'contain', margin: 'auto' }} />
        <div id="lightboxCaption" style={{ color: 'white', textAlign: 'center', marginTop: '15px', fontSize: '18px' }}>{lightboxCaption}</div>
      </div>
    </main>
  );
}