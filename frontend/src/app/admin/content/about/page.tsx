"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface AboutContent {
  id?: string;
  sectionKey: string;
  title: string;
  content: string; // JSON string containing subtitle and text
  imageUrl: string | null;
  isActive: boolean;
}

export default function AboutAdminPage() {
  const sectionKey = "main_about";
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    id: "",
    title: "Care for People, Planet & Peace",
    subtitle: "Distinguished Professor of Management",
    text: "With a career spanning over 25 years...\n\nHis research primarily focuses on...",
    imageUrl: "/media/img/slideshow/img_8_1743658756162.jpg",
  });

  const fetchContent = () => {
    api.get(`/api/content/admin/about?t=${Date.now()}`)
      .then((res) => {
        const data = res.data;
        const allItems: AboutContent[] = Array.isArray(data) ? data : (data?.data ?? []);
        const item = allItems.find(i => i.sectionKey === sectionKey);
        
        if (item) {
          let subtitle = "";
          let text = "";
          
          try {
            const parsed = JSON.parse(item.content);
            subtitle = parsed.subtitle || "";
            text = parsed.text || "";
          } catch (e) {
            // Fallback if not JSON
            text = item.content;
          }
          
          setForm({
            id: item.id || "",
            title: item.title,
            subtitle,
            text,
            imageUrl: item.imageUrl || "",
          });
        }
      })
      .catch((err) => {
        console.error("Content fetch failed:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchContent(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Stringify the subtitle and text into the content field
    const jsonContent = JSON.stringify({
      subtitle: form.subtitle,
      text: form.text
    });
    
    try {
      await api.post("/api/content/admin/about", {
        id: form.id || undefined,
        sectionKey,
        title: form.title,
        content: jsonContent,
        imageUrl: form.imageUrl || null,
        isActive: true,
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

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
            <Link href="/admin/content" className="hover:text-primary-500 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to Content
            </Link>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            About Section
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Update the title, subtitle, paragraphs, and profile image for the main About section.
          </p>
        </div>
      </div>

      <div className="card-base p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className={labelClass}>Main Title (h2) *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              placeholder="e.g. Care for People, Planet & Peace"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Subtitle (h3) *</label>
            <input
              value={form.subtitle}
              onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
              required
              placeholder="e.g. Distinguished Professor of Management"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Paragraph Text *</label>
            <textarea
              value={form.text}
              onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
              required
              rows={8}
              placeholder="Enter the main paragraphs here. Use new lines to separate paragraphs."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Image URL (Optional)</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              placeholder="/media/img/slideshow/img_8_1743658756162.jpg"
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
