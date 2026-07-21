"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, ExternalLink, BookOpen, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface Course {
  id: string;
  name: string;
  syllabusUrl: string | null;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm: Omit<Course, "id"> = {
  name: "",
  syllabusUrl: "",
  category: "general",
  sortOrder: 0,
  isActive: true,
};

// Group entries by category for display
const groupByCategory = (courses: Course[]) => {
  return courses.reduce<Record<string, Course[]>>((acc, course) => {
    const key = course.category || "general";
    if (!acc[key]) acc[key] = [];
    acc[key].push(course);
    return acc;
  }, {});
};

export default function CoursesAdminPage() {
  const [courses,   setCourses]   = useState<Course[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const [editEntry, setEditEntry] = useState<Course | null>(null);
  const [form,      setForm]      = useState(emptyForm);
  const [error,     setError]     = useState<string | null>(null);
  const [viewMode,  setViewMode]  = useState<"list" | "grouped">("grouped");

  // ─── Fetch ────────────────────────────────────────────────
  const fetchCourses = () => {
    setError(null);
    api.get("/api/content/courses")
      .then((res) => {
        const data = res.data;
        setCourses(Array.isArray(data) ? data : (data?.data ?? data?.items ?? []));
      })
      .catch((err) => {
        console.error("Courses fetch failed:", err);
        setError("Failed to load courses. Please refresh.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  // ─── Form helpers ─────────────────────────────────────────
  const openAdd = () => {
    setEditEntry(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (course: Course) => {
    setEditEntry(course);
    setForm({
      name:        course.name,
      syllabusUrl: course.syllabusUrl ?? "",
      category:    course.category,
      sortOrder:   course.sortOrder,
      isActive:    course.isActive,
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
      await api.post("/api/content/admin/courses", payload);
      closeForm();
      fetchCourses();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    try {
      await api.delete(`/api/content/admin/courses/${id}`);
      fetchCourses();
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

  const grouped = groupByCategory(courses);

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
            <a href="/admin/content" className="hover:text-primary-500 transition-colors">Content</a>
            <span>/</span>
            <span>Courses</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Courses</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {courses.length} {courses.length === 1 ? "course" : "courses"} · {Object.keys(grouped).length} {Object.keys(grouped).length === 1 ? "category" : "categories"}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchCourses} className="text-xs underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
              {editEntry ? "Edit Course" : "New Course"}
            </h2>
            <button
              onClick={closeForm}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Course Name */}
            <div>
              <label className={labelClass}>Course Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder="e.g. Advanced Organic Chemistry"
                className={inputClass}
              />
            </div>

            {/* Category + Sort Order */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category *</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  required
                  placeholder="e.g. UG / PG / general"
                  className={inputClass}
                  list="category-suggestions"
                />
                {/* Suggest existing categories */}
                <datalist id="category-suggestions">
                  {Array.from(new Set(courses.map((c) => c.category))).map((cat) => (

                    <option key={cat} value={cat} />
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

            {/* Syllabus URL */}
            <div>
              <label className={labelClass}>Syllabus URL</label>
              <input
                value={form.syllabusUrl ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, syllabusUrl: e.target.value }))}
                placeholder="https://... (PDF or external link)"
                className={inputClass}
              />
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
                {saving ? "Saving..." : editEntry ? "Update Course" : "Save Course"}
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
      {!loading && courses.length > 0 && (
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

      {/* ── Course List ── */}
      {loading ? (
        <div className="card-base p-10 text-center">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : courses.length === 0 ? (
        <div className="card-base p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm text-[var(--text-muted)]">No courses yet.</p>
          <button onClick={openAdd} className="mt-3 text-xs text-primary-500 hover:underline">
            Add your first course →
          </button>
        </div>
      ) : viewMode === "grouped" ? (
        // ── Grouped by category ──
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="card-base overflow-hidden">
              <div className="px-5 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  {category}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {items.length} {items.length === 1 ? "course" : "courses"}
                </span>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {items.map((course) => (
                  <CourseRow
                    key={course.id}
                    course={course}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ── Flat list ──
        <div className="card-base overflow-hidden divide-y divide-[var(--border)]">
          {courses.map((course) => (
            <CourseRow
              key={course.id}
              course={course}
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

// ─── Course Row Sub-component ─────────────────────────────────
function CourseRow({
  course,
  onEdit,
  onDelete,
  showCategory = false,
}: {
  course: Course;
  onEdit: (c: Course) => void;
  onDelete: (id: string) => void;
  showCategory?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-3.5 group hover:bg-[var(--bg-secondary)] transition-colors",
        !course.isActive && "opacity-50"
      )}
    >
      {/* Icon */}
      <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
        <BookOpen className="w-4 h-4 text-primary-500" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">
            {course.name}
          </span>
          {!course.isActive && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)]">
              hidden
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {showCategory && (
            <span className="text-xs text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
              {course.category}
            </span>
          )}
          {course.syllabusUrl && (
            <a  
              href={course.syllabusUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-primary-500 transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Syllabus
            </a>
          )}
          <span className="text-xs text-[var(--text-muted)]">order: {course.sortOrder}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(course)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:bg-primary-50 transition-all"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(course.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}