"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, LayoutDashboard, FileText, Image,
  Users, MessageSquare, Settings, LogOut, Menu, X,
  BookOpen, Bell, ChevronRight, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/publications", label: "Publications", icon: FileText },
  { href: "/admin/gallery",      label: "Gallery",      icon: Image },
  { href: "/admin/content",      label: "Content",      icon: BookOpen },
  { href: "/admin/submissions",  label: "Submissions",  icon: MessageSquare },
  { href: "/admin/alumni",       label: "Alumni",       icon: Users },
  { href: "/admin/users",        label: "Users",        icon: Shield },
  { href: "/admin/settings",     label: "Settings",     icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted,     setMounted]     = useState(false);

  useEffect(() => {
    setMounted(true);
    // Guard: redirect to login if no token
    if (pathname !== "/admin/login") {
      const token = localStorage.getItem("admin_token");
      if (!token) router.push("/admin/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  // Login page renders without admin layout
  if (pathname === "/admin/login") return <>{children}</>;
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex bg-[var(--bg-secondary)]">

      {/* ── Sidebar ── */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={cn(
          "fixed top-0 left-0 h-full w-64 bg-[#0f0f1a] flex flex-col z-40 transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:flex",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Brand */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate font-display">Admin Portal</p>
              <p className="text-xs text-white/30 truncate">Prof. Bhagwan Singh</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                    active
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="w-3 h-3 opacity-60" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 pb-4 border-t border-white/5 pt-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all mb-1"
            >
              <Bell className="w-4 h-4" />
              View Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>
      </>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top bar */}
        <header className="h-16 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title — derived from pathname */}
          <p className="font-display font-semibold text-[var(--text-primary)] capitalize">
            {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
          </p>

          {/* Admin badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-sm font-medium text-[var(--text-soft)] hidden sm:block">Super Admin</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}