"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FileText, Loader2, Search, Filter, BookOpen, Calendar, BookMarked } from "lucide-react";
import api from "@/lib/api";

type Tag = "SCOPUS" | "PEER_REVIEWED" | "UGC_CARE" | "UGC_APPROVED" | "CONFERENCE" | "ALL";

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  tag: Tag;
  authors: string;
  externalUrl?: string;
}

interface BookChapter {
  id: string;
  slNo: number;
  title: string;
  authors: string;
  publisher: string;
  isbn: string;
  year: number;
}

interface Book {
  id: string;
  title: string;
  subtitle: string | null;
  year: number;
  isbn: string | null;
  purchaseUrl: string | null;
  coverImageUrl: string | null;
  sortOrder: number;
}

const tagConfig: Record<string, { bg: string; text: string; border: string }> = {
  SCOPUS:        { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
  PEER_REVIEWED: { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
  UGC_CARE:      { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A" },
  UGC_APPROVED:  { bg: "#FFFBEB", text: "#D97706", border: "#FBBF24" },
  CONFERENCE:    { bg: "#FAF5FF", text: "#9333EA", border: "#E9D5FF" },
};

const tagLabels: Record<string, string> = {
  SCOPUS: "Scopus",
  PEER_REVIEWED: "Peer Reviewed",
  UGC_CARE: "UGC Care",
  UGC_APPROVED: "UGC Approved",
  CONFERENCE: "Conference",
};

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const [booksLoading, setBooksLoading] = useState(true);
  const [filterTag, setFilterTag] = useState<Tag | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.get("/api/publications")
      .then(res => {
        if (Array.isArray(res.data?.value)) {
          setPublications(res.data.value);
        } else if (Array.isArray(res.data)) {
          setPublications(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    api.get("/api/publications/chapters")
      .then(res => {
        if (Array.isArray(res.data)) setChapters(res.data);
      })
      .catch(console.error)
      .finally(() => setChaptersLoading(false));

    api.get("/api/publications/books")
      .then(res => {
        if (Array.isArray(res.data)) setBooks(res.data);
      })
      .catch(console.error)
      .finally(() => setBooksLoading(false));
  }, []);

  const tags = ["ALL", "SCOPUS", "PEER_REVIEWED", "UGC_CARE", "UGC_APPROVED"];

  const filteredPubs = publications.filter(p => {
    const matchTag = filterTag === "ALL" || p.tag === filterTag;
    const matchSearch = searchQuery === "" || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.journal && p.journal.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.authors && p.authors.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTag && matchSearch;
  });

  // Stats
  const totalPubs = publications.length;
  const scopusCount = publications.filter(p => p.tag === "SCOPUS").length;
  const peerCount = publications.filter(p => p.tag === "PEER_REVIEWED").length;
  const ugcCareCount = publications.filter(p => p.tag === "UGC_CARE").length;
  const ugcApprovedCount = publications.filter(p => p.tag === "UGC_APPROVED").length;
  const yearSpan = publications.length > 0 
    ? `${Math.min(...publications.map(p => p.year))} – ${Math.max(...publications.map(p => p.year))}` 
    : "";

  return (
    <main>
      {/* Hero Banner */}
      <section style={{
        background: "linear-gradient(135deg, #1B264F 0%, #3B4F9A 50%, #5061C4 100%)",
        padding: "60px 20px 50px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "250px", height: "250px", borderRadius: "50%",
          background: "rgba(255,255,255,0.05)"
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "200px", height: "200px", borderRadius: "50%",
          background: "rgba(255,255,255,0.03)"
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "900px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
            padding: "8px 20px", borderRadius: "50px", marginBottom: "20px",
            fontSize: "0.9rem", color: "rgba(255,255,255,0.9)"
          }}>
            <FileText size={16} />
            <span>Prof. (Dr.) Bhagwan Singh</span>
          </div>

          <h1 style={{
            color: "white", fontSize: "2.5rem", fontWeight: "700",
            marginBottom: "15px", lineHeight: 1.3
          }}>
            Publications & Research
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.8)", fontSize: "1.1rem",
            maxWidth: "700px", margin: "0 auto 30px"
          }}>
            A selection of research papers published in peer-reviewed, Scopus-indexed, UGC Approved, and UGC Care listed journals, along with authored books and book chapters.
          </p>

          {/* Stats Pills */}
          <div style={{
            display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap"
          }}>
            {[
              { label: "Total Papers", value: totalPubs },
              { label: "Scopus", value: scopusCount },
              { label: "Peer Reviewed", value: peerCount },
              { label: "UGC Care", value: ugcCareCount },
              { label: "UGC Approved", value: ugcApprovedCount },
              { label: "Years", value: yearSpan },
            ].map(stat => (
              <div key={stat.label} style={{
                background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                padding: "12px 24px", borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)"
              }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "white" }}>{stat.value}</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section style={{
        position: "relative", marginTop: "-25px", zIndex: 10,
        padding: "0 20px", maxWidth: "1400px", margin: "-25px auto 0"
      }}>
        <div style={{
          background: "white", borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          padding: "20px 30px",
          display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap"
        }}>
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "#f5f5f5", borderRadius: "10px", padding: "10px 15px",
            flex: "1 1 250px", minWidth: "200px"
          }}>
            <Search size={18} color="#888" />
            <input
              type="text"
              placeholder="Search publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none", background: "transparent", outline: "none",
                fontSize: "0.95rem", width: "100%", color: "#333"
              }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <Filter size={16} color="#888" />
            {tags.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterTag(cat as Tag | "ALL")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: filterTag === cat ? "2px solid #5061C4" : "1px solid #ddd",
                  background: filterTag === cat ? "#EEF0FF" : "white",
                  color: filterTag === cat ? "#5061C4" : "#666",
                  fontWeight: filterTag === cat ? "600" : "400",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap"
                }}
              >
                {cat === "ALL" ? "All Types" : tagLabels[cat] || cat}
              </button>
            ))}
          </div>

          <span style={{ fontSize: "0.85rem", color: "#888", marginLeft: "auto", whiteSpace: "nowrap" }}>
            Showing {filteredPubs.length} of {publications.length}
          </span>
        </div>
      </section>

      {/* Publications Table */}
      <section style={{ padding: "40px 20px 60px", maxWidth: "1400px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#1e1b4b", marginBottom: "20px" }}>
            Journal Publications
          </h2>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
              <div style={{
                width: "40px", height: "40px", border: "4px solid #eee",
                borderTopColor: "#5061C4", borderRadius: "50%",
                animation: "spin 1s linear infinite", margin: "0 auto 15px"
              }} />
              <p>Loading publications...</p>
              <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%", borderCollapse: "separate", borderSpacing: "0",
                background: "white", borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                overflow: "hidden"
              }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, #1B264F, #3B4F9A)" }}>
                    <th style={{ padding: "16px 20px", color: "white", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", width: "60px" }}>S.No</th>
                    <th style={{ padding: "16px 20px", color: "white", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Title & Authors</th>
                    <th style={{ padding: "16px 20px", color: "white", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", width: "250px" }}>Journal</th>
                    <th style={{ padding: "16px 20px", color: "white", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", width: "160px" }}>Type</th>
                    <th style={{ padding: "16px 20px", color: "white", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", width: "100px" }}>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPubs.map((pub, index) => {
                    const styleConfig = tagConfig[pub.tag] || tagConfig.PEER_REVIEWED;
                    return (
                      <tr
                        key={pub.id}
                        style={{
                          background: index % 2 === 0 ? "#fff" : "#FAFBFF",
                          borderBottom: "1px solid #f0f0f0",
                          transition: "background 0.2s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#EEF0FF"}
                        onMouseOut={(e) => e.currentTarget.style.background = index % 2 === 0 ? "#fff" : "#FAFBFF"}
                      >
                        <td style={{ padding: "16px 20px", textAlign: "center", fontWeight: "700", color: "#5061C4", fontSize: "1rem" }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <p style={{ color: "#333", fontSize: "0.93rem", lineHeight: "1.6", fontWeight: "500", margin: 0 }}>
                            {pub.title}
                          </p>
                          {pub.authors && pub.authors !== "." && (
                            <p style={{ color: "#666", fontSize: "0.85rem", marginTop: "4px", margin: 0 }}>
                              {pub.authors}
                            </p>
                          )}
                          {pub.externalUrl && (
                            <a href={pub.externalUrl} target="_blank" rel="noreferrer" style={{ 
                              display: "inline-flex", alignItems: "center", gap: "4px", 
                              color: "#2563EB", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px",
                              marginTop: "8px", textDecoration: "none"
                            }}>
                              View PDF <ExternalLink size={12} />
                            </a>
                          )}
                        </td>
                        <td style={{ padding: "16px 20px", color: "#666", fontSize: "0.9rem", lineHeight: "1.6", fontStyle: "italic" }}>
                          {pub.journal}
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <span style={{
                            display: "inline-block", padding: "5px 12px", borderRadius: "20px",
                            fontSize: "0.78rem", fontWeight: "600", whiteSpace: "nowrap",
                            background: styleConfig.bg, color: styleConfig.text, border: `1px solid ${styleConfig.border}`
                          }}>
                            {tagLabels[pub.tag] || pub.tag.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center", fontSize: "0.88rem", color: "#666", fontWeight: "600" }}>
                          {pub.year}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredPubs.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#888", fontSize: "1.1rem" }}>
                  No publications match your selected filters.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Book Chapters Table */}
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#1e1b4b", marginBottom: "20px" }}>
            Book Chapters
          </h2>
          {chaptersLoading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
              <div style={{
                width: "40px", height: "40px", border: "4px solid #eee",
                borderTopColor: "#5061C4", borderRadius: "50%",
                animation: "spin 1s linear infinite", margin: "0 auto 15px"
              }} />
              <p>Loading chapters...</p>
            </div>
          ) : chapters.length === 0 ? null : (
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%", borderCollapse: "separate", borderSpacing: "0",
                background: "white", borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                overflow: "hidden"
              }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, #1B264F, #3B4F9A)" }}>
                    <th style={{ padding: "16px 20px", color: "white", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", width: "60px" }}>S.No</th>
                    <th style={{ padding: "16px 20px", color: "white", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Title & Authors</th>
                    <th style={{ padding: "16px 20px", color: "white", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", width: "250px" }}>Publisher Details</th>
                    <th style={{ padding: "16px 20px", color: "white", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", width: "160px" }}>ISBN</th>
                    <th style={{ padding: "16px 20px", color: "white", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", width: "100px" }}>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((chapter, index) => (
                    <tr
                      key={chapter.id}
                      style={{
                        background: index % 2 === 0 ? "#fff" : "#FAFBFF",
                        borderBottom: "1px solid #f0f0f0",
                        transition: "background 0.2s ease"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = "#EEF0FF"}
                      onMouseOut={(e) => e.currentTarget.style.background = index % 2 === 0 ? "#fff" : "#FAFBFF"}
                    >
                      <td style={{ padding: "16px 20px", textAlign: "center", fontWeight: "700", color: "#5061C4", fontSize: "1rem" }}>
                        {chapter.slNo}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <p style={{ color: "#333", fontSize: "0.93rem", lineHeight: "1.6", fontWeight: "500", margin: 0 }}>
                          {chapter.title}
                        </p>
                        {chapter.authors && (
                          <p style={{ color: "#666", fontSize: "0.85rem", marginTop: "4px", margin: 0 }}>
                            {chapter.authors}
                          </p>
                        )}
                      </td>
                      <td style={{ padding: "16px 20px", color: "#666", fontSize: "0.9rem", lineHeight: "1.6", fontStyle: "italic" }}>
                        {chapter.publisher}
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center", fontSize: "0.85rem", color: "#666" }}>
                        {chapter.isbn}
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center", fontSize: "0.88rem", color: "#666", fontWeight: "600" }}>
                        {chapter.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Books Authored Section */}
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#1e1b4b", marginBottom: "10px" }}>Books Authored</h2>
          <p style={{ color: "#666", fontSize: "1rem", marginBottom: "30px" }}>
            A selection of authored books focusing on digital and internet marketing strategies.
          </p>
          {booksLoading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
              <div style={{
                width: "40px", height: "40px", border: "4px solid #eee",
                borderTopColor: "#5061C4", borderRadius: "50%",
                animation: "spin 1s linear infinite", margin: "0 auto 15px"
              }} />
              <p>Loading books...</p>
            </div>
          ) : books.length === 0 ? (
             <div style={{ padding: "40px 20px", color: "#888", fontSize: "1.1rem" }}>
                No authored books available.
             </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "30px" }}>
              {books.map(book => (
                <a href={book.purchaseUrl || "#"} target={book.purchaseUrl ? "_blank" : "_self"} rel="noopener noreferrer" key={book.id} style={{
                  background: "white", borderRadius: "16px", padding: "24px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", gap: "24px", alignItems: "center",
                  transition: "transform 0.3s ease, boxShadow 0.3s ease",
                  textDecoration: "none", cursor: book.purchaseUrl ? "pointer" : "default"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
                >
                  <div style={{ flexShrink: 0, width: "100px", height: "140px", borderRadius: "4px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    {book.coverImageUrl ? (
                      <img src={book.coverImageUrl} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                      <BookMarked size={40} color="#ccc" />
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1e1b4b", margin: "0 0 8px", lineHeight: "1.3" }}>
                      {book.title}
                    </h4>
                    {book.subtitle && (
                      <p style={{ fontSize: "0.95rem", color: "#666", margin: "0 0 12px", lineHeight: "1.5" }}>
                        {book.subtitle}
                      </p>
                    )}
                    {book.isbn && (
                      <p style={{ fontSize: "0.85rem", color: "#888", margin: "0 0 12px", lineHeight: "1.5" }}>
                        ISBN: {book.isbn}
                      </p>
                    )}
                    <span style={{
                      display: "inline-block", padding: "6px 12px", borderRadius: "6px",
                      background: "#EEF0FF", color: "#5061C4", fontSize: "0.8rem", fontWeight: "700"
                    }}>
                      {book.year}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

      </section>
    </main>
  );
}