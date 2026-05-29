"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, ExternalLink, GripVertical, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string | null;
  organization: string;
  location: string | null;
  dateRange: string;
  externalLink: string | null;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm: Omit<TimelineEntry, "id"> = {
  title: "",
  subtitle: "",
  organization: "",
  location: "",
  dateRange: "",
  externalLink: "",
  sortOrder: 0,
  isActive: true,
};

export default function TimelineAdminPage() {
  const [entries,   setEntries]   = useState<TimelineEntry[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const [editEntry, setEditEntry] = useState<TimelineEntry | null>(null);
  const [form,      setForm]      = useState(emptyForm);
  const [error,     setError]     = useState<string | null>(null);

  // ─── Fetch ────────────────────────────────────────────────
  const fetchEntries = () => {
    setError(null);
    api.get("/api/content/admin/timeline")
      .then((res) => {
        const data = res.data;
        setEntries(Array.isArray(data) ? data : (data?.data ?? data?.items ?? []));
      })
      .catch((err) => {
        console.error("Timeline fetch failed:", err);
        setError("Failed to load timeline. Please refresh.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, []);

  // ─── Open add form ───────────────────────────────────────
  const openAdd = () => {
    setEditEntry(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  // ─── Open edit form ──────────────────────────────────────
  const openEdit = (entry: TimelineEntry) => {
    setEditEntry(entry);
    setForm({
      title:        entry.title,
      subtitle:     entry.subtitle ?? "",
      organization: entry.organization,
      location:     entry.location ?? "",
      dateRange:    entry.dateRange,
      externalLink: entry.externalLink ?? "",
      sortOrder:    entry.sortOrder,
      isActive:     entry.isActive,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditEntry(null);
    setForm(emptyForm);
  };

  // ─── Save (create or update) ─────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = editEntry
        ? { ...form, id: editEntry.id }
        : form;
      await api.post("/api/content/admin/timeline", payload);
      closeForm();
      fetchEntries();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this timeline entry?")) return;
    try {
      await api.delete(`/api/content/admin/timeline/${id}`);
      fetchEntries();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete. Please try again.");
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] " +
    "text-[var(--text-primary)] text-sm focus:outline-none focus:border-primary-400 transition-all";

  const labelClass =
    "block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
            <a href="/admin/content" className="hover:text-primary-500 transition-colors">Content</a>
            <span>/</span>
            <span>Timeline</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            Experience Timeline
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} · ordered by Sort Order
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchEntries} className="text-xs underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
              {editEntry ? "Edit Entry" : "New Timeline Entry"}
            </h2>
            <button
              onClick={closeForm}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Row 1: Title + Organisation */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="e.g. Professor"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Organisation *</label>
                <input
                  value={form.organization}
                  onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))}
                  required
                  placeholder="e.g. IIT Delhi"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 2: Subtitle + Location */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Subtitle</label>
                <input
                  value={form.subtitle ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="e.g. Department of Chemistry"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input
                  value={form.location ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. New Delhi, India"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 3: Date Range + External Link */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date Range *</label>
                <input
                  value={form.dateRange}
                  onChange={(e) => setForm((p) => ({ ...p, dateRange: e.target.value }))}
                  required
                  placeholder="e.g. 2010 – Present"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>External Link</label>
                <input
                  value={form.externalLink ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, externalLink: e.target.value }))}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 4: Sort Order + Active */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((p) => ({ ...p, sortOrder: +e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                    className={cn(
                      "w-10 h-6 rounded-full transition-colors relative",
                      form.isActive ? "bg-primary-500" : "bg-[var(--border)]"
                    )}
                  >
                    <span className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
                      form.isActive ? "left-5" : "left-1"
                    )} />
                  </div>
                  <span className="text-sm text-[var(--text-soft)]">
                    {form.isActive ? "Active (visible on site)" : "Hidden from site"}
                  </span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <Check className="w-4 h-4" />
                {saving ? "Saving..." : editEntry ? "Update Entry" : "Save Entry"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] text-sm font-medium hover:border-primary-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Timeline List ── */}
      <div className="card-base overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-3">
              <GripVertical className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm text-[var(--text-muted)]">No timeline entries yet.</p>
            <button
              onClick={openAdd}
              className="mt-3 text-xs text-primary-500 hover:underline"
            >
              Add your first entry →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className={cn(
                  "flex items-start gap-4 px-5 py-4 group hover:bg-[var(--bg-secondary)] transition-colors",
                  !entry.isActive && "opacity-50"
                )}
              >
                {/* Sort badge */}
                <div className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] group-hover:bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                  <span className="text-xs font-mono text-[var(--text-muted)]">{index + 1}</span>
                </div>

                {/* Timeline accent line */}
                <div className="flex flex-col items-center flex-shrink-0 mt-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-500 ring-2 ring-primary-100" />
                  {index < entries.length - 1 && (
                    <div className="w-px flex-1 min-h-8 bg-[var(--border)] mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {entry.title}
                    </span>
                    {!entry.isActive && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)]">
                        hidden
                      </span>
                    )}
                  </div>
                  {entry.subtitle && (
                    <p className="text-xs text-[var(--text-soft)] mt-0.5">{entry.subtitle}</p>
                  )}
                  <p className="text-sm text-[var(--text-soft)] mt-0.5">{entry.organization}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
                      {entry.dateRange}
                    </span>
                    {entry.location && (
                      <span className="text-xs text-[var(--text-muted)]">📍 {entry.location}</span>
                    )}
                    {entry.externalLink && (
                      <a
                        href={entry.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-primary-500 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> Link
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => openEdit(entry)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:bg-primary-50 transition-all"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}