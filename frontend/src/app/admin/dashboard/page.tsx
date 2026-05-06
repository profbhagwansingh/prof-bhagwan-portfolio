"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, Image, Users, MessageSquare,
  TrendingUp, BookOpen, ArrowRight, Clock,
} from "lucide-react";
import api from "@/lib/api";

interface Stats {
  contacts: { total: number; new: number };
  alumni:   { total: number; new: number };
}

const quickLinks = [
  { href: "/admin/publications", label: "Manage Publications", icon: FileText,      color: "bg-blue-500" },
  { href: "/admin/gallery",      label: "Manage Gallery",      icon: Image,         color: "bg-purple-500" },
  { href: "/admin/submissions",  label: "View Messages",       icon: MessageSquare, color: "bg-emerald-500" },
  { href: "/admin/alumni",       label: "Alumni Registrations",icon: Users,         color: "bg-amber-500" },
  { href: "/admin/content",      label: "Edit Content",        icon: BookOpen,      color: "bg-rose-500" },
  { href: "/admin/settings",     label: "Site Settings",       icon: TrendingUp,    color: "bg-cyan-500" },
];

export default function DashboardPage() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/submissions/admin/stats")
      .then((r) => setStats(r.data))
      .catch(() => setStats({ contacts: { total: 0, new: 0 }, alumni: { total: 0, new: 0 } }))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Messages",       value: stats?.contacts.total ?? "—", sub: `${stats?.contacts.new ?? 0} new`,  icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Alumni Registrations", value: stats?.alumni.total   ?? "—", sub: `${stats?.alumni.new   ?? 0} new`,  icon: Users,         color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-950" },
    { label: "Publications",         value: "12",                          sub: "In database",                       icon: FileText,      color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-950" },
    { label: "Gallery Items",        value: "15",                          sub: "Photos & videos",                   icon: Image,         color: "text-purple-500",  bg: "bg-purple-50 dark:bg-purple-950" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Welcome */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
          Welcome back 👋
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Here's what's happening on the portfolio today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="card-base p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              {loading && (
                <div className="w-8 h-4 rounded bg-[var(--border)] animate-pulse" />
              )}
            </div>
            <p className="font-display text-2xl font-bold text-[var(--text-primary)]">{value}</p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{label}</p>
            <p className="text-xs text-primary-500 mt-1 font-medium">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="card-base p-5 flex items-center gap-4 group"
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-[var(--text-soft)] group-hover:text-[var(--text-primary)] transition-colors flex-1">
                {label}
              </span>
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div>
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-5">
          Recent Activity
        </h2>
        <div className="card-base divide-y divide-[var(--border)]">
          {[
            { text: "New contact message received",    time: "2 min ago",  color: "bg-emerald-500" },
            { text: "Alumni registration submitted",   time: "1 hr ago",   color: "bg-amber-500" },
            { text: "Gallery item added",              time: "3 hrs ago",  color: "bg-purple-500" },
            { text: "Publication entry updated",       time: "Yesterday",  color: "bg-blue-500" },
          ].map(({ text, time, color }) => (
            <div key={text} className="flex items-center gap-4 px-5 py-4">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
              <p className="text-sm text-[var(--text-soft)] flex-1">{text}</p>
              <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] flex-shrink-0">
                <Clock className="w-3 h-3" />
                {time}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}