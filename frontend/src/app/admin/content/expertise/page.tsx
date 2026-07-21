"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, GripVertical, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface Expertise {
  id: string;
  title: string;
  description: string;
  iconName: string;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm: Omit<Expertise, "id"> = {
  title: "",
  description: "",
  iconName: "BookOpen",
  sortOrder: 0,
  isActive: true,
};

export default function ExpertiseAdminPage() {
  const [entries,   setEntries]   = useState<Expertise[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const [editEntry, setEditEntry] = useState<Expertise | null>(null);
  const [form,      setForm]      = useState(emptyForm);
  const [error,     setError]     = useState<string | null>(null);

  const fetchEntries = () => {
    setError(null);
    api.get("/api/content/expertise")
      .then((res) => {
        const data = res.data;
        setEntries(Array.isArray(data) ? data : (data?.data ?? data?.items ?? []));
      })
      .catch((err) => {
        console.error("Expertise fetch failed:", err);
        setError("Failed to load expertise. Please refresh.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, []);

  const openAdd = () => {
    setEditEntry(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (entry: Expertise) => {
    setEditEntry(entry);
    setForm({
      title:        entry.title,
      description:  entry.description,
      iconName:     entry.iconName,
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = editEntry
        ? { ...form, id: editEntry.id }
        : form;
      await api.post("/api/content/admin/expertise", payload);
      closeForm();
      fetchEntries();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expertise entry?")) return;
    try {
      await api.delete(`/api/content/admin/expertise/${id}`);
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
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
            <a href="/admin/content" className="hover:text-primary-500 transition-colors">Content</a>
            <span>/</span>
            <span>Expertise</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            Areas of Expertise
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
          Add Expertise
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchEntries} className="text-xs underline hover:no-underline">Retry</button>
        </div>
      )}

      {showForm && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
              {editEntry ? "Edit Expertise" : "New Expertise"}
            </h2>
            <button
              onClick={closeForm}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="e.g. Green Marketing"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Icon Name (Lucide) *</label>
                <input
                  value={form.iconName}
                  onChange={(e) => setForm((p) => ({ ...p, iconName: e.target.value }))}
                  required
                  placeholder="e.g. Leaf"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                required
                rows={3}
                placeholder="Brief description of the expertise..."
                className={inputClass}
              />
            </div>

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

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <Check className="w-4 h-4" />
                {saving ? "Saving..." : editEntry ? "Update Expertise" : "Save Expertise"}
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
            <p className="text-sm text-[var(--text-muted)]">No expertise areas yet.</p>
            <button
              onClick={openAdd}
              className="mt-3 text-xs text-primary-500 hover:underline"
            >
              Add your first area →
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
                <div className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] group-hover:bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                  <span className="text-xs font-mono text-[var(--text-muted)]">{index + 1}</span>
                </div>

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
                  <p className="text-sm text-[var(--text-soft)] mt-0.5">{entry.description}</p>
                  <div className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                    Icon: <span className="font-mono bg-[var(--bg-secondary)] px-1 rounded">{entry.iconName}</span>
                  </div>
                </div>

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
