"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

export function ContactPage() {
  const [visible, setVisible] = useState(false);
  const [status,  setStatus]  = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", message: "" });

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/api/submissions/contact", form);
      setStatus("success");
      setForm({ name: "", email: "", whatsapp: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

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
              <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Get in Touch</p>
            </div>
            <h1 className="font-display text-display-lg text-[var(--text-primary)] mb-6">
              Talk to the Professor
            </h1>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed">
              Whether you have a research query, academic collaboration proposal, or simply want
              to connect — the professor welcomes thoughtful conversations.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-section bg-[var(--bg-primary)]">
        <div className="container-academic">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Left — Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                Contact Information
              </h2>

              {[
                {
                  icon: Mail,
                  label: "Email",
                  lines: ["bhagwansingh@dsmm.ac.in", "profbhagwansingh@gmail.com"],
                  href: "mailto:bhagwansingh@dsmm.ac.in",
                },
                {
                  icon: MapPin,
                  label: "Office",
                  lines: ["Department of Management Studies", "DSMM College, India"],
                  href: null,
                },
                {
                  icon: Clock,
                  label: "Office Hours",
                  lines: ["Monday – Friday: 10:00 AM – 5:00 PM", "Saturday: By appointment only"],
                  href: null,
                },
              ].map(({ icon: Icon, label, lines, href }) => (
                <div key={label} className="card-base p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] mb-1">{label}</p>
                    {lines.map((line, i) =>
                      href && i === 0 ? (
                        <a key={line} href={href} className="block text-sm text-[var(--text-soft)] hover:text-primary-500 transition-colors">{line}</a>
                      ) : (
                        <p key={line} className="text-sm text-[var(--text-soft)]">{line}</p>
                      )
                    )}
                  </div>
                </div>
              ))}

              {/* Philosophy card */}
              <div className="card-base p-6 bg-gradient-to-br from-primary-500 to-primary-700 border-0">
                <p className="font-display text-lg text-white italic leading-relaxed mb-3">
                  "Care for People, Planet &amp; Peace"
                </p>
                <p className="text-primary-200 text-sm">— Prof. (Dr.) Bhagwan Singh</p>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3">
              <div className="card-base p-8">
                <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
                  Send a Message
                </h2>

                {status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-[var(--text-muted)] mb-6">
                      Thank you for reaching out. The professor will respond soon.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="px-6 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                          Full Name *
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Your full name"
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                        WhatsApp Number
                      </label>
                      <input
                        name="whatsapp"
                        value={form.whatsapp}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Write your message here..."
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all resize-none"
                      />
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
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}