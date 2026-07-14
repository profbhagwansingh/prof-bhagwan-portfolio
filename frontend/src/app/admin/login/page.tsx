"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, AlertCircle } from "lucide-react";
import api from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/auth/login", form);
      localStorage.setItem("admin_token", res.data.accessToken);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-500 shadow-lg mb-4">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">Admin Portal</h1>
          <p className="text-sm text-white/40 mt-1">Prof. (Dr.) Bhagwan Singh</p>
        </div>

        {/* Card */}
        <div className="bg-[#1e1e32] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="font-display text-lg font-semibold text-white mb-6">Sign in to continue</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
                placeholder="admin@bhagwansingh.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Protected area — authorised personnel only
        </p>
      </div>
    </div>
  );
}