"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Phone, GraduationCap, Trash2, Eye, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

type Status = "NEW" | "REVIEWED" | "APPROVED" | "ARCHIVED";

interface Alumni {
  id: string;
  fullName: string;
  email: string;
  whatsapp?: string;
  degreeProgram: string;
  institute: string;
  batchYear: number;
  rollNumber?: string;
  teachingMode: string;
  message?: string;
  pictureUrl?: string;
  status: Status;
  createdAt: string;
}

const statusConfig: Record<Status, { label: string; class: string }> = {
  NEW:      { label: "New",      class: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300" },
  REVIEWED: { label: "Reviewed", class: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400" },
  APPROVED: { label: "Approved", class: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300" },
  ARCHIVED: { label: "Archived", class: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300" },
};

export default function AlumniAdminPage() {
  const [alumni,   setAlumni]   = useState<Alumni[]>([]);
  const [selected, setSelected] = useState<Alumni | null>(null);
  const [loading,  setLoading]  = useState(true);

  const fetchAlumni = () => {
    api.get("/api/submissions/admin/alumni")
      .then((r) => setAlumni(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAlumni(); }, []);

  const updateStatus = async (id: string, status: Status) => {
    await api.patch(`/api/submissions/admin/alumni/${id}/status`, { status });
    fetchAlumni();
    if (selected?.id === id) setSelected((p) => p ? { ...p, status } : null);
  };

  const deleteAlumni = async (id: string) => {
    if (!confirm("Delete this registration?")) return;
    await api.delete(`/api/submissions/admin/alumni/${id}`);
    setSelected(null);
    fetchAlumni();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Alumni Registrations</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {alumni.length} registration{alumni.length !== 1 ? "s" : ""} total
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-base p-4 animate-pulse">
                <div className="h-4 bg-[var(--border)] rounded w-1/2 mb-2" />
                <div className="h-3 bg-[var(--border)] rounded w-3/4" />
              </div>
            ))
          ) : alumni.length === 0 ? (
            <div className="card-base p-8 text-center">
              <Users className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-muted)]">No registrations yet.</p>
            </div>
          ) : (
            alumni.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelected(a)}
                className={cn(
                  "card-base p-4 cursor-pointer transition-all",
                  selected?.id === a.id ? "border-primary-400 bg-[var(--accent-light)]" : ""
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{a.fullName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${statusConfig[a.status].class}`}>
                    {statusConfig[a.status].label}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{a.degreeProgram} · {a.batchYear}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{a.institute}</p>
              </div>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card-base p-6 space-y-5">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {selected.pictureUrl
                    ? <img src={selected.pictureUrl} alt={selected.fullName} className="w-full h-full object-cover" />
                    : <GraduationCap className="w-8 h-8 text-white" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">{selected.fullName}</h2>
                  <p className="text-sm text-primary-500">{selected.degreeProgram} · Batch {selected.batchYear}</p>
                  <p className="text-sm text-[var(--text-muted)]">{selected.institute}</p>
                </div>
                <button onClick={() => deleteAlumni(selected.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Email",         value: selected.email,        icon: Mail },
                  { label: "WhatsApp",      value: selected.whatsapp || "—", icon: Phone },
                  { label: "Teaching Mode", value: selected.teachingMode, icon: GraduationCap },
                  { label: "Roll Number",   value: selected.rollNumber || "—", icon: Users },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3 h-3 text-primary-500" />
                      <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-sm text-[var(--text-soft)] truncate">{value}</p>
                  </div>
                ))}
              </div>

              {selected.message && (
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Message</p>
                  <p className="text-sm text-[var(--text-soft)] leading-relaxed">{selected.message}</p>
                </div>
              )}

              {/* Status actions */}
              <div className="flex flex-wrap gap-2">
                {(["NEW", "REVIEWED", "APPROVED", "ARCHIVED"] as Status[]).map((s) => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      selected.status === s
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-primary-300"
                    )}>
                    {statusConfig[s].label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="card-base p-12 text-center">
              <Eye className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-muted)]">Select a registration to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}