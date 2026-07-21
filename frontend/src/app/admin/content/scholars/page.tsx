"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, GraduationCap, X, Check, User } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

type ScholarStatus = "AWARDED" | "PURSUING" | "POST_DOC";

interface PhdScholar {
    id: string;
    name: string;
    imageUrl: string | null;
    status: ScholarStatus;
    researchTopic: string | null;
    currentPosition: string | null;
    sortOrder: number;
    isActive: boolean;
}

const emptyForm: Omit<PhdScholar, "id"> = {
    name: "",
    imageUrl: "",
    status: "PURSUING",
    researchTopic: "",
    currentPosition: "",
    sortOrder: 0,
    isActive: true,
};

const STATUS_META: Record<ScholarStatus, { label: string; color: string }> = {
    PURSUING: { label: "Pursuing", color: "bg-blue-50 text-blue-600 border-blue-200" },
    AWARDED: { label: "Awarded", color: "bg-green-50 text-green-600 border-green-200" },
    POST_DOC: { label: "Post-Doc", color: "bg-purple-50 text-purple-600 border-purple-200" },
};

const groupByStatus = (scholars: PhdScholar[]) =>
    scholars.reduce<Record<ScholarStatus, PhdScholar[]>>(
        (acc, s) => { (acc[s.status] ??= []).push(s); return acc; },
        { PURSUING: [], AWARDED: [], POST_DOC: [] }
    );

export default function ScholarsAdminPage() {
    const [scholars, setScholars] = useState<PhdScholar[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editEntry, setEditEntry] = useState<PhdScholar | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grouped" | "list">("grouped");

    // ─── Fetch ────────────────────────────────────────────────
    const fetchScholars = () => {
        setError(null);
        api.get("/api/content/scholars")
            .then((res) => {
                const data = res.data;
                setScholars(Array.isArray(data) ? data : (data?.data ?? data?.items ?? []));
            })
            .catch((err) => {
                console.error("Scholars fetch failed:", err);
                setError("Failed to load scholars. Please refresh.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchScholars(); }, []);

    // ─── Form helpers ─────────────────────────────────────────
    const openAdd = () => {
        setEditEntry(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const openEdit = (s: PhdScholar) => {
        setEditEntry(s);
        setForm({
            name: s.name,
            imageUrl: s.imageUrl ?? "",
            status: s.status,
            researchTopic: s.researchTopic ?? "",
            currentPosition: s.currentPosition ?? "",
            sortOrder: s.sortOrder,
            isActive: s.isActive,
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
            await api.post("/api/content/admin/scholars", payload);
            closeForm();
            fetchScholars();
        } catch (err) {
            console.error("Save failed:", err);
            alert("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // ─── Delete ───────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this scholar?")) return;
        try {
            await api.delete(`/api/content/admin/scholars/${id}`);
            fetchScholars();
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

    const grouped = groupByStatus(scholars);

    return (
        <div className="space-y-6 max-w-3xl">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
                        <a href="/admin/content" className="hover:text-primary-500 transition-colors">Content</a>
                        <span>/</span>
                        <span>PhD Scholars</span>
                    </div>
                    <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                        PhD Scholars
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        {scholars.length} total ·{" "}
                        {grouped.PURSUING.length} pursuing ·{" "}
                        {grouped.AWARDED.length} awarded ·{" "}
                        {grouped.POST_DOC.length} post-doc
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Scholar
                </button>
            </div>

            {/* ── Error Banner ── */}
            {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={fetchScholars} className="text-xs underline hover:no-underline">Retry</button>
                </div>
            )}

            {/* ── Add / Edit Form ── */}
            {showForm && (
                <div className="card-base p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
                            {editEntry ? "Edit Scholar" : "New PhD Scholar"}
                        </h2>
                        <button
                            onClick={closeForm}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">

                        {/* Name + Status */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Full Name *</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    required
                                    placeholder="e.g. Dr. Anjali Sharma"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Status *</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ScholarStatus }))}
                                    className={inputClass}
                                >
                                    <option value="PURSUING">Pursuing</option>
                                    <option value="AWARDED">Awarded</option>
                                    <option value="POST_DOC">Post-Doc</option>
                                </select>
                            </div>
                        </div>

                        {/* Research Topic */}
                        <div>
                            <label className={labelClass}>Research Topic</label>
                            <input
                                value={form.researchTopic ?? ""}
                                onChange={(e) => setForm((p) => ({ ...p, researchTopic: e.target.value }))}
                                placeholder="e.g. Synthesis of Novel Heterocyclic Compounds"
                                className={inputClass}
                            />
                        </div>

                        {/* Current Position */}
                        <div>
                            <label className={labelClass}>Current Position</label>
                            <input
                                value={form.currentPosition ?? ""}
                                onChange={(e) => setForm((p) => ({ ...p, currentPosition: e.target.value }))}
                                placeholder="e.g. Assistant Professor, IIT Bombay"
                                className={inputClass}
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className={labelClass}>Photo URL</label>
                            <input
                                value={form.imageUrl ?? ""}
                                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                                placeholder="https://... (uploaded via Media)"
                                className={inputClass}
                            />
                            {/* Preview */}
                            {form.imageUrl && (
                                <div className="mt-2 flex items-center gap-3">
                                    <img
                                        src={form.imageUrl}
                                        alt="Preview"
                                        className="w-10 h-10 rounded-full object-cover border border-[var(--border)]"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                    <span className="text-xs text-[var(--text-muted)]">Photo preview</span>
                                </div>
                            )}
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
                                {saving ? "Saving..." : editEntry ? "Update Scholar" : "Save Scholar"}
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
            {!loading && scholars.length > 0 && (
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

            {/* ── Scholar List ── */}
            {loading ? (
                <div className="card-base p-10 text-center">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            ) : scholars.length === 0 ? (
                <div className="card-base p-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-3">
                        <GraduationCap className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">No PhD scholars yet.</p>
                    <button onClick={openAdd} className="mt-3 text-xs text-primary-500 hover:underline">
                        Add your first scholar →
                    </button>
                </div>
            ) : viewMode === "grouped" ? (
                <div className="space-y-4">
                    {(["PURSUING", "AWARDED", "POST_DOC"] as ScholarStatus[])
                        .filter((status) => grouped[status].length > 0)
                        .map((status) => (
                            <div key={status} className="card-base overflow-hidden">
                                <div className="px-5 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-between">
                                    <span className={cn(
                                        "text-xs px-2 py-0.5 rounded-full border font-medium",
                                        STATUS_META[status].color
                                    )}>
                                        {STATUS_META[status].label}
                                    </span>
                                    <span className="text-xs text-[var(--text-muted)]">
                                        {grouped[status].length} {grouped[status].length === 1 ? "scholar" : "scholars"}
                                    </span>
                                </div>
                                <div className="divide-y divide-[var(--border)]">
                                    {grouped[status].map((s) => (
                                        <ScholarRow
                                            key={s.id}
                                            scholar={s}
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
                    {scholars.map((s) => (
                        <ScholarRow
                            key={s.id}
                            scholar={s}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            showStatus
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Row Sub-component ────────────────────────────────────────
function ScholarRow({
    scholar: s,
    onEdit,
    onDelete,
    showStatus = false,
}: {
    scholar: PhdScholar;
    onEdit: (s: PhdScholar) => void;
    onDelete: (id: string) => void;
    showStatus?: boolean;
}) {
    return (
        <div className={cn(
            "flex items-center gap-4 px-5 py-3.5 group hover:bg-[var(--bg-secondary)] transition-colors",
            !s.isActive && "opacity-50"
        )}>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center">
                {s.imageUrl ? (
                    <img
                        src={s.imageUrl}
                        alt={s.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                ) : (
                    <User className="w-4 h-4 text-[var(--text-muted)]" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{s.name}</span>
                    {!s.isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)]">
                            hidden
                        </span>
                    )}
                    {showStatus && (
                        <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full border",
                            STATUS_META[s.status].color
                        )}>
                            {STATUS_META[s.status].label}
                        </span>
                    )}
                </div>
                {s.researchTopic && (
                    <p className="text-xs text-[var(--text-soft)] mt-0.5 truncate">{s.researchTopic}</p>
                )}
                {s.currentPosition && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{s.currentPosition}</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                    onClick={() => onEdit(s)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:bg-primary-50 transition-all"
                    title="Edit"
                >
                    <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={() => onDelete(s.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Delete"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}