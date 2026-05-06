"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Trophy, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: number | null;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm: Omit<Achievement, "id"> = {
  title: "",
  description: "",
  year: null,
  category: "award",
  sortOrder: 0,
  isActive: true,
};

const CATEGORY_COLORS: Record<string, string> = {
  award:       "bg-amber-50 text-amber-600 border-amber-200",
  fellowship:  "bg-blue-50 text-blue-600 border-blue-200",
  recognition: "bg-purple-50 text-purple-600 border-purple-200",
  membership:  "bg-green-50 text-green-600 border-green-200",
  general:     "bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border)]",
};

const categoryColor = (cat: string) =>
  CATEGORY_COLORS[cat.toLowerCase()] ?? CATEGORY_COLORS.general;

const groupByCategory = (items: Achievement[]) =>
  items.reduce<Record<string, Achievement[]>>((acc, a) => {
    const key = a.category || "general";
    (acc[key] ??= []).push(a);
    return acc;
  }, {});

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [editEntry,    setEditEntry]    = useState<Achievement | null>(null);
  const [form,         setForm]         = useState(emptyForm);
  const [error,        setError]        = useState<string | null>(null);
  const [viewMode,     setViewMode]     = useState<"grouped" | "list">("grouped");

  // ─── Fetch ────────────────────────────────────────────────
  const fetchAchievements = () => {
    setError(null);
    api.get("/api/content/achievements")
      .then((res) => {
        const data = res.data;
        setAchievements(Array.isArray(data) ? data : (data?.data ?? data?.items ?? []));
      })
      .catch((err) => {
        console.error("Achievements fetch failed:", err);
        setError("Failed to load achievements. Please refresh.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAchievements(); }, []);

  // ─── Form helpers ─────────────────────────────────────────
  const openAdd = () => {
    setEditEntry(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (a: Achievement) => {
    setEditEntry(a);
    setForm({
      title:       a.title,
      description: a.description,
      year:        a.year,
      category:    a.category,
      sortOrder:   a.sortOrder,
      isActive:    a.isActive,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditEntry(null);
    setForm(emptyForm);
  };

  // ─── Save ─────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = editEntry ? { ...form, id: editEntry.id } : form;
      await api.post("/api/content/admin/achievements", payload);
      closeForm();
      fetchAchievements();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    try {
      await api.delete(`/api/content/admin/achievements/${id}`);
      fetchAchievements();
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

  const grouped = groupByCategory(achievements);

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
            <a href="/admin/content" className="hover:text-primary-500 transition-colors">Content</a>
            <span>/</span>
            <span>Achievements</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            Achievements
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {achievements.length} {achievements.length === 1 ? "entry" : "entries"} · {Object.keys(grouped).length} {Object.keys(grouped).length === 1 ? "category" : "categories"}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Achievement
        </button>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchAchievements} className="text-xs underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
              {editEntry ? "Edit Achievement" : "New Achievement"}
            </h2>
            <button
              onClick={closeForm}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Title */}
            <div>
              <label className={labelClass}>Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
                placeholder="e.g. Best Paper Award — IEEE Conference"
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                required
                rows={3}
                placeholder="Brief description of this achievement..."
                className={cn(inputClass, "resize-none")}
              />
            </div>

            {/* Category + Year */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category *</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  required
                  placeholder="e.g. award / fellowship / recognition"
                  className={inputClass}
                  list="cat-suggestions"
                />
                <datalist id="cat-suggestions">
                  {Array.from(new Set(achievements.map((a) => a.category))).map((c) => (

                    <option key={c} value={c} />
                  ))}
                  <option value="award" />
                  <option value="fellowship" />
                  <option value="recognition" />
                  <option value="membership" />
                </datalist>
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <input
                  type="number"
                  value={form.year ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, year: e.target.value ? +e.target.value : null }))
                  }
                  placeholder="e.g. 2023"
                  min={1900}
                  max={new Date().getFullYear()}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Sort Order + Active */}
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
                {saving ? "Saving..." : editEntry ? "Update Achievement" : "Save Achievement"}
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

      {/* ── View Toggle ── */}
      {!loading && achievements.length > 0 && (
        <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-xl w-fit border border-[var(--border)]">
          {(["grouped", "list"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                viewMode === mode
                  ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-soft)]"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      )}

      {/* ── List ── */}
      {loading ? (
        <div className="card-base p-10 text-center">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : achievements.length === 0 ? (
        <div className="card-base p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm text-[var(--text-muted)]">No achievements yet.</p>
          <button onClick={openAdd} className="mt-3 text-xs text-primary-500 hover:underline">
            Add your first achievement →
          </button>
        </div>
      ) : viewMode === "grouped" ? (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="card-base overflow-hidden">
              <div className="px-5 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full border font-medium capitalize",
                    categoryColor(category)
                  )}>
                    {category}
                  </span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">
                  {items.length} {items.length === 1 ? "entry" : "entries"}
                </span>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {items.map((a) => (
                  <AchievementRow
                    key={a.id}
                    achievement={a}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-base overflow-hidden divide-y divide-[var(--border)]">
          {achievements.map((a) => (
            <AchievementRow
              key={a.id}
              achievement={a}
              onEdit={openEdit}
              onDelete={handleDelete}
              showCategory
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Row Sub-component ────────────────────────────────────────
function AchievementRow({
  achievement: a,
  onEdit,
  onDelete,
  showCategory = false,
}: {
  achievement: Achievement;
  onEdit: (a: Achievement) => void;
  onDelete: (id: string) => void;
  showCategory?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-start gap-4 px-5 py-4 group hover:bg-[var(--bg-secondary)] transition-colors",
      !a.isActive && "opacity-50"
    )}>
      {/* Icon */}
      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Trophy className="w-4 h-4 text-amber-500" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-[var(--text-primary)]">{a.title}</span>
          {!a.isActive && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)]">
              hidden
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--text-soft)] mt-1 line-clamp-2">{a.description}</p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {showCategory && (
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full border capitalize",
              categoryColor(a.category)
            )}>
              {a.category}
            </span>
          )}
          {a.year && (
            <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
              {a.year}
            </span>
          )}
          <span className="text-xs text-[var(--text-muted)]">order: {a.sortOrder}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(a)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:bg-primary-50 transition-all"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(a.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}