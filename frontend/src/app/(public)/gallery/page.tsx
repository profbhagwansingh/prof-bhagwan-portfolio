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
        // Step 1: Fetch the list of admin-managed folders (only non-empty ones)
        const foldersRes = await api.get("/api/gallery/folders");
        const folders: FolderInfo[] = Array.isArray(foldersRes.data) ? foldersRes.data : [];

        if (folders.length === 0) {
          setFolderData([]);
          setLoading(false);
          return;
        }

        // Step 2: For each folder, fetch its files
        const fileRequests = folders.map(f =>
          api.get(`/api/gallery/files?folder=${encodeURIComponent(f.folder)}`)
            .then(res => Array.isArray(res.data) ? res.data as string[] : [])
            .catch(() => [] as string[])
        );

        const allFiles = await Promise.all(fileRequests);

        // Step 3: Combine into FolderData, filtering out folders with no actual files
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

  return (
    <main>
      <section className="gallery-section">
        <h1>Invest in Time with positive vibes and ROI will be always good</h1>
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
        folderData.map((fd, index) => (
          <div key={fd.info.folder} className="media-category">
            <h3 className="section-subtitle" style={{ textTransform: 'capitalize' }}>
              {fd.info.label}
            </h3>
            <div className={`collapsible-grid ${fd.expanded ? 'expanded' : ''} pt-4 pb-4`}>
              <div className="flex flex-col md:flex-row gap-3">
                {[0, 1, 2, 3].map((colIndex) => {
                  const colFiles = fd.files.filter((_, i) => i % 4 === colIndex);
                  if (colFiles.length === 0) return null;
                  return (
                    <div key={colIndex} className="flex flex-col gap-3 flex-1">
                      {colFiles.map((src, i) => {
                        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);
                        if (isVideo) {
                          return (
                            <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="media-item video-item is-visible">
                              <div style={{ width: '100%', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', borderRadius: '8px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </a>
                          );
                        }
                        return (
                          <div key={i} className="media-item is-visible" onClick={() => openLightbox(src, fd.info.label)}>
                            <img src={src} alt={fd.info.label} loading="lazy" className="rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ width: '100%', height: 'auto', display: 'block' }} />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            {fd.files.length > 12 && (
              <button className="view-more-btn" onClick={() => toggleExpand(index)}>
                {fd.expanded ? 'View Less' : `View More (${fd.files.length} images)`}
              </button>
            )}
          </div>
        ))
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