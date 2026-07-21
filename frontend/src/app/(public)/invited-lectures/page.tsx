"use client";

import { useEffect, useState } from "react";
import { Mic, Filter, Search, Calendar, MapPin } from "lucide-react";
import api from "@/lib/api";

interface InvitedLecture {
  id: string;
  slNo: number;
  title: string;
  conferenceDetails: string;
  category: string;
  lectureDate: string;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "National": { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
  "International (within country)": { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
  "International": { bg: "#FDF2F8", text: "#DB2777", border: "#FBCFE8" },
  "State/University": { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A" },
};

export default function InvitedLecturesPage() {
  const [lectures, setLectures] = useState<InvitedLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.get("/api/content/invited-lectures")
      .then(res => {
        if (Array.isArray(res.data)) {
          setLectures(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ["ALL", ...Array.from(new Set(lectures.map(l => l.category)))];

  const filtered = lectures.filter(l => {
    const matchesCategory = filterCategory === "ALL" || l.category === filterCategory;
    const matchesSearch = searchQuery === "" ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.conferenceDetails.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  // Stats
  const totalLectures = lectures.length;
  const nationalCount = lectures.filter(l => l.category === "National").length;
  const internationalCount = lectures.filter(l => l.category.includes("International")).length;
  const yearSpan = lectures.length > 0
    ? `${new Date(lectures[lectures.length - 1]?.lectureDate).getFullYear()} – ${new Date(lectures[0]?.lectureDate).getFullYear()}`
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
            <Mic size={16} />
            <span>Prof. (Dr.) Bhagwan Singh</span>
          </div>

          <h1 style={{
            color: "white", fontSize: "2.5rem", fontWeight: "700",
            marginBottom: "15px", lineHeight: 1.3
          }}>
            Invited Lectures & Presentations
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.8)", fontSize: "1.1rem",
            maxWidth: "700px", margin: "0 auto 30px"
          }}>
            A comprehensive record of keynote addresses, invited talks, and conference presentations delivered across national and international forums.
          </p>

          {/* Stats Pills */}
          <div style={{
            display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap"
          }}>
            {[
              { label: "Total Lectures", value: totalLectures },
              { label: "National", value: nationalCount },
              { label: "International", value: internationalCount },
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
              placeholder="Search lectures..."
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
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: filterCategory === cat ? "2px solid #5061C4" : "1px solid #ddd",
                  background: filterCategory === cat ? "#EEF0FF" : "white",
                  color: filterCategory === cat ? "#5061C4" : "#666",
                  fontWeight: filterCategory === cat ? "600" : "400",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap"
                }}
              >
                {cat === "ALL" ? "All" : cat}
              </button>
            ))}
          </div>

          <span style={{ fontSize: "0.85rem", color: "#888", marginLeft: "auto", whiteSpace: "nowrap" }}>
            Showing {filtered.length} of {lectures.length}
          </span>
        </div>
      </section>

      {/* Lectures Table */}
      <section style={{ padding: "40px 20px 60px", maxWidth: "1400px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <div style={{
              width: "40px", height: "40px", border: "4px solid #eee",
              borderTopColor: "#5061C4", borderRadius: "50%",
              animation: "spin 1s linear infinite", margin: "0 auto 15px"
            }} />
            <p>Loading invited lectures...</p>
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
                <tr style={{
                  background: "linear-gradient(135deg, #1B264F, #3B4F9A)",
                }}>
                  <th style={{ padding: "16px 20px", color: "white", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", width: "60px" }}>
                    S.No
                  </th>
                  <th style={{ padding: "16px 20px", color: "white", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Title of Lecture / Paper Presented
                  </th>
                  <th style={{ padding: "16px 20px", color: "white", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Conference / Seminar Details
                  </th>
                  <th style={{ padding: "16px 20px", color: "white", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", width: "160px" }}>
                    Category
                  </th>
                  <th style={{ padding: "16px 20px", color: "white", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", width: "140px" }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lecture, index) => {
                  const catColor = categoryColors[lecture.category] || categoryColors["National"];
                  return (
                    <tr
                      key={lecture.id}
                      style={{
                        background: index % 2 === 0 ? "#fff" : "#FAFBFF",
                        borderBottom: "1px solid #f0f0f0",
                        transition: "background 0.2s ease"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = "#EEF0FF"}
                      onMouseOut={(e) => e.currentTarget.style.background = index % 2 === 0 ? "#fff" : "#FAFBFF"}
                    >
                      <td style={{
                        padding: "16px 20px", textAlign: "center",
                        fontWeight: "700", color: "#5061C4", fontSize: "1rem"
                      }}>
                        {index + 1}
                      </td>
                      <td style={{
                        padding: "16px 20px", color: "#333",
                        fontSize: "0.93rem", lineHeight: "1.6"
                      }}>
                        {lecture.title}
                      </td>
                      <td style={{
                        padding: "16px 20px", color: "#666",
                        fontSize: "0.9rem", lineHeight: "1.6"
                      }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <MapPin size={14} color="#999" style={{ marginTop: "4px", flexShrink: 0 }} />
                          <span>{lecture.conferenceDetails}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontSize: "0.78rem",
                          fontWeight: "600",
                          background: catColor.bg,
                          color: catColor.text,
                          border: `1px solid ${catColor.border}`,
                          whiteSpace: "nowrap"
                        }}>
                          {lecture.category}
                        </span>
                      </td>
                      <td style={{
                        padding: "16px 20px", textAlign: "center",
                        fontSize: "0.88rem", color: "#666", whiteSpace: "nowrap"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                          <Calendar size={14} color="#999" />
                          <span>{formatDate(lecture.lectureDate)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && !loading && (
              <div style={{
                textAlign: "center", padding: "60px 20px",
                color: "#888", fontSize: "1.1rem"
              }}>
                No lectures found matching your search.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
