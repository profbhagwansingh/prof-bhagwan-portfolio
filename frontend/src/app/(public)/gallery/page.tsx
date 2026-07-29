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

  const [allImages, setAllImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const foldersRes = await api.get("/api/gallery/folders");
        const folders: FolderInfo[] = Array.isArray(foldersRes.data) ? foldersRes.data : [];

        if (folders.length === 0) {
          setAllImages([]);
          setLoading(false);
          return;
        }

        const fileRequests = folders.map(f =>
          api.get(`/api/gallery/files?folder=${encodeURIComponent(f.folder)}`)
            .then(res => Array.isArray(res.data) ? res.data as string[] : [])
            .catch(() => [] as string[])
        );

        const allFilesArrays = await Promise.all(fileRequests);
        const combinedFiles = allFilesArrays.flat();

        setAllImages(combinedFiles);
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
    <main>
      <section className="gallery-section">
        <h1>Invest in Time with positive vibes and ROI will be always good</h1>
      </section>

      {loading ? (
        <div className="media-category">
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading gallery...</p>
        </div>
      ) : allImages.length === 0 ? (
        <div className="media-category">
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No gallery content available.</p>
        </div>
      ) : (
        <div className="media-category" style={{ padding: '0 2rem' }}>
          <div className={`collapsible-grid ${expanded ? 'expanded' : ''} pt-4 pb-8`}>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Using 4 columns for desktop to ensure images are reasonably sized in the collage */}
              {[0, 1, 2, 3].map((colIndex) => {
                const colFiles = allImages.filter((_, i) => i % 4 === colIndex);
                if (colFiles.length === 0) return null;
                return (
                  <div key={colIndex} className="flex flex-col gap-4 flex-1">
                    {colFiles.map((src, i) => {
                      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);
                      if (isVideo) {
                        return (
                          <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="media-item video-item is-visible overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block">
                            <div style={{ width: '100%', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </a>
                        );
                      }
                      return (
                        <div key={i} className="media-item is-visible overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer bg-slate-100" onClick={() => openLightbox(src, "Gallery Collage")}>
                          <img src={src} alt="Gallery Collage" loading="lazy" className="w-full h-auto block hover:scale-105 transition-transform duration-700 ease-out" />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          {allImages.length > 20 && (
            <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
              <button className="view-more-btn" onClick={() => setExpanded(!expanded)} style={{ margin: '0 auto' }}>
                {expanded ? 'View Less' : `View More (${allImages.length} images)`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      <div id="lightboxModal" className="lightbox" style={{ display: lightboxOpen ? 'flex' : 'none' }}>
        <span className="close-lightbox" onClick={closeLightbox}>&times;</span>
        <img className="lightbox-content" id="lightboxImg" src={lightboxImg} alt={lightboxCaption} />
        <div id="lightboxCaption">{lightboxCaption}</div>
      </div>
    </main>
  );
}