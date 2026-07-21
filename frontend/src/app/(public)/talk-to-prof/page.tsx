"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function TalkToProfPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await api.post("/api/submissions/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", whatsapp: "", message: "" });
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.response?.data?.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <main>
      <section className="contact-section">
        <div className="container">
          <h2>Get in Touch</h2>
          <p className="contact-intro animate-on-scroll">
            For academic inquiries, research collaborations, or speaking engagements, please use the contact
            details below or fill out the form.
          </p>
          <a href="/alumni" className="cta-button alumni-btn">
            Bhagwan Sir's Student Connect/Click Here
          </a>

          <div className="contact-grid animate-on-scroll">
            {/* Left Column: Contact Information */}
            <div className="contact-info">
              <h3>Contact Details</h3>
              <div className="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div>
                  <strong>Email</strong>
                  <a href="mailto:bhagwan.singh@cuj.ac.in">bhagwan.singh@cuj.ac.in</a>
                  <a href="mailto:bhagwansingh.bs@gmail.com">bhagwansingh.bs@gmail.com</a>
                  <a href="mailto:profbhagwansingh@gmail.com">profbhagwansingh@gmail.com</a>
                </div>
              </div>
              <div className="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
                </svg>
                <div>
                  <strong>ORCID iD</strong>
                  <a href="https://orcid.org/0000-0002-6377-0948">0000-0002-6377-0948</a>
                </div>
              </div>
              <div className="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <strong>Address</strong>
                  <p>Department of Business Administration,<br />Central University of Jharkhand, Ranchi - 835205</p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Anyone Else Send Message/Query to Prof. Bhagwan</h3>

              {status === "success" && (
                <div style={{ padding: "1rem", backgroundColor: "#e6fffa", color: "#2c7a7b", marginBottom: "1rem", borderRadius: "4px" }}>
                  Message sent successfully!
                </div>
              )}
              {status === "error" && (
                <div style={{ padding: "1rem", backgroundColor: "#fff5f5", color: "#c53030", marginBottom: "1rem", borderRadius: "4px" }}>
                  {errorMessage}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="top_email">Your Email</label>
                <input type="email" id="top_email" name="email" required value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="whatsapp">WhatsApp Number (Optional)</label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={6} required value={formData.message} onChange={handleChange}></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="cta-button" disabled={status === "loading"}>
                  {status === "loading" ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
