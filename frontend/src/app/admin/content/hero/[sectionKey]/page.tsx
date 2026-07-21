"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface AboutContent {
  id?: string;
  sectionKey: string;
  title: string;
  content: string;
  imageUrl: string | null;
  isActive: boolean;
}

export default function HeroAdminPage({ params }: { params: { sectionKey: string } }) {
  const { sectionKey } = params;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AboutContent>({
    sectionKey,
    title: "",
    content: "",
    imageUrl: "",
    isActive: true,
  });

  const fetchContent = () => {
    api.get("/api/content/admin/about")
      .then((res) => {
        const data = res.data;
        const allItems: AboutContent[] = Array.isArray(data) ? data : (data?.data ?? []);
        const item = allItems.find(i => i.sectionKey === sectionKey);
        if (item) {
          setForm({
            ...item,
            imageUrl: item.imageUrl || "",
          });
        }
      })
      .catch((err) => {
        console.error("Content fetch failed:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchContent(); }, [sectionKey]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/content/admin/about", {
        ...form,
        imageUrl: form.imageUrl || null,
      });
      alert("Saved successfully!");
      fetchContent();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] " +
    "text-[var(--text-primary)] text-sm focus:outline-none focus:border-primary-400 transition-all";
  const labelClass =
    "block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5";

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const pageTitleMap: Record<string, string> = {
    "home-hero": "Home Page Hero",
    "about-hero": "About Page Hero",
    "publications-hero": "Publications Page Hero",
    "gallery-hero": "Gallery Page Hero",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
            <a href="/admin/content" className="hover:text-primary-500 transition-colors">Content</a>
            <span>/</span>
            <span className="capitalize">{sectionKey.replace("-", " ")}</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            {pageTitleMap[sectionKey] || "Hero Content"}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Update the title, text, and image for this section.
          </p>
        </div>
      </div>

      <div className="card-base p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Content Text *</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              required
              rows={6}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Image URL (Optional)</label>
            <input
              value={form.imageUrl || ""}
              onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              placeholder="/media/img/hero/image.jpg"
              className={inputClass}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >
              <Check className="w-4 h-4" />
              {saving ? "Saving..." : "Save Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
