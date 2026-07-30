"use client";

import Link from "next/link";
import { ClipboardCheck, UserCheck, HeartHandshake, Eye, Lock, FileDown, Mail, ArrowRight } from "lucide-react";

export default function ECRRBPage() {
  const committeeRoles = [
    "Chairperson",
    "Member-Secretary",
    "Basic Scientist",
    "Clinician / Subject Expert",
    "Legal Expert",
    "Social Scientist",
    "Ethicist / Philosopher",
    "Layperson",
    "Woman Member",
    "Independent / Unaffiliated Member"
  ];

  const guidelines = [
    { name: "ICMR National Ethical Guidelines (2017)", url: "https://ethics.ncdirindia.org/asset/pdf/ICMR_National_Ethical_Guidelines.pdf" },
    { name: "New Drugs and Clinical Trials Rules (2019)", url: "https://cdsco.gov.in/opencms/export/sites/CDSCO_WEB/Pdf-documents/NewDrugs_CTRules_2019.pdf" },
    { name: "UGC Regulations", url: "https://www.ugc.gov.in/ugc_regulations.aspx" },
    { name: "Digital Personal Data Protection Act (2023)", url: "https://www.meity.gov.in/content/digital-personal-data-protection-act-2023" }
  ];

  return (
    <main>
      {/* 1. Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #1B264F 0%, #2D1A3F 50%, #4A154B 100%)", // Navy to Maroon
        padding: "80px 20px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative elements */}
        <div style={{
          position: "absolute", top: "-50px", right: "-50px",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)"
        }} />
        <div style={{
          position: "absolute", bottom: "-100px", left: "-100px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)"
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{
            color: "white", fontSize: "3rem", fontWeight: "800",
            marginBottom: "20px", lineHeight: 1.2, letterSpacing: "-0.5px"
          }}>
            Ethical Committee & Research Review Board (ECRRB)
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.9)", fontSize: "1.25rem",
            maxWidth: "700px", margin: "0 auto", fontWeight: "400",
            lineHeight: 1.6
          }}>
            The independent ethics review body of Parsottam Mamorial Trust (PMT), Varanasi.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: "80px 20px", backgroundColor: "#f8f9fa" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "60px" }}>
          
          {/* 2. About/Purpose Section */}
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#1B264F", marginBottom: "20px" }}>Our Purpose</h2>
            <p style={{ color: "#4a5568", fontSize: "1.1rem", lineHeight: "1.8" }}>
              The ECRRB is dedicated to protecting the rights, safety, dignity, and well-being of all research participants. 
              We ensure that every research initiative conducted under the aegis of the Trust is not only scientifically 
              valid, but fundamentally ethically sound.
            </p>
          </div>

          {/* 3. What We Do */}
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#1B264F", marginBottom: "30px", textAlign: "center" }}>What We Do</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "25px"
            }}>
              {[
                { icon: <ClipboardCheck size={28} color="#4A154B" />, title: "Review Protocols", desc: "Ensuring research protocols maintain the highest standards of ethical soundness." },
                { icon: <UserCheck size={28} color="#4A154B" />, title: "Approve Consent", desc: "Validating informed consent processes to guarantee voluntary participation." },
                { icon: <HeartHandshake size={28} color="#4A154B" />, title: "Protect the Vulnerable", desc: "Safeguarding children, students, and disadvantaged groups during studies." },
                { icon: <Eye size={28} color="#4A154B" />, title: "Monitor Studies", desc: "Actively monitoring ongoing and completed research for strict compliance." },
                { icon: <Lock size={28} color="#4A154B" />, title: "Ensure Confidentiality", desc: "Enforcing rigorous data protection and participant privacy." }
              ].map((item, idx) => (
                <div key={idx} style={{
                  backgroundColor: "white", padding: "30px", borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)", borderTop: "4px solid #4A154B",
                  display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "15px"
                }}>
                  <div style={{ backgroundColor: "#FDF5F8", padding: "12px", borderRadius: "12px" }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#1e1b4b" }}>{item.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.6" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Committee Composition */}
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#1B264F", marginBottom: "30px", textAlign: "center" }}>Committee Composition</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px"
            }}>
              {committeeRoles.map((role, idx) => (
                <div key={idx} style={{
                  backgroundColor: "white", padding: "20px", borderRadius: "12px",
                  border: "1px solid #e2e8f0", textAlign: "center",
                  fontWeight: "600", color: "#334155", fontSize: "0.95rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
                }}>
                  {role}
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <Link href="/ecrrb/apply" style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                backgroundColor: "#1B264F", color: "white", padding: "14px 28px",
                borderRadius: "8px", fontWeight: "600", textDecoration: "none",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)", transition: "transform 0.2s"
              }}>
                <UserCheck size={20} /> Apply for Committee Membership
              </Link>
            </div>
          </div>

          {/* 5. Governing Guidelines */}
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#1B264F", marginBottom: "25px", textAlign: "center" }}>Governing Policies</h2>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px" }}>
              {guidelines.map((guide, idx) => (
                <a key={idx} href={guide.url} target="_blank" rel="noopener noreferrer" style={{
                  backgroundColor: "#E0E7FF", color: "#1B264F", padding: "10px 20px",
                  borderRadius: "50px", fontSize: "0.9rem", fontWeight: "600",
                  border: "1px solid #c7d2fe", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: "6px"
                }}>
                  {guide.name} <ArrowRight size={14} />
                </a>
              ))}
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "20px 0" }} />

          {/* 6. Submit a Proposal & 7. Download */}
          <div style={{ 
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
            gap: "30px", alignItems: "stretch" 
          }}>
            {/* Submit Proposal */}
            <div style={{
              backgroundColor: "#1B264F", color: "white", padding: "40px",
              borderRadius: "16px", display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "flex-start", gap: "20px"
            }}>
              <h3 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Submit a Research Proposal</h3>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", lineHeight: "1.6" }}>
                Researchers affiliated with the Trust must submit their protocols for ECRRB review prior to initiating any study involving human participants.
              </p>
              <Link href="/ecrrb/certification/apply" style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                backgroundColor: "white", color: "#1B264F", padding: "12px 24px",
                borderRadius: "8px", fontWeight: "600", textDecoration: "none",
                marginTop: "10px"
              }}>
                <ArrowRight size={18} /> Proceed to Certification Form
              </Link>
            </div>

            {/* Download Constitution */}
            <div style={{
              backgroundColor: "white", padding: "40px", borderRadius: "16px",
              border: "1px solid #e2e8f0", display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "center", textAlign: "center", gap: "20px"
            }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1e1b4b" }}>Official Constitution</h3>
              <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: "1.6" }}>
                Review the complete, legally-binding terms of reference and standard operating procedures for the ECRRB.
              </p>
              <a href="/media/pdf/ecrrb-constitution.pdf" download style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                backgroundColor: "#4A154B", color: "white", padding: "12px 24px",
                borderRadius: "8px", fontWeight: "600", border: "none", cursor: "pointer",
                marginTop: "10px", textDecoration: "none"
              }}>
                <FileDown size={18} /> Download Full ECRRB Constitution (PDF)
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
