"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Link, X, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconSvg: string | null;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm: Omit<SocialLink, "id"> = {
  platform: "",
  url: "",
  iconSvg: "",
  sortOrder: 0,
  isActive: true,
};

// Common platforms with brand colours for quick-add chips
const PLATFORM_PRESETS: { name: string; color: string; placeholder: string }[] = [
  { name: "LinkedIn",    color: "bg-blue-50 text-blue-700 border-blue-200",   placeholder: "https://linkedin.com/in/..." },
  { name: "Google Scholar", color: "bg-red-50 text-red-700 border-red-200",  placeholder: "https://scholar.google.com/citations?user=..." },
  { name: "ResearchGate",color: "bg-teal-50 text-teal-700 border-teal-200",  placeholder: "https://researchgate.net/profile/..." },
  { name: "ORCID",       color: "bg-green-50 text-green-700 border-green-200",placeholder: "https://orcid.org/0000-..." },
  { name: "Twitter/X",   color: "bg-slate-50 text-slate-700 border-slate-200",placeholder: "https://twitter.com/..." },
  { name: "YouTube",     color: "bg-red-50 text-red-600 border-red-200",     placeholder: "https://youtube.com/@..." },
  { name: "Academia.edu",color: "bg-amber-50 text-amber-700 border-amber-200",placeholder: "https://academia.edu/..." },
];

const platformColor = (platform: string): string => {
  const preset = PLATFORM_PRESETS.find(
    (p) => p.name.toLowerCase() === platform.toLowerCase()
  );
  return preset?.color ?? "bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border)]";
};

export default function SocialLinksAdminPage() {
  const [links,     setLinks]     = useState<SocialLink[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const [editEntry, setEditEntry] = useState<SocialLink | null>(null);
  const [form,      setForm]      = useState(emptyForm);
  const [error,     setError]     = useState<string | null>(null);
  const [showSvg,   setShowSvg]   = useState(false);

  // ─── Fetch ────────────────────────────────────────────────
  const fetchLinks = () => {
    setError(null);
    api.get("/api/content/social-links")
      .then((res) => {
        const data = res.data;
        setLinks(Array.isArray(data) ? data : (data?.data ?? data?.items ?? []));
      })
      .catch((err) => {
        console.error("Social links fetch failed:", err);
        setError("Failed to load social links. Please refresh.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLinks(); }, []);

  // ─── Form helpers ─────────────────────────────────────────
  const openAdd = (presetName?: string) => {
    setEditEntry(null);
    const preset = PLATFORM_PRESETS.find((p) => p.name === presetName);
    setForm({ ...emptyForm, platform: presetName ?? "" });
    setShowSvg(false);
    setShowForm(true);
  };

  const openEdit = (link: SocialLink) => {
    setEditEntry(link);
    setForm({
      platform:  link.platform,
      url:       link.url,
      iconSvg:   link.iconSvg ?? "",
      sortOrder: link.sortOrder,
      isActive:  link.isActive,
    });
    setShowSvg(!!link.iconSvg);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditEntry(null);
    setForm(emptyForm);
    setShowSvg(false);
  };

  // ─── Save ─────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = editEntry ? { ...form, id: editEntry.id } : form;
      await api.post("/api/content/admin/social-links", payload);
      closeForm();
      fetchLinks();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this social link?")) return;
    try {
      await api.delete(`/api/content/admin/social-links/${id}`);
      fetchLinks();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete. Please try again.");
    }
  };

  // URL placeholder based on selected platform
  const urlPlaceholder =
    PLATFORM_PRESETS.find((p) => p.name === form.platform)?.placeholder ?? "https://...";

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] " +
    "text-[var(--text-primary)] text-sm focus:outline-none focus:border-primary-400 transition-all";
  const labelClass =
    "block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5";

  // Platforms not yet added
  const existingPlatforms = links.map((l) => l.platform.toLowerCase());
  const availablePresets = PLATFORM_PRESETS.filter(
    (p) => !existingPlatforms.includes(p.name.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
            <a href="/admin/content" className="hover:text-primary-500 transition-colors">Content</a>
            <span>/</span>
            <span>Social Links</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            Social Links
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {links.length} {links.length === 1 ? "platform" : "platforms"} configured
          </p>
        </div>
        <button
          onClick={() => openAdd()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchLinks} className="text-xs underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* ── Quick-add preset chips ── */}
      {!showForm && availablePresets.length > 0 && (
        <div className="card-base p-4">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Quick Add
          </p>
          <div className="flex flex-wrap gap-2">
            {availablePresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => openAdd(preset.name)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:shadow-sm",
                  preset.color
                )}
              >
                <Plus className="w-3 h-3" />
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
              {editEntry ? "Edit Social Link" : "New Social Link"}
            </h2>
            <button
              onClick={closeForm}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">

            {/* Platform + Sort Order */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Platform *</label>
                <input
                  value={form.platform}
                  onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}
                  required
                  placeholder="e.g. LinkedIn"
                  className={inputClass}
                  list="platform-suggestions"
                />
                <datalist id="platform-suggestions">
                  {PLATFORM_PRESETS.map((p) => (
                    <option key={p.name} value={p.name} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className={labelClass}>Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((p) => ({ ...p, sortOrder: +e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>

            {/* URL */}
            <div>
              <label className={labelClass}>Profile URL *</label>
              <input
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                required
                placeholder={urlPlaceholder}
                className={inputClass}
                type="url"
              />
            </div>

            {/* SVG Icon (collapsible) */}
            <div>
              <button
                type="button"
                onClick={() => setShowSvg((v) => !v)}
                className="text-xs text-primary-500 hover:underline mb-2"
              >
                {showSvg ? "Hide custom SVG icon ↑" : "Add custom SVG icon (optional) ↓"}
              </button>
              {showSvg && (
                <textarea
                  value={form.iconSvg ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, iconSvg: e.target.value }))}
                  rows={4}
                  placeholder={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>'}
                  className={cn(inputClass, "resize-none font-mono text-xs")}
                />
              )}
              {showSvg && form.iconSvg && (
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="w-6 h-6 text-[var(--text-primary)]"
                    dangerouslySetInnerHTML={{ __html: form.iconSvg }}
                  />
                  <span className="text-xs text-[var(--text-muted)]">SVG preview</span>
                </div>
              )}
            </div>

            {/* Active Toggle */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
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

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <Check className="w-4 h-4" />
                {saving ? "Saving..." : editEntry ? "Update Link" : "Save Link"}
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

      {/* ── Links List ── */}
      {loading ? (
        <div className="card-base p-10 text-center">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : links.length === 0 ? (
        <div className="card-base p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-3">
            <Link className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm text-[var(--text-muted)]">No social links yet.</p>
          <button onClick={() => openAdd()} className="mt-3 text-xs text-primary-500 hover:underline">
            Add your first link →
          </button>
        </div>
      ) : (
        <div className="card-base overflow-hidden divide-y divide-[var(--border)]">
          {links.map((link) => (
            <div
              key={link.id}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5 group hover:bg-[var(--bg-secondary)] transition-colors",
                !link.isActive && "opacity-50"
              )}
            >
              {/* Platform icon / SVG */}
              <div className="w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                {link.iconSvg ? (
                  <div
                    className="w-5 h-5 text-[var(--text-primary)]"
                    dangerouslySetInnerHTML={{ __html: link.iconSvg }}
                  />
                ) : (
                  <Link className="w-4 h-4 text-[var(--text-muted)]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full border font-medium",
                    platformColor(link.platform)
                  )}>
                    {link.platform}
                  </span>
                  {!link.isActive && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)]">
                      hidden
                    </span>
                  )}
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-primary-500 transition-colors mt-1 truncate max-w-xs"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{link.url}</span>
                </a>
              </div>

              {/* Sort order badge */}
              <span className="text-xs text-[var(--text-muted)] font-mono hidden sm:block">
                #{link.sortOrder}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => openEdit(link)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:bg-primary-50 transition-all"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
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
  );
}