"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, Image, Users, MessageSquare,
  TrendingUp, BookOpen, ArrowRight, Clock,
  RefreshCw, Activity, Search, Shield, Sparkles,
  GraduationCap, Award, Bell, Briefcase, BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface DashboardStats {
  contacts: { total: number; new: number };
  alumni: { total: number; new: number };
  publications: number;
  galleryItems: number;
  slideshowImages: number;
  courses: number;
  scholars: number;
  timeline: number;
  books: number;
  achievements: number;
  announcements: number;
  recentActivity: {
    id: string;
    type: "contact" | "alumni";
    text: string;
    time: string;
    status: string;
  }[];
}

const quickLinks = [
  { href: "/admin/publications", label: "Manage Publications", icon: FileText,      color: "bg-blue-500",    hoverGlow: "hover:shadow-blue-500/20" },
  { href: "/admin/gallery",      label: "Manage Gallery",      icon: Image,         color: "bg-purple-500",  hoverGlow: "hover:shadow-purple-500/20" },
  { href: "/admin/submissions",  label: "View Messages",       icon: MessageSquare, color: "bg-emerald-500", hoverGlow: "hover:shadow-emerald-500/20" },
  { href: "/admin/alumni",       label: "Alumni Registrations", icon: Users,         color: "bg-amber-500",   hoverGlow: "hover:shadow-amber-500/20" },
  { href: "/admin/content",      label: "Edit Content",        icon: BookOpen,      color: "bg-rose-500",    hoverGlow: "hover:shadow-rose-500/20" },
  { href: "/admin/settings",     label: "Site Settings",       icon: TrendingUp,    color: "bg-cyan-500",    hoverGlow: "hover:shadow-cyan-500/20" },
  { href: "/admin/seo",          label: "SEO Settings",        icon: Search,        color: "bg-indigo-500",  hoverGlow: "hover:shadow-indigo-500/20" },
  { href: "/admin/users",        label: "Manage Users",        icon: Shield,        color: "bg-pink-500",    hoverGlow: "hover:shadow-pink-500/20" },
  { href: "/admin/gallery?tab=slideshow", label: "Slideshow Manager", icon: Sparkles, color: "bg-gradient-to-br from-indigo-500 to-purple-600", hoverGlow: "hover:shadow-purple-500/20" },
];

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const [stats,      setStats]      = useState<DashboardStats | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const { data } = await api.get("/api/submissions/admin/stats");
      setStats(data);
    } catch {
      setStats({
        contacts: { total: 0, new: 0 },
        alumni: { total: 0, new: 0 },
        publications: 0,
        galleryItems: 0,
        slideshowImages: 0,
        courses: 0,
        scholars: 0,
        timeline: 0,
        books: 0,
        achievements: 0,
        announcements: 0,
        recentActivity: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => fetchStats(true), 60_000);
    return () => clearInterval(interval);
  }, []);

  // ─── Primary stat cards (top row) ────────────────────────
  const primaryCards = [
    {
      label: "Total Messages",
      value: stats?.contacts.total ?? "—",
      sub: `${stats?.contacts.new ?? 0} new`,
      icon: MessageSquare,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
      href: "/admin/submissions",
      badge: stats?.contacts.new,
      badgeColor: "bg-emerald-500",
    },
    {
      label: "Alumni Registrations",
      value: stats?.alumni.total ?? "—",
      sub: `${stats?.alumni.new ?? 0} new`,
      icon: Users,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      ring: "ring-amber-500/20",
      href: "/admin/alumni",
      badge: stats?.alumni.new,
      badgeColor: "bg-amber-500",
    },
    {
      label: "Publications",
      value: stats?.publications ?? "—",
      sub: "In database",
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      ring: "ring-blue-500/20",
      href: "/admin/publications",
    },
    {
      label: "Gallery Items",
      value: stats?.galleryItems ?? "—",
      sub: `${stats?.slideshowImages ?? 0} in slideshow`,
      icon: Image,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      ring: "ring-purple-500/20",
      href: "/admin/gallery",
    },
  ];

  // ─── Content overview cards (secondary row) ──────────────
  const contentCards = [
    { label: "Slideshow",    value: stats?.slideshowImages ?? "—", icon: Sparkles,       color: "text-violet-500",  bg: "bg-violet-500/10",  href: "/admin/gallery?tab=slideshow" },
    { label: "Courses",      value: stats?.courses ?? "—",         icon: BookOpen,       color: "text-teal-500",    bg: "bg-teal-500/10",    href: "/admin/content/courses" },
    { label: "PhD Scholars", value: stats?.scholars ?? "—",        icon: GraduationCap,  color: "text-indigo-500",  bg: "bg-indigo-500/10",  href: "/admin/content/scholars" },
    { label: "Timeline",     value: stats?.timeline ?? "—",        icon: Briefcase,      color: "text-sky-500",     bg: "bg-sky-500/10",     href: "/admin/content/timeline" },
    { label: "Books",        value: stats?.books ?? "—",           icon: BookMarked,     color: "text-orange-500",  bg: "bg-orange-500/10",  href: "/admin/content" },
    { label: "Achievements", value: stats?.achievements ?? "—",    icon: Award,          color: "text-rose-500",    bg: "bg-rose-500/10",    href: "/admin/content/achievements" },
    { label: "Announcements",value: stats?.announcements ?? "—",   icon: Bell,           color: "text-cyan-500",    bg: "bg-cyan-500/10",    href: "/admin/content/announcements" },
  ];

  const activityColors: Record<string, string> = {
    contact: "bg-emerald-500",
    alumni: "bg-amber-500",
  };

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Welcome + Refresh */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            Welcome back 👋
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Here's what's happening on the portfolio today.
          </p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium",
            "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-soft)]",
            "hover:text-primary-500 hover:border-primary-500/30 transition-all",
            "disabled:opacity-50"
          )}
        >
          <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* ─── Primary Stat Cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {primaryCards.map(({ label, value, sub, icon: Icon, color, bg, ring, href, badge, badgeColor }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "card-base p-5 group ring-1 ring-transparent hover:ring-1",
              `hover:${ring}`,
              "transition-all duration-200 hover:shadow-lg"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              {!loading && badge != null && badge > 0 && (
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold text-white animate-pulse", badgeColor)}>
                  {badge}
                </span>
              )}
              {loading && <div className="w-8 h-4 rounded bg-[var(--border)] animate-pulse" />}
            </div>
            <p className="font-display text-2xl font-bold text-[var(--text-primary)] group-hover:text-primary-500 transition-colors">
              {loading ? <span className="inline-block w-10 h-7 rounded bg-[var(--border)] animate-pulse" /> : value}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{label}</p>
            <p className="text-xs text-primary-500 mt-1 font-medium">{loading ? "..." : sub}</p>
          </Link>
        ))}
      </div>

      {/* ─── Content Overview ───────────────────────────────── */}
      <div>
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Content Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {contentCards.map(({ label, value, icon: Icon, color, bg, href }) => (
            <Link
              key={label}
              href={href}
              className="card-base p-4 group text-center hover:shadow-md transition-all duration-200"
            >
              <div className={cn("w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <p className="font-display text-xl font-bold text-[var(--text-primary)] group-hover:text-primary-500 transition-colors">
                {loading ? <span className="inline-block w-6 h-6 rounded bg-[var(--border)] animate-pulse" /> : value}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-tight">{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Quick Actions ──────────────────────────────────── */}
      <div>
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map(({ href, label, icon: Icon, color, hoverGlow }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "card-base p-4 flex items-center gap-3 group",
                "hover:shadow-lg transition-all duration-200",
                hoverGlow
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                "group-hover:scale-110 transition-transform duration-200",
                color
              )}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-[var(--text-soft)] group-hover:text-[var(--text-primary)] transition-colors flex-1 leading-tight">
                {label}
              </span>
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Recent Activity ────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-5 h-5 text-primary-500" />
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Recent Activity
          </h2>
        </div>
        <div className="card-base divide-y divide-[var(--border)]">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-2 h-2 rounded-full bg-[var(--border)] animate-pulse" />
                <div className="flex-1 h-4 rounded bg-[var(--border)] animate-pulse" />
                <div className="w-16 h-3 rounded bg-[var(--border)] animate-pulse" />
              </div>
            ))
          ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map(({ id, type, text, time, status }) => (
              <div key={id} className="flex items-center gap-4 px-5 py-4 group hover:bg-[var(--bg-secondary)]/50 transition-colors">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", activityColors[type] || "bg-gray-500")} />
                <p className="text-sm text-[var(--text-soft)] flex-1">{text}</p>
                {status === "NEW" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-500/10 text-primary-500 uppercase tracking-wider">
                    New
                  </span>
                )}
                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {timeAgo(time)}
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-[var(--text-muted)]">No recent activity yet.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Activity will appear here as visitors interact with the site.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}