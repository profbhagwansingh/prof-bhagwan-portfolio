"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle, Globe, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface SeoEntry {
  pageSlug: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
}

const PAGES = [
  { slug: "home",         label: "Home",         path: "/" },
  { slug: "about",        label: "About",        path: "/about" },
  { slug: "publications", label: "Publications",  path: "/publications" },
  { slug: "gallery",      label: "Gallery",      path: "/gallery" },
  { slug: "contact",      label: "Talk to Prof", path: "/contact" },
  { slug: "alumni",       label: "Alumni Connect", path: "/alumni" },
];

const emptyEntry = (slug: string): SeoEntry => ({
  pageSlug: slug,
  metaTitle: "",
  metaDescription: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  canonicalUrl: "",
});

export default function SeoSettingsPage() {
  const [entries, setEntries] = useState<SeoEntry[]>([]);
  const [activePage, setActivePage] = useState<string>("home");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all SEO entries
  useEffect(() => {
    const fetchAll = async () => {
      const results: SeoEntry[] = [];
      for (const page of PAGES) {
        try {
          const res = await api.get(`/api/settings/seo/${page.slug}`);
          results.push({
            pageSlug: page.slug,
            metaTitle: res.data?.metaTitle || "",
            metaDescription: res.data?.metaDescription || "",
            ogTitle: res.data?.ogTitle || "",
            ogDescription: res.data?.ogDescription || "",
            ogImage: res.data?.ogImage || "",
            canonicalUrl: res.data?.canonicalUrl || "",
          });
        } catch {
          results.push(emptyEntry(page.slug));
        }
      }
      setEntries(results);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const activeEntry = entries.find((e) => e.pageSlug === activePage) || emptyEntry(activePage);
  const activePageInfo = PAGES.find((p) => p.slug === activePage)!;

  const updateField = (field: keyof SeoEntry, value: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.pageSlug === activePage ? { ...e, [field]: value } : e
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/api/settings/seo/${activePage}`, activeEntry);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save SEO settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await Promise.all(
        entries.map((entry) =>
          api.put(`/api/settings/seo/${entry.pageSlug}`, entry)
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save all SEO settings.");
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
      <div className="flex items-center justify-center p-20">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              SEO Settings
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              Manage meta tags, Open Graph, and canonical URLs per page.
            </p>
          </div>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
        >
          {saved ? (
            <><CheckCircle className="w-4 h-4" /> Saved!</>
          ) : saving ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-4 h-4" /> Save All Pages</>
          )}
        </button>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Page Selector */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="card-base overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Pages
              </p>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {PAGES.map((page) => {
                const entry = entries.find((e) => e.pageSlug === page.slug);
                const hasData = entry && (entry.metaTitle || entry.metaDescription);
                return (
                  <button
                    key={page.slug}
                    onClick={() => setActivePage(page.slug)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-sm transition-colors text-left",
                      activePage === page.slug
                        ? "bg-primary-50 text-primary-600 font-medium"
                        : "text-[var(--text-soft)] hover:bg-[var(--bg-secondary)]"
                    )}
                  >
                    <span>{page.label}</span>
                    {hasData ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[var(--border)] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SEO Form */}
        <div className="flex-1">
          <div className="card-base p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
              <Globe className="w-4 h-4 text-primary-500" />
              <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
                {activePageInfo.label}
              </h2>
              <span className="text-xs text-[var(--text-muted)] ml-auto font-mono">
                {activePageInfo.path}
              </span>
            </div>

            {/* Meta Title */}
            <div>
              <label className={labelClass}>
                Meta Title
                <span className="text-[var(--text-muted)] font-normal ml-2">
                  ({activeEntry.metaTitle.length}/60)
                </span>
              </label>
              <input
                value={activeEntry.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
                placeholder="Page title for search engines..."
                maxLength={70}
                className={inputClass}
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className={labelClass}>
                Meta Description
                <span className="text-[var(--text-muted)] font-normal ml-2">
                  ({activeEntry.metaDescription.length}/160)
                </span>
              </label>
              <textarea
                value={activeEntry.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                placeholder="Brief description for search results..."
                maxLength={170}
                rows={3}
                className={cn(inputClass, "resize-none")}
              />
            </div>

            {/* OG Title */}
            <div>
              <label className={labelClass}>Open Graph Title</label>
              <input
                value={activeEntry.ogTitle}
                onChange={(e) => updateField("ogTitle", e.target.value)}
                placeholder="Title for social media shares (defaults to Meta Title)"
                className={inputClass}
              />
            </div>

            {/* OG Description */}
            <div>
              <label className={labelClass}>Open Graph Description</label>
              <textarea
                value={activeEntry.ogDescription}
                onChange={(e) => updateField("ogDescription", e.target.value)}
                placeholder="Description for social media shares..."
                rows={2}
                className={cn(inputClass, "resize-none")}
              />
            </div>

            {/* OG Image */}
            <div>
              <label className={labelClass}>Open Graph Image URL</label>
              <input
                value={activeEntry.ogImage}
                onChange={(e) => updateField("ogImage", e.target.value)}
                placeholder="https://... (recommended 1200×630px)"
                className={inputClass}
              />
              {activeEntry.ogImage && (
                <div className="mt-2">
                  <img
                    src={activeEntry.ogImage}
                    alt="OG preview"
                    className="w-full max-w-xs h-auto rounded-lg border border-[var(--border)]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Canonical URL */}
            <div>
              <label className={labelClass}>Canonical URL</label>
              <input
                value={activeEntry.canonicalUrl}
                onChange={(e) => updateField("canonicalUrl", e.target.value)}
                placeholder="https://bhagwansingh.com/about (auto-generated if empty)"
                className={inputClass}
              />
            </div>

            {/* Search Preview */}
            <div className="pt-4 border-t border-[var(--border)]">
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Google Search Preview
              </p>
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <p className="text-[#1a0dab] text-lg leading-tight font-medium truncate">
                  {activeEntry.metaTitle || `${activePageInfo.label} | Prof. (Dr.) Bhagwan Singh`}
                </p>
                <p className="text-[#006621] text-sm mt-0.5 truncate">
                  {activeEntry.canonicalUrl || `https://bhagwansingh.com${activePageInfo.path}`}
                </p>
                <p className="text-[#545454] text-sm mt-1 line-clamp-2">
                  {activeEntry.metaDescription || "No description set. Add one to improve click-through rates."}
                </p>
              </div>
            </div>

            {/* Save single page */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : `Save ${activePageInfo.label}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
