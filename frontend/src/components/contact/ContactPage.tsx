"use client";

import { useEffect, useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
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
    <main>
      <section className="contact-section">
        <div className="container">
          <h2>Talk to the Professor</h2>
          <p className="contact-intro animate-on-scroll">
            Whether you have a research query, academic collaboration proposal, or simply want
            to connect — the professor welcomes thoughtful conversations.
          </p>

          <div className="contact-grid animate-on-scroll" style={{ display: 'block', maxWidth: '800px', margin: '0 auto' }}>
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3 style={{ textAlign: "center", marginBottom: "2rem" }}>Send a Message</h3>

              {status === "success" && (
                <div style={{ padding: "1rem", backgroundColor: "#e6fffa", color: "#2c7a7b", marginBottom: "1rem", borderRadius: "4px", textAlign: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 10px auto' }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <h4>Message Sent!</h4>
                  <p>Thank you for reaching out. The professor will respond soon.</p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    style={{ marginTop: "1rem", color: "#2c7a7b", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Send Another
                  </button>
                </div>
              )}

              {status === "error" && (
                <div style={{ padding: "1rem", backgroundColor: "#fff5f5", color: "#c53030", marginBottom: "1rem", borderRadius: "4px" }}>
                  Something went wrong. Please try again.
                </div>
              )}

              {status !== "success" && (
                <>
                  <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px', color: '#4a5568' }}>Contact Information</h4>
                  
                  {/* Read-only contact info block, displayed above the form */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px", background: "#f8fafc", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ flex: "1 1 calc(50% - 10px)" }}>
                      <strong style={{ display: "block", fontSize: "0.85rem", color: "#718096", textTransform: "uppercase", marginBottom: "4px" }}>Email</strong>
                      <span style={{ fontSize: "0.95rem", color: "#2d3748" }}>bhagwan.singh@cuj.ac.in</span>
                    </div>
                    <div style={{ flex: "1 1 calc(50% - 10px)" }}>
                      <strong style={{ display: "block", fontSize: "0.85rem", color: "#718096", textTransform: "uppercase", marginBottom: "4px" }}>Office Hours</strong>
                      <span style={{ fontSize: "0.95rem", color: "#2d3748" }}>Mon – Fri: 10:00 AM – 5:00 PM</span>
                    </div>
                  </div>

                  <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px', color: '#4a5568' }}>Your Details</h4>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ flex: '1 1 100%' }}>
                      <label>Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc' }} />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 calc(50% - 10px)' }}>
                      <label>Email Address *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc' }} />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 calc(50% - 10px)' }}>
                      <label>WhatsApp Number</label>
                      <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+91 XXXXX XXXXX" style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc' }} />
                    </div>
                  </div>

                  <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', margin: '24px 0 16px 0', color: '#4a5568' }}>Message</h4>
                  <div className="form-group">
                    <label>Your Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Write your message here..." style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc', resize: 'vertical' }}></textarea>
                  </div>

                  <button type="submit" className="cta-button" disabled={status === "loading"} style={{ width: '100%', marginTop: '20px' }}>
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}