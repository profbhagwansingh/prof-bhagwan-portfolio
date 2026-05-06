"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

type Tag = "SCOPUS" | "PEER_REVIEWED" | "UGC_CARE" | "CONFERENCE";

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  tag: Tag;
}

const tagConfig: Record<Tag, string> = {
  SCOPUS:        "bg-blue-50 text-blue-700 border-blue-200",
  PEER_REVIEWED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  UGC_CARE:      "bg-amber-50 text-amber-700 border-amber-200",
  CONFERENCE:    "bg-purple-50 text-purple-700 border-purple-200",
};

const emptyForm = { title: "", journal: "", year: new Date().getFullYear(), tag: "SCOPUS" as Tag };

export default function PublicationsAdminPage() {
  const [pubs,    setPubs]    = useState<Publication[]>([]);
  const [form,    setForm]    = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const fetchPubs = () => {
    api.get("/api/publications/admin/all")
      .then((r) => setPubs(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPubs(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/publications/admin", form);
      setForm(emptyForm);
      setShowAdd(false);
      fetchPubs();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this publication?")) return;
    await api.delete(`/api/publications/admin/${id}`);
    fetchPubs();
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-primary-400 transition-all";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Publications</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{pubs.length} entries in database</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Publication
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="card-base p-6">
          <h2 className="font-display text-base font-semibold text-[var(--text-primary)] mb-5">New Publication</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required placeholder="Publication title" className={inputClass} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Journal *</label>
                <input value={form.journal} onChange={(e) => setForm((p) => ({ ...p, journal: e.target.value }))} required placeholder="Journal name" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Year *</label>
                <input type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: +e.target.value }))} required min="1990" max="2030" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Tag *</label>
                <select value={form.tag} onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value as Tag }))} className={inputClass}>
                  <option value="SCOPUS">Scopus</option>
                  <option value="PEER_REVIEWED">Peer Reviewed</option>
                  <option value="UGC_CARE">UGC CARE</option>
                  <option value="CONFERENCE">Conference</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors">
                {saving ? "Saving..." : "Save Publication"}
              </button>
              <button type="button" onClick={() => setShowAdd(false)}
                className="px-5 py-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] text-sm font-medium hover:border-primary-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card-base overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : pubs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">No publications yet. Add your first one above.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">Journal</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">Year</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Tag</th>
                <th className="px-5 py-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {pubs.map((pub) => (
                <tr key={pub.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-2">{pub.title}</p>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <p className="text-sm text-[var(--text-muted)] italic">{pub.journal}</p>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className="text-sm text-[var(--text-soft)]">{pub.year}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${tagConfig[pub.tag]}`}>
                      {pub.tag.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDelete(pub.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}