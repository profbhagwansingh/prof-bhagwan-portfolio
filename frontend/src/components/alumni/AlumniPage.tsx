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
  const [picFile, setPicFile] = useState<File | null>(null);
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
    setPicFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const formData = new FormData();
      // Append all text fields
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      // Append profile picture file if selected
      if (picFile) {
        formData.append("picture", picFile);
      }

      await api.post("/api/submissions/alumni", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all";
  const labelClass = "block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2";

  return (
    <main>
      <section className="contact-section">
        <div className="container">
          <h2>Alumni Connect</h2>
          <p className="contact-intro animate-on-scroll">
            You were more than a student — you are part of a growing family of change-makers.
            Register here to stay connected, share your journey, and inspire the next generation.
          </p>

          <div className="contact-grid animate-on-scroll" style={{ display: 'block', maxWidth: '800px', margin: '0 auto' }}>
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Alumni Registration</h3>

              {status === "success" && (
                <div style={{ padding: "1rem", backgroundColor: "#e6fffa", color: "#2c7a7b", marginBottom: "1rem", borderRadius: "4px", textAlign: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 10px auto' }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <h4>Welcome to the Family!</h4>
                  <p>Your registration has been received. The professor looks forward to staying connected with you.</p>
                </div>
              )}

              {status === "error" && (
                <div style={{ padding: "1rem", backgroundColor: "#fff5f5", color: "#c53030", marginBottom: "1rem", borderRadius: "4px" }}>
                  Something went wrong. Please try again.
                </div>
              )}

              {status !== "success" && (
                <>
                  <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px', color: '#4a5568' }}>Personal Information</h4>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ flex: '1 1 100%' }}>
                      <label>Full Name *</label>
                      <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Your full name" />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 calc(50% - 10px)' }}>
                      <label>Email Address *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 calc(50% - 10px)' }}>
                      <label>WhatsApp Number</label>
                      <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>

                  <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', margin: '24px 0 16px 0', color: '#4a5568' }}>Academic Details</h4>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ flex: '1 1 calc(50% - 10px)' }}>
                      <label>Teaching Mode *</label>
                      <select name="teachingMode" value={form.teachingMode} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc' }}>
                        <option value="">Select mode</option>
                        {teachingModes.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ flex: '1 1 calc(50% - 10px)' }}>
                      <label>Degree Programme *</label>
                      <select name="degreeProgram" value={form.degreeProgram} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc' }}>
                        <option value="">Select degree</option>
                        {degreePrograms.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ flex: '1 1 100%' }}>
                      <label>Institute / College *</label>
                      <input name="institute" value={form.institute} onChange={handleChange} required placeholder="Your institution" />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 calc(50% - 10px)' }}>
                      <label>Batch Year *</label>
                      <input name="batchYear" type="number" value={form.batchYear} onChange={handleChange} required placeholder="e.g. 2018" min="1990" max="2026" />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 calc(50% - 10px)' }}>
                      <label>Roll Number</label>
                      <input name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="Your roll / enrollment number" />
                    </div>
                  </div>

                  <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', margin: '24px 0 16px 0', color: '#4a5568' }}>Profile Photo</h4>
                  <div className="form-group" style={{ textAlign: 'center' }}>
                    {preview ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <img src={preview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #3182ce' }} />
                        <button type="button" onClick={() => { setPreview(null); setPicFile(null); }} style={{ color: '#e53e3e', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px', border: '2px dashed #cbd5e0', borderRadius: '8px', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span style={{ color: '#4a5568', fontWeight: 'bold' }}>Click to upload a photo</span>
                        <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>JPG, PNG up to 5MB</span>
                        <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>

                  <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', margin: '24px 0 16px 0', color: '#4a5568' }}>Additional Info</h4>
                  <div className="form-group">
                    <label>Your Message / Update</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Share what you've been up to since graduation..." style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc', resize: 'vertical' }}></textarea>
                  </div>

                  <button type="submit" className="cta-button" disabled={status === "loading"} style={{ width: '100%', marginTop: '20px' }}>
                    {status === "loading" ? "Submitting..." : "Register as Alumni"}
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