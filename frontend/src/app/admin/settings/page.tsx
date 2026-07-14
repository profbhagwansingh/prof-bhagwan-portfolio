"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import api from "@/lib/api";

interface Setting {
  key: string;
  value: string;
  category: string;
}

const defaultSettings = [
  { key: "site_title",       value: "Prof. (Dr.) Bhagwan Singh",        category: "general" },
  { key: "site_tagline",     value: "Care for People, Planet & Peace",  category: "general" },
  { key: "contact_email",    value: "bhagwansingh@dsmm.ac.in",          category: "contact" },
  { key: "whatsapp_number",  value: "",                                  category: "contact" },
  { key: "office_address",   value: "DSMM College, India",              category: "contact" },
  { key: "orcid_id",         value: "0000-0000-0000-0000",              category: "academic" },
  { key: "irins_id",         value: "121293",                           category: "academic" },
  { key: "google_scholar",   value: "#",                                category: "academic" },
  { key: "scopus_id",        value: "57216082742",                      category: "academic" },
  { key: "service_period",   value: "12.03.2020 to Current",            category: "academic" },
  { key: "previous_experience", value: "20 Years",                      category: "academic" },
  { key: "researchgate_url", value: "",                                 category: "academic" },
  { key: "journal_filters",  value: "British Food Journal (Emerald Publishing Limited), SMS Journal of Entrepreneurship & Innovation, Journal of Content, Community & Communication, Global Journal of Enterprise Information System, Education and Society, Indian Journal of Commerce Association, Society and Business Review, CSI Communications, Business Strategy & Development (John Wiley & Sons Ltd and ERP Environment), Arni University International Journal, International Journal of Economics & Managerial Thoughts, Pacific Business Review, Asian Journal of Multidisciplinary Studies (AJMS), Commerce Spectrum (International Journal of Commerce & Business Studies), International Journal of Commerce & Social Sciences, Aatmbodh", category: "filters" }
];

const categoryLabels: Record<string, string> = {
  general:  "General",
  contact:  "Contact Details",
  academic: "Academic Profiles",
  filters:  "Dropdown Filters",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    api.get("/api/settings/admin/all")
      .then((r) => {
        const map: Record<string, string> = {};
        (r.data as Setting[]).forEach((s) => { map[s.key] = s.value; });
        // Fill defaults for any missing keys
        defaultSettings.forEach((d) => {
          if (!map[d.key]) map[d.key] = d.value;
        });
        setSettings(map);
      })
      .catch(() => {
        const map: Record<string, string> = {};
        defaultSettings.forEach((d) => { map[d.key] = d.value; });
        setSettings(map);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        defaultSettings.map((d) =>
          api.post("/api/settings/admin/upsert", {
            key:      d.key,
            value:    settings[d.key] ?? "",
            category: d.category,
          })
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const grouped = defaultSettings.reduce<Record<string, typeof defaultSettings>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  const inputClass = "w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-primary-400 transition-all";
  const labelClass = "block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Settings</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage site-wide configuration.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
        >
          {saved ? (
            <><CheckCircle className="w-4 h-4" /> Saved!</>
          ) : saving ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="card-base p-6 space-y-5">
          <h2 className="font-display text-base font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border)]">
            {categoryLabels[category]}
          </h2>
          {items.map((setting) => (
            <div key={setting.key}>
              <label className={labelClass}>
                {setting.key.replace(/_/g, " ")}
              </label>
              {setting.key === "journal_filters" ? (
                <textarea
                  value={settings[setting.key] ?? ""}
                  onChange={(e) => setSettings((p) => ({ ...p, [setting.key]: e.target.value }))}
                  placeholder="Comma-separated list of journals"
                  className={inputClass}
                  rows={6}
                />
              ) : (
                <input
                  value={settings[setting.key] ?? ""}
                  onChange={(e) => setSettings((p) => ({ ...p, [setting.key]: e.target.value }))}
                  placeholder={setting.value || `Enter ${setting.key.replace(/_/g, " ")}`}
                  className={inputClass}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}