"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Image, Video, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

type MediaType = "PHOTO" | "VIDEO" | "CLIPPING";

interface GalleryItem {
  id: string;
  caption: string;
  mediaType: MediaType;
  mediaUrl: string;
  sortOrder: number;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const mediaIcons: Record<MediaType, React.ElementType> = {
  PHOTO:    Image,
  VIDEO:    Video,
  CLIPPING: Newspaper,
};

const mediaColors: Record<MediaType, string> = {
  PHOTO:    "bg-blue-50 text-blue-600 border-blue-200",
  VIDEO:    "bg-purple-50 text-purple-600 border-purple-200",
  CLIPPING: "bg-amber-50 text-amber-600 border-amber-200",
};

const emptyForm = {
  caption: "",
  mediaUrl: "",
  mediaType: "PHOTO" as MediaType,
  categoryId: "",
  sortOrder: 0,
};

export default function GalleryAdminPage() {
  const [items,      setItems]      = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form,       setForm]       = useState(emptyForm);
  const [catForm,    setCatForm]    = useState({ name: "", slug: "" });
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [showAdd,    setShowAdd]    = useState(false);
  const [showCatAdd, setShowCatAdd] = useState(false);
  const [activeTab,  setActiveTab]  = useState<"items" | "categories">("items");
  const [error,      setError]      = useState<string | null>(null);

  const normalizeArray = (data: unknown): any[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
      const obj = data as Record<string, unknown>;
      if (Array.isArray(obj.data))  return obj.data;
      if (Array.isArray(obj.items)) return obj.items;
    }
    return [];
  };

  const fetchAll = () => {
    setError(null);
    Promise.all([
      api.get("/api/gallery/items"),
      api.get("/api/gallery/categories"),
    ])
      .then(([itemsRes, catsRes]) => {
        setItems(normalizeArray(itemsRes.data));
        setCategories(normalizeArray(catsRes.data));
      })
      .catch((err) => {
        console.error("Gallery fetch failed:", err);
        setError("Failed to load gallery data. Please refresh.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/gallery/admin/items", form);
      setForm(emptyForm);
      setShowAdd(false);
      fetchAll();
    } catch (err) {
      console.error("Failed to add item:", err);
      alert("Failed to save item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCat = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/gallery/admin/categories", catForm);
      setCatForm({ name: "", slug: "" });
      setShowCatAdd(false);
      fetchAll();
    } catch (err) {
      console.error("Failed to add category:", err);
      alert("Failed to save category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`/api/gallery/admin/items/${id}`);
      fetchAll();
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  const deleteCat = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/api/gallery/admin/categories/${id}`);
      fetchAll();
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category. Please try again.");
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-primary-400 transition-all";

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Gallery</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{items.length} media items</p>
        </div>
        <button
          onClick={() => { setShowAdd(!showAdd); setShowCatAdd(false); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchAll} className="text-xs underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-xl w-fit border border-[var(--border)]">
        {(["items", "categories"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
              activeTab === tab
                ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-soft)]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Add Item Form */}
      {showAdd && activeTab === "items" && (
        <div className="card-base p-6">
          <h2 className="font-display text-base font-semibold text-[var(--text-primary)] mb-5">
            New Gallery Item
          </h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Caption *
              </label>
              <input
                value={form.caption}
                onChange={(e) => setForm((p) => ({ ...p, caption: e.target.value }))}
                required
                placeholder="Image caption"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Media URL *
              </label>
              <input
                value={form.mediaUrl}
                onChange={(e) => setForm((p) => ({ ...p, mediaUrl: e.target.value }))}
                required
                placeholder="https://..."
                className={inputClass}
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Type *
                </label>
                <select
                  value={form.mediaType}
                  onChange={(e) => setForm((p) => ({ ...p, mediaType: e.target.value as MediaType }))}
                  className={inputClass}
                >
                  <option value="PHOTO">Photo</option>
                  <option value="VIDEO">Video</option>
                  <option value="CLIPPING">Press Clipping</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((p) => ({ ...p, sortOrder: +e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {saving ? "Saving..." : "Save Item"}
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-5 py-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] text-sm font-medium hover:border-primary-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items Tab */}
      {activeTab === "items" && (
        <div className="card-base overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center">
              <Image className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-muted)]">No gallery items yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
              {items.map((item) => {
                const Icon = mediaIcons[item.mediaType];
                return (
                  <div
                    key={item.id}
                    className="p-4 border-b border-r border-[var(--border)] group relative"
                  >
                    <div className="w-full h-32 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center mb-3 overflow-hidden">
                      {item.mediaUrl ? (
                        <img
                          src={item.mediaUrl}
                          alt={item.caption}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-8 h-8 text-[var(--text-muted)]" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-[var(--text-soft)] line-clamp-2 mb-2">
                      {item.caption}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${mediaColors[item.mediaType]}`}>
                        {item.mediaType}
                      </span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowCatAdd(!showCatAdd)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-primary-300 text-[var(--text-soft)] text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>

          {showCatAdd && (
            <div className="card-base p-5">
              <form onSubmit={handleAddCat} className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-40">
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                    Name *
                  </label>
                  <input
                    value={catForm.name}
                    onChange={(e) =>
                      setCatForm((p) => ({
                        ...p,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      }))
                    }
                    required
                    placeholder="Category name"
                    className={inputClass}
                  />
                </div>
                <div className="flex-1 min-w-40">
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                    Slug *
                  </label>
                  <input
                    value={catForm.slug}
                    onChange={(e) => setCatForm((p) => ({ ...p, slug: e.target.value }))}
                    required
                    placeholder="category-slug"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  {saving ? "Saving..." : "Add"}
                </button>
              </form>
            </div>
          )}

          <div className="card-base divide-y divide-[var(--border)]">
            {categories.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-[var(--text-muted)]">No categories yet.</p>
              </div>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{cat.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{cat.slug}</p>
                  </div>
                  <button
                    onClick={() => deleteCat(cat.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}