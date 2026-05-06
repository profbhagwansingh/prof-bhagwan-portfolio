"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Mail, Phone, Clock, Trash2, Eye, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

type Status = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

interface Contact {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  message: string;
  status: Status;
  createdAt: string;
}

const statusConfig: Record<Status, { label: string; class: string }> = {
  NEW:      { label: "New",      class: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300" },
  READ:     { label: "Read",     class: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400" },
  REPLIED:  { label: "Replied",  class: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300" },
  ARCHIVED: { label: "Archived", class: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300" },
};

export default function SubmissionsPage() {
  const [contacts,  setContacts]  = useState<Contact[]>([]);
  const [selected,  setSelected]  = useState<Contact | null>(null);
  const [loading,   setLoading]   = useState(true);

  const fetchContacts = () => {
    api.get("/api/submissions/admin/contacts")
      .then((r) => setContacts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchContacts(); }, []);

  const updateStatus = async (id: string, status: Status) => {
    await api.patch(`/api/submissions/admin/contacts/${id}/status`, { status });
    fetchContacts();
    if (selected?.id === id) setSelected((p) => p ? { ...p, status } : null);
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await api.delete(`/api/submissions/admin/contacts/${id}`);
    setSelected(null);
    fetchContacts();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Submissions</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Contact messages from visitors.</p>
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
          ) : contacts.length === 0 ? (
            <div className="card-base p-8 text-center">
              <MessageSquare className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-muted)]">No messages yet.</p>
            </div>
          ) : (
            contacts.map((c) => (
              <div
                key={c.id}
                onClick={() => { setSelected(c); updateStatus(c.id, "READ"); }}
                className={cn(
                  "card-base p-4 cursor-pointer transition-all",
                  selected?.id === c.id ? "border-primary-400 bg-[var(--accent-light)]" : ""
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{c.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${statusConfig[c.status].class}`}>
                    {statusConfig[c.status].label}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate mb-1">{c.email}</p>
                <p className="text-xs text-[var(--text-soft)] line-clamp-2">{c.message}</p>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card-base p-6 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">{selected.name}</h2>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-1 text-xs text-primary-500 hover:underline">
                      <Mail className="w-3 h-3" /> {selected.email}
                    </a>
                    {selected.whatsapp && (
                      <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <Phone className="w-3 h-3" /> {selected.whatsapp}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <Clock className="w-3 h-3" />
                      {new Date(selected.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteContact(selected.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Message */}
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                <p className="text-sm text-[var(--text-soft)] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {(["NEW", "READ", "REPLIED", "ARCHIVED"] as Status[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      selected.status === s
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-primary-300"
                    )}
                  >
                    {statusConfig[s].label}
                  </button>
                ))}
                
                <a
                  href={`mailto:${selected.email}`}
                  onClick={() => updateStatus(selected.id, "REPLIED")}
                  className="ml-auto px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="card-base p-12 text-center">
              <Eye className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-muted)]">Select a message to read it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}