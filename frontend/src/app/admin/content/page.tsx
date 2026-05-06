"use client";

import { useState } from "react";
import { BookOpen, Clock, Award, GraduationCap, Users, Bell } from "lucide-react";
import Link from "next/link";

const contentSections = [
  {
    href:  "/admin/content/timeline",
    icon:  Clock,
    label: "Experience Timeline",
    desc:  "Add, edit, or remove career timeline entries.",
    color: "bg-blue-500",
  },
  {
    href:  "/admin/content/courses",
    icon:  BookOpen,
    label: "Courses Taught",
    desc:  "Manage the list of courses with syllabus links.",
    color: "bg-emerald-500",
  },
  {
    href:  "/admin/content/achievements",
    icon:  Award,
    label: "Awards & Achievements",
    desc:  "Update recognition and award entries.",
    color: "bg-amber-500",
  },
  {
    href:  "/admin/content/scholars",
    icon:  GraduationCap,
    label: "PhD Scholars",
    desc:  "Manage PhD scholar profiles and status.",
    color: "bg-purple-500",
  },
  {
    href:  "/admin/content/social-links",
    icon:  Users,
    label: "Social Links",
    desc:  "Update social media and external profile links.",
    color: "bg-rose-500",
  },
  {
    href:  "/admin/content/announcements",
    icon:  Bell,
    label: "Announcements",
    desc:  "Publish or archive site announcements.",
    color: "bg-cyan-500",
  },
];

export default function ContentAdminPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Content Management</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Manage all dynamic content sections of the portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentSections.map(({ href, icon: Icon, label, desc, color }) => (
          <Link
            key={href}
            href={href}
            className="card-base p-5 group flex flex-col gap-4"
          >
            <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-sm font-semibold text-[var(--text-primary)] mb-1">{label}</h2>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}