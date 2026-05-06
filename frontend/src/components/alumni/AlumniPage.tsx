"use client";

import { useEffect, useState } from "react";
import { Send, CheckCircle, AlertCircle, Upload, X } from "lucide-react";
import api from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

const teachingModes   = ["Regular", "Distance", "Online", "Part-Time"];
const degreePrograms  = ["MBA", "BBA", "B.Com", "M.Com", "PhD", "Other"];

export function AlumniPage() {
  const [visible, setVisible] = useState(false);
  const [status,  setStatus]  = useState<Status>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "", email: "", whatsapp: "",
    teachingMode: "", degreeProgram: "", institute: "",
    batchYear: "", rollNumber: "", message: "",
  });

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/api/submissions/alumni", { ...form, pictureUrl: preview });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all";
  const labelClass = "block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2";

  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)]">
        <div className="container-academic">
          <div
            className="max-w-3xl transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
          >
            <div className="accent-line">
              <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">
                Stay Connected
              </p>
            </div>
            <h1 className="font-display text-display-lg text-[var(--text-primary)] mb-6">
              Alumni Connect
            </h1>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed">
              You were more than a student — you are part of a growing family of change-makers.
              Register here to stay connected, share your journey, and inspire the next generation.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-section bg-[var(--bg-primary)]">
        <div className="container-academic max-w-3xl">
          <div className="card-base p-8 lg:p-10">

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-3">
                  Welcome to the Family!
                </h2>
                <p className="text-[var(--text-muted)] max-w-sm">
                  Your registration has been received. The professor looks forward to staying connected with you.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-8">
                  Alumni Registration
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Personal Info */}
                  <div>
                    <h3 className="font-display text-sm font-semibold text-[var(--text-soft)] mb-4 pb-2 border-b border-[var(--border)]">
                      Personal Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Full Name *</label>
                        <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Your full name" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Email Address *</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>WhatsApp Number</label>
                        <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className={inputClass} />
                      </div>
                    </div>
                  </div>

                  {/* Academic Info */}
                  <div>
                    <h3 className="font-display text-sm font-semibold text-[var(--text-soft)] mb-4 pb-2 border-b border-[var(--border)]">
                      Academic Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Teaching Mode *</label>
                        <select name="teachingMode" value={form.teachingMode} onChange={handleChange} required className={inputClass}>
                          <option value="">Select mode</option>
                          {teachingModes.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Degree Programme *</label>
                        <select name="degreeProgram" value={form.degreeProgram} onChange={handleChange} required className={inputClass}>
                          <option value="">Select degree</option>
                          {degreePrograms.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Institute / College *</label>
                        <input name="institute" value={form.institute} onChange={handleChange} required placeholder="Your institution" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Batch Year *</label>
                        <input name="batchYear" type="number" value={form.batchYear} onChange={handleChange} required placeholder="e.g. 2018" min="1990" max="2025" className={inputClass} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Roll Number</label>
                        <input name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="Your roll / enrollment number" className={inputClass} />
                      </div>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <h3 className="font-display text-sm font-semibold text-[var(--text-soft)] mb-4 pb-2 border-b border-[var(--border)]">
                      Profile Photo
                    </h3>
                    {preview ? (
                      <div className="flex items-center gap-4">
                        <img src={preview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border-2 border-primary-300" />
                        <button type="button" onClick={() => setPreview(null)}
                          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors">
                          <X className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-primary-400 bg-[var(--bg-secondary)] cursor-pointer transition-all group">
                        <Upload className="w-6 h-6 text-[var(--text-muted)] group-hover:text-primary-500 transition-colors mb-2" />
                        <span className="text-sm text-[var(--text-muted)] group-hover:text-primary-500 transition-colors">
                          Click to upload a photo
                        </span>
                        <span className="text-xs text-[var(--text-muted)] mt-1">JPG, PNG up to 5MB</span>
                        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                      </label>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelClass}>Your Message / Update</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                      placeholder="Share what you've been up to since graduation..."
                      className={`${inputClass} resize-none`} />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-950 dark:border-red-800 dark:text-red-300">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    {status === "loading" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Register as Alumni
                      </>
                    )}
                  </button>

                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}