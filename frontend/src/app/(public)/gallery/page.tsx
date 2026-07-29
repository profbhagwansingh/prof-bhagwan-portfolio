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
    <main className="bg-white min-h-screen">
      <section className="text-center py-16 border-b border-gray-100 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold tracking-[0.2em] uppercase text-gray-900">THE LIBRARY</h1>
      </section>

      {loading ? (
        <div className="py-20 text-center text-gray-500 tracking-wide">
          <p>Loading gallery...</p>
        </div>
      ) : folderData.length === 0 ? (
        <div className="py-20 text-center text-gray-500 tracking-wide">
          <p>No gallery content available.</p>
        </div>
      ) : (
        <div className="px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto py-16">
          {folderData.map((fd, index) => (
            <div key={fd.info.folder} className="mb-24">
              <h2 className="text-xl md:text-2xl uppercase tracking-widest mb-10 text-gray-800 flex items-center gap-6">
                <span className="w-12 h-[2px] bg-gray-900"></span>
                {fd.info.label}
              </h2>

              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {(fd.expanded ? fd.files : fd.files.slice(0, 12)).map((src, i) => {
                  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);
                  const caption = formatCaption(src);

                  return (
                    <div 
                      key={i} 
                      className="relative group break-inside-avoid overflow-hidden bg-gray-50 cursor-pointer"
                      onClick={() => !isVideo && openLightbox(src, caption)}
                    >
                      {isVideo ? (
                         <a href={src} target="_blank" rel="noopener noreferrer" className="w-full block relative" style={{ aspectRatio: '16/9' }}>
                            <div className="w-full h-full flex items-center justify-center bg-[#111]">
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                         </a>
                      ) : (
                        <img 
                          src={src} 
                          alt={caption} 
                          loading="lazy" 
                          className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-105" 
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {fd.files.length > 10 && (
                <div className="mt-12 text-center">
                  <button 
                    className="text-sm font-semibold tracking-widest uppercase border border-gray-900 text-gray-900 px-8 py-3 hover:bg-gray-900 hover:text-white transition-colors duration-300" 
                    onClick={() => toggleExpand(index)}
                  >
                    {fd.expanded ? 'View Less' : `View More (${fd.files.length - 10} more)`}
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