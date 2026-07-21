"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Bell, ArrowLeft, Pin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isActive: boolean;
  publishDate: string;
}

const empty = { title: "", content: "", isPinned: false, isActive: true, publishDate: new Date().toISOString().split("T")[0] };

export default function AnnouncementsAdminPage() {
  const [items,   setItems]   = useState<Announcement[]>([]);
  const [form,    setForm]    = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const fetchItems = () => {
    api.get("/api/content/announcements")
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/content/admin/announcements", form);
      setForm(empty);
      setShowAdd(false);
      fetchItems();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await api.delete(`/api/content/admin/announcements/${id}`);
    fetchItems();
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-primary-400 transition-all";
  const labelClass = "block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/content"
          className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-300 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Announcements</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">{items.length} announcements</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Announcement
        </button>
      </div>

      {showAdd && (
        <div className="card-base p-6">
          <h2 className="font-display text-base font-semibold text-[var(--text-primary)] mb-5">New Announcement</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required placeholder="Announcement title" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Content *</label>
              <textarea value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                required rows={4} placeholder="Announcement details..."
                className={`${inputClass} resize-none`} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Publish Date</label>
                <input type="date" value={form.publishDate}
                  onChange={(e) => setForm((p) => ({ ...p, publishDate: e.target.value }))}
                  className={inputClass} />
              </div>
              <div className="flex flex-col justify-end gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPinned}
                    onChange={(e) => setForm((p) => ({ ...p, isPinned: e.target.checked }))}
                    className="w-4 h-4 rounded accent-primary-500" />
                  <span className="text-sm text-[var(--text-soft)]">Pin to top</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded accent-primary-500" />
                  <span className="text-sm text-[var(--text-soft)]">Active (visible on site)</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors">
                {saving ? "Saving..." : "Publish"}
              </button>
              <button type="button" onClick={() => setShowAdd(false)}
                className="px-5 py-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] text-sm font-medium hover:border-primary-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card-base divide-y divide-[var(--border)]">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">No announcements yet.</p>
          </div>
        ) : items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 px-5 py-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {item.isPinned && <Pin className="w-3 h-3 text-primary-500 flex-shrink-0" />}
                <p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full border flex-shrink-0",
                  item.isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                )}>
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2">{item.content}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {new Date(item.publishDate).toLocaleDateString()}
              </p>
            </div>
            <button onClick={() => handleDelete(item.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}