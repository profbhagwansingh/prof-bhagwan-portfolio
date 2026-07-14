"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Users,
  X,
  Check,
  Shield,
  ShieldCheck,
  Edit3,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

const emptyForm = {
  email: "",
  fullName: "",
  password: "",
  role: "EDITOR" as Role,
};

const ROLE_META: Record<Role, { label: string; icon: typeof Shield; color: string }> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    icon: ShieldCheck,
    color: "bg-red-50 text-red-600 border-red-200",
  },
  ADMIN: {
    label: "Admin",
    icon: Shield,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  EDITOR: {
    label: "Editor",
    icon: Edit3,
    color: "bg-green-50 text-green-600 border-green-200",
  },
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = () => {
    setError(null);
    api
      .get("/api/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Users fetch failed:", err);
        setError("Failed to load users. You may not have permission.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/api/users", form);
      setForm(emptyForm);
      setShowForm(false);
      fetchUsers();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to create user.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: AdminUser) => {
    try {
      await api.put(`/api/users/${user.id}`, { isActive: !user.isActive });
      fetchUsers();
    } catch {
      alert("Failed to update user.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      fetchUsers();
    } catch {
      alert("Failed to delete user.");
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] " +
    "text-[var(--text-primary)] text-sm focus:outline-none focus:border-primary-400 transition-all";
  const labelClass =
    "block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            User Management
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {users.length} {users.length === 1 ? "user" : "users"} ·{" "}
            {users.filter((u) => u.isActive).length} active
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchUsers} className="text-xs underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
              New User
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                  required
                  placeholder="e.g. Dr. Anjali Sharma"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  placeholder="user@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    required
                    minLength={8}
                    placeholder="Min 8 characters"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Role *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as Role }))}
                  className={inputClass}
                >
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <Check className="w-4 h-4" />
                {saving ? "Creating..." : "Create User"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] text-sm font-medium hover:border-primary-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      {loading ? (
        <div className="card-base p-10 text-center">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : users.length === 0 ? (
        <div className="card-base p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-3">
            <Users className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm text-[var(--text-muted)]">No users found.</p>
        </div>
      ) : (
        <div className="card-base overflow-hidden divide-y divide-[var(--border)]">
          {users.map((user) => {
            const roleMeta = ROLE_META[user.role];
            const RoleIcon = roleMeta.icon;
            return (
              <div
                key={user.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 group hover:bg-[var(--bg-secondary)] transition-colors",
                  !user.isActive && "opacity-50"
                )}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-600">
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {user.fullName}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border font-medium inline-flex items-center gap-1",
                        roleMeta.color
                      )}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {roleMeta.label}
                    </span>
                    {!user.isActive && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)]">
                        disabled
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{user.email}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                    {user.lastLogin &&
                      ` · Last login ${new Date(user.lastLogin).toLocaleDateString()}`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(user)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:bg-primary-50 transition-all"
                    title={user.isActive ? "Disable" : "Enable"}
                  >
                    {user.isActive ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
