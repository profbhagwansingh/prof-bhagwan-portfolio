"use client";

import React, { useState, useEffect } from "react";

const customStyles = `
  .cert-container {
    --navy: #1F3864;
    --navy-deep: #142544;
    --ivory: #FAF7F0;
    --paper: #FFFFFF;
    --gold: #B08D57;
    --gold-soft: #E7DCC5;
    --ink: #2B2B2B;
    --ink-soft: #5B5F6B;
    --line: #DDD5C4;
    --success: #2F6B4F;
    --error: #A23B3B;
    --radius: 3px;
    background: var(--ivory);
    color: var(--ink);
    font-family: 'Source Sans 3', sans-serif;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  .cert-container * { box-sizing: border-box; }
  .cert-container .wrap { max-width: 780px; margin: 0 auto; padding: 0 20px 80px; }
  .cert-container header.letterhead { background: var(--navy); color: #fff; padding: 38px 20px 30px; position: relative; overflow: hidden; }
  .cert-container header.letterhead::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 5px; background: linear-gradient(90deg, var(--gold) 0%, var(--gold) 40%, transparent 40%, transparent 60%, var(--gold) 60%); }
  .cert-container .letterhead-inner { max-width: 780px; margin: 0 auto; text-align: center; }
  .cert-container .trust-name { font-family: 'Jost', sans-serif; letter-spacing: .14em; text-transform: uppercase; font-size: 12.5px; color: var(--gold-soft); margin: 0 0 10px; }
  .cert-container h1.form-title { font-family: 'Lora', serif; font-weight: 700; font-size: clamp(24px, 4vw, 32px); margin: 0 0 8px; letter-spacing: .01em; }
  .cert-container .form-sub { font-family: 'Lora', serif; font-style: italic; font-size: 16px; color: #D9DEEA; margin: 0; }
  .cert-container .intro { background: var(--paper); border: 1px solid var(--line); border-top: none; padding: 20px 26px; font-size: 14.5px; color: var(--ink-soft); margin-bottom: 28px; }
  .cert-container .intro strong { color: var(--ink); }
  .cert-container .progress-rail { position: sticky; top: 0; z-index: 20; background: var(--ivory); padding: 14px 0 10px; }
  .cert-container .progress-track { height: 4px; background: var(--gold-soft); border-radius: 4px; overflow: hidden; }
  .cert-container .progress-fill { height: 100%; background: var(--navy); transition: width .35s ease; }
  .cert-container .progress-label { font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-soft); margin-top: 6px; }
  .cert-container form { margin-top: 10px; }
  .cert-container section.card { background: var(--paper); border: 1px solid var(--line); margin-bottom: 22px; box-shadow: 0 1px 2px rgba(31,56,100,0.04); }
  .cert-container .card-head { display: flex; align-items: baseline; gap: 12px; padding: 20px 26px 14px; border-bottom: 1px solid var(--line); }
  .cert-container .card-num { font-family: 'Lora', serif; font-weight: 700; font-size: 14px; color: var(--gold); border: 1px solid var(--gold-soft); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex: none; }
  .cert-container .card-head h2 { font-family: 'Lora', serif; font-size: 19px; font-weight: 600; margin: 0; color: var(--navy); }
  .cert-container .card-body { padding: 22px 26px 26px; }
  .cert-container .field { margin-bottom: 20px; }
  .cert-container .field:last-child { margin-bottom: 0; }
  .cert-container label.q { display: block; font-weight: 600; font-size: 14.5px; margin-bottom: 4px; color: var(--ink); }
  .cert-container label.q .req { color: var(--error); margin-left: 3px; }
  .cert-container .help { font-size: 12.5px; color: var(--ink-soft); margin: 0 0 8px; }
  .cert-container input[type=text], .cert-container input[type=email], .cert-container input[type=tel], .cert-container input[type=number], .cert-container input[type=date], .cert-container textarea, .cert-container select { width: 100%; font-family: 'Source Sans 3', sans-serif; font-size: 14.5px; padding: 10px 12px; border: 1px solid #C9C2B0; border-radius: var(--radius); background: #fff; color: var(--ink); }
  .cert-container textarea { resize: vertical; min-height: 80px; }
  .cert-container input:focus, .cert-container textarea:focus, .cert-container select:focus { outline: none; border-color: var(--navy); box-shadow: 0 0 0 3px rgba(31,56,100,0.12); }
  .cert-container .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .cert-container .check-row, .cert-container .radio-row { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; border-bottom: 1px dashed var(--line); }
  .cert-container .check-row:last-child, .cert-container .radio-row:last-child { border-bottom: none; }
  .cert-container .check-row input, .cert-container .radio-row input { margin-top: 3px; accent-color: var(--navy); flex: none; }
  .cert-container .check-row label, .cert-container .radio-row label { font-size: 14px; color: var(--ink); cursor: pointer; }
  .cert-container .inline-radios { display: flex; gap: 22px; flex-wrap: wrap; }
  .cert-container .inline-radios .radio-row { border-bottom: none; padding: 2px 0; }
  .cert-container .file-drop { border: 1.5px dashed #C9C2B0; border-radius: var(--radius); padding: 18px; text-align: center; background: #FCFAF5; cursor: pointer; transition: border-color .2s, background .2s; display: block; }
  .cert-container .file-drop:hover { border-color: var(--navy); background: #F5F2E8; }
  .cert-container .file-drop.has-file { border-color: var(--success); background: #F1F7F3; }
  .cert-container .file-drop input { display: none; }
  .cert-container .file-drop .dlabel { font-size: 13.5px; color: var(--ink-soft); }
  .cert-container .file-drop .dlabel b { color: var(--navy); }
  .cert-container .file-list { margin-top: 8px; font-size: 12.5px; color: var(--success); text-align: left; }
  .cert-container .file-list div { padding: 2px 0; }
  .cert-container select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231F3864' stroke-width='1.6' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
  .cert-container .footer-bar { display: flex; align-items: center; justify-content: space-between; padding: 26px 4px 0; }
  .cert-container .req-note { font-size: 12.5px; color: var(--ink-soft); }
  .cert-container button.submit-btn { background: var(--navy); color: #fff; border: none; font-family: 'Jost', sans-serif; font-size: 14px; letter-spacing: .03em; padding: 14px 34px; border-radius: var(--radius); cursor: pointer; transition: background .2s; }
  .cert-container button.submit-btn:hover { background: var(--navy-deep); }
  .cert-container button.submit-btn:disabled { background: #A9AFC0; cursor: not-allowed; }
  .cert-container .error-msg { color: var(--error); font-size: 12.5px; margin-top: 5px; display: none; }
  .cert-container .field.invalid input, .cert-container .field.invalid textarea, .cert-container .field.invalid select { border-color: var(--error); }
  .cert-container .field.invalid .error-msg { display: block; }
  .cert-container .confirm { background: var(--paper); border: 1px solid var(--line); padding: 50px 40px; text-align: center; }
  .cert-container .confirm .seal { width: 64px; height: 64px; border-radius: 50%; border: 2px solid var(--success); color: var(--success); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 30px; }
  .cert-container .confirm h2 { font-family: 'Lora', serif; color: var(--navy); margin-bottom: 10px; }
  .cert-container .confirm p { color: var(--ink-soft); font-size: 14.5px; max-width: 460px; margin: 0 auto; }
  .cert-container .confirm .ref { margin-top: 22px; font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: .06em; color: var(--gold); text-transform: uppercase; }
  @media (max-width: 600px) {
    .cert-container .card-body, .cert-container .card-head, .cert-container .intro { padding-left: 18px; padding-right: 18px; }
    .cert-container .two-col { grid-template-columns: 1fr; }
    .cert-container .footer-bar { flex-direction: column; gap: 14px; align-items: stretch; }
    .cert-container button.submit-btn { width: 100%; }
  }
`;

export default function EcrrbCertificationApply() {
  const [formData, setFormData] = useState({
    piName: "", piDesignation: "", piInstitution: "", piEmail: "", piPhone: "",
    coInvestigators: "", orcidScopusId: "",
    studyTitle: "", submissionType: "", researchType: "", startDate: "", duration: "", studySites: "", journalName: "",
    objectives: "", methodology: "", studyPopulation: "", sampleSize: "", inclusionExclusion: "", vulnerable: "", vulnerableSafeguards: "",
    risks: "", benefits: "", consentProcess: "", confidentiality: "", compensation: "",
    isFunded: "", fundingAgency: "", coiDeclared: false,
    dec1: false, dec2: false, dec3: false, signature: "", applicationDate: ""
  });

  const [files, setFiles] = useState({
    protocol: null as File | null,
    icf: null as File | null,
    tools: [] as File[],
    piCv: null as File | null,
    researchPaper: null as File | null,
    priorApproval: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [refCode, setRefCode] = useState("");

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const updateFile = (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const updateFilesArray = (field: string, fileList: FileList | null) => {
    const fArr = fileList ? Array.from(fileList) : [];
    setFiles(prev => ({ ...prev, [field]: fArr }));
  };

  useEffect(() => {
    let filled = 0;
    const reqs = [
      formData.piName, formData.piDesignation, formData.piInstitution, formData.piEmail, formData.piPhone,
      formData.studyTitle, formData.submissionType, formData.researchType, formData.startDate, formData.duration,
      formData.objectives, formData.methodology, formData.studyPopulation, formData.sampleSize, formData.vulnerable,
      formData.risks, formData.benefits, formData.consentProcess, formData.confidentiality,
      formData.isFunded, formData.coiDeclared,
      files.protocol, files.icf, files.piCv,
      formData.dec1, formData.dec2, formData.dec3, formData.signature, formData.applicationDate
    ];
    reqs.forEach(val => {
      if (typeof val === "boolean") { if (val) filled++; }
      else if (val) { filled++; }
    });
    setProgress(Math.round((filled / reqs.length) * 100));
  }, [formData, files]);

  const validate = () => {
    const newErrs: Record<string, boolean> = {};
    if (!formData.piName) newErrs.piName = true;
    if (!formData.piDesignation) newErrs.piDesignation = true;
    if (!formData.piInstitution) newErrs.piInstitution = true;
    if (!formData.piEmail || !/^\S+@\S+\.\S+$/.test(formData.piEmail)) newErrs.piEmail = true;
    if (!formData.piPhone) newErrs.piPhone = true;
    if (!formData.studyTitle) newErrs.studyTitle = true;
    if (!formData.submissionType) newErrs.submissionType = true;
    if (!formData.researchType) newErrs.researchType = true;
    if (!formData.startDate) newErrs.startDate = true;
    if (!formData.duration) newErrs.duration = true;
    if (!formData.objectives) newErrs.objectives = true;
    if (!formData.methodology) newErrs.methodology = true;
    if (!formData.studyPopulation) newErrs.studyPopulation = true;
    if (!formData.sampleSize) newErrs.sampleSize = true;
    if (!formData.vulnerable) newErrs.vulnerable = true;
    if (!formData.risks) newErrs.risks = true;
    if (!formData.benefits) newErrs.benefits = true;
    if (!formData.consentProcess) newErrs.consentProcess = true;
    if (!formData.confidentiality) newErrs.confidentiality = true;
    if (!formData.isFunded) newErrs.isFunded = true;
    if (!formData.coiDeclared) newErrs.coiDeclared = true;
    if (!files.protocol) newErrs.protocol = true;
    if (!files.icf) newErrs.icf = true;
    if (!files.piCv) newErrs.piCv = true;
    if (!formData.dec1 || !formData.dec2 || !formData.dec3) newErrs.decs = true;
    if (!formData.signature) newErrs.signature = true;
    if (!formData.applicationDate) newErrs.applicationDate = true;

    setErrors(newErrs);
    const firstInvalid = Object.keys(newErrs)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify(formData));
      if (files.protocol) fd.append("protocol", files.protocol);
      if (files.icf) fd.append("icf", files.icf);
      if (files.piCv) fd.append("piCv", files.piCv);
      if (files.researchPaper) fd.append("researchPaper", files.researchPaper);
      if (files.priorApproval) fd.append("priorApproval", files.priorApproval);
      files.tools.forEach(p => fd.append("tools", p));

      const res = await fetch("/api/ecrrb/certification/apply", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Failed to submit");
      const resData = await res.json();
      setRefCode(resData.applicationId?.slice(0, 8).toUpperCase() || "CERT-" + Date.now().toString(36).toUpperCase());
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="cert-container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        <div className="confirm">
          <div className="seal">&#10003;</div>
          <h2>Application Submitted</h2>
          <p>Thank you. Your research certification application has been recorded for review by the ECRRB. The Secretariat will contact you regarding the review timeline and outcome.</p>
          <div className="ref">Reference No. {refCode}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cert-container">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <header className="letterhead">
        <div className="letterhead-inner">
          <p className="trust-name">Parsottam Mamorial Trust (PMT) &middot; Varanasi, U.P.</p>
          <h1 className="form-title">Research Certification Application</h1>
          <p className="form-sub">Ethical Committee &amp; Research Review Board (ECRRB)</p>
        </div>
      </header>

      <div className="wrap">
        <div className="intro">
          Researchers seeking <strong>ethical clearance / certification</strong> from the ECRRB for a research proposal, study, or published paper should complete this form. Please keep your protocol/synopsis, informed consent documents, CV, and any prior approvals ready to upload before you begin. Fields marked <span style={{color: "#A23B3B"}}>*</span> are required.
        </div>

        <div className="progress-rail">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: progress + "%" }}></div>
          </div>
          <div className="progress-label">{progress}% complete</div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* SECTION 1: Investigator Details */}
          <section className="card">
            <div className="card-head"><span className="card-num">1</span><h2>Principal Investigator Details</h2></div>
            <div className="card-body">
              <div className="two-col">
                <div id="piName" className={"field " + (errors.piName ? "invalid" : "")}>
                  <label className="q">Full Name<span className="req">*</span></label>
                  <input type="text" value={formData.piName} onChange={e => updateForm("piName", e.target.value)} />
                  <div className="error-msg">Required.</div>
                </div>
                <div id="piDesignation" className={"field " + (errors.piDesignation ? "invalid" : "")}>
                  <label className="q">Designation<span className="req">*</span></label>
                  <input type="text" value={formData.piDesignation} onChange={e => updateForm("piDesignation", e.target.value)} />
                  <div className="error-msg">Required.</div>
                </div>
              </div>
              <div id="piInstitution" className={"field " + (errors.piInstitution ? "invalid" : "")}>
                <label className="q">Department / Institution / Organization<span className="req">*</span></label>
                <input type="text" value={formData.piInstitution} onChange={e => updateForm("piInstitution", e.target.value)} />
                <div className="error-msg">Required.</div>
              </div>
              <div className="two-col">
                <div id="piEmail" className={"field " + (errors.piEmail ? "invalid" : "")}>
                  <label className="q">Email Address<span className="req">*</span></label>
                  <input type="email" value={formData.piEmail} onChange={e => updateForm("piEmail", e.target.value)} />
                  <div className="error-msg">Please enter a valid email.</div>
                </div>
                <div id="piPhone" className={"field " + (errors.piPhone ? "invalid" : "")}>
                  <label className="q">Phone Number<span className="req">*</span></label>
                  <input type="tel" value={formData.piPhone} onChange={e => updateForm("piPhone", e.target.value)} />
                  <div className="error-msg">Required.</div>
                </div>
              </div>
              <div className="field">
                <label className="q">Co-Investigator(s) / Team Members</label>
                <p className="help">Name(s), designation, and affiliation — one per line.</p>
                <textarea value={formData.coInvestigators} onChange={e => updateForm("coInvestigators", e.target.value)}></textarea>
              </div>
              <div className="field">
                <label className="q">ORCID / Scopus Author ID (if any)</label>
                <input type="text" value={formData.orcidScopusId} onChange={e => updateForm("orcidScopusId", e.target.value)} />
              </div>
            </div>
          </section>

          {/* SECTION 2: Proposal / Paper Details */}
          <section className="card">
            <div className="card-head"><span className="card-num">2</span><h2>Proposal / Research Paper Details</h2></div>
            <div className="card-body">
              <div id="studyTitle" className={"field " + (errors.studyTitle ? "invalid" : "")}>
                <label className="q">Title of Study / Research Paper<span className="req">*</span></label>
                <input type="text" value={formData.studyTitle} onChange={e => updateForm("studyTitle", e.target.value)} />
                <div className="error-msg">Required.</div>
              </div>
              <div className="two-col">
                <div id="submissionType" className={"field " + (errors.submissionType ? "invalid" : "")}>
                  <label className="q">Nature of Submission<span className="req">*</span></label>
                  <select value={formData.submissionType} onChange={e => updateForm("submissionType", e.target.value)}>
                    <option value="" disabled>Select</option>
                    <option>New Research Proposal (Prospective)</option>
                    <option>Completed Study / Retrospective</option>
                    <option>Published or Submitted Research Paper</option>
                    <option>Amendment to Previously Approved Study</option>
                  </select>
                  <div className="error-msg">Please select an option.</div>
                </div>
                <div id="researchType" className={"field " + (errors.researchType ? "invalid" : "")}>
                  <label className="q">Type of Research<span className="req">*</span></label>
                  <select value={formData.researchType} onChange={e => updateForm("researchType", e.target.value)}>
                    <option value="" disabled>Select</option>
                    <option>Biomedical / Clinical</option>
                    <option>Public Health / Epidemiological</option>
                    <option>Social Science / Behavioural</option>
                    <option>Educational</option>
                    <option>Secondary Data Analysis</option>
                    <option>Other</option>
                  </select>
                  <div className="error-msg">Please select an option.</div>
                </div>
              </div>
              <div className="two-col">
                <div id="startDate" className={"field " + (errors.startDate ? "invalid" : "")}>
                  <label className="q">Proposed / Actual Start Date<span className="req">*</span></label>
                  <input type="date" value={formData.startDate} onChange={e => updateForm("startDate", e.target.value)} />
                  <div className="error-msg">Required.</div>
                </div>
                <div id="duration" className={"field " + (errors.duration ? "invalid" : "")}>
                  <label className="q">Expected Duration<span className="req">*</span></label>
                  <input type="text" value={formData.duration} onChange={e => updateForm("duration", e.target.value)} placeholder="e.g., 12 months" />
                  <div className="error-msg">Required.</div>
                </div>
              </div>
              <div className="field">
                <label className="q">Study Site(s) / Location(s)</label>
                <input type="text" value={formData.studySites} onChange={e => updateForm("studySites", e.target.value)} />
              </div>
              <div className="field">
                <label className="q">Journal Name (if submitted/published) or Target Journal</label>
                <input type="text" value={formData.journalName} onChange={e => updateForm("journalName", e.target.value)} />
              </div>
            </div>
          </section>

          {/* SECTION 3: Objectives & Methodology */}
          <section className="card">
            <div className="card-head"><span className="card-num">3</span><h2>Objectives &amp; Methodology</h2></div>
            <div className="card-body">
              <div id="objectives" className={"field " + (errors.objectives ? "invalid" : "")}>
                <label className="q">Objectives of the Study<span className="req">*</span></label>
                <textarea style={{ minHeight: "90px" }} value={formData.objectives} onChange={e => updateForm("objectives", e.target.value)}></textarea>
                <div className="error-msg">Required.</div>
              </div>
              <div id="methodology" className={"field " + (errors.methodology ? "invalid" : "")}>
                <label className="q">Brief Summary of Methodology<span className="req">*</span></label>
                <p className="help">Study design, data collection tools/instruments, and analysis plan.</p>
                <textarea style={{ minHeight: "110px" }} value={formData.methodology} onChange={e => updateForm("methodology", e.target.value)}></textarea>
                <div className="error-msg">Required.</div>
              </div>
              <div className="two-col">
                <div id="studyPopulation" className={"field " + (errors.studyPopulation ? "invalid" : "")}>
                  <label className="q">Study Population<span className="req">*</span></label>
                  <input type="text" value={formData.studyPopulation} onChange={e => updateForm("studyPopulation", e.target.value)} />
                  <div className="error-msg">Required.</div>
                </div>
                <div id="sampleSize" className={"field " + (errors.sampleSize ? "invalid" : "")}>
                  <label className="q">Sample Size<span className="req">*</span></label>
                  <input type="number" min="0" value={formData.sampleSize} onChange={e => updateForm("sampleSize", e.target.value)} />
                  <div className="error-msg">Required.</div>
                </div>
              </div>
              <div className="field">
                <label className="q">Inclusion / Exclusion Criteria</label>
                <textarea value={formData.inclusionExclusion} onChange={e => updateForm("inclusionExclusion", e.target.value)}></textarea>
              </div>
              <div id="vulnerable" className={"field " + (errors.vulnerable ? "invalid" : "")}>
                <label className="q">Does the study involve any vulnerable population?<span className="req">*</span></label>
                <p className="help">e.g., children, persons with cognitive impairment, economically/socially disadvantaged individuals.</p>
                <div className="inline-radios">
                  <div className="radio-row">
                    <input type="radio" id="vulnYes" name="vulnerable" checked={formData.vulnerable === "Yes"} onChange={() => updateForm("vulnerable", "Yes")} />
                    <label htmlFor="vulnYes">Yes</label>
                  </div>
                  <div className="radio-row">
                    <input type="radio" id="vulnNo" name="vulnerable" checked={formData.vulnerable === "No"} onChange={() => updateForm("vulnerable", "No")} />
                    <label htmlFor="vulnNo">No</label>
                  </div>
                </div>
                <div className="error-msg">Please select an option.</div>
              </div>
              <div className="field">
                <label className="q">If yes, describe the safeguards proposed</label>
                <textarea value={formData.vulnerableSafeguards} onChange={e => updateForm("vulnerableSafeguards", e.target.value)}></textarea>
              </div>
            </div>
          </section>

          {/* SECTION 4: Ethical Considerations */}
          <section className="card">
            <div className="card-head"><span className="card-num">4</span><h2>Ethical Considerations</h2></div>
            <div className="card-body">
              <div id="risks" className={"field " + (errors.risks ? "invalid" : "")}>
                <label className="q">Anticipated Risks to Participants<span className="req">*</span></label>
                <textarea value={formData.risks} onChange={e => updateForm("risks", e.target.value)}></textarea>
                <div className="error-msg">Required.</div>
              </div>
              <div id="benefits" className={"field " + (errors.benefits ? "invalid" : "")}>
                <label className="q">Anticipated Benefits (to participants / society)<span className="req">*</span></label>
                <textarea value={formData.benefits} onChange={e => updateForm("benefits", e.target.value)}></textarea>
                <div className="error-msg">Required.</div>
              </div>
              <div id="consentProcess" className={"field " + (errors.consentProcess ? "invalid" : "")}>
                <label className="q">Informed Consent Process<span className="req">*</span></label>
                <p className="help">How and when consent will be obtained; language(s) used; provision for withdrawal.</p>
                <textarea value={formData.consentProcess} onChange={e => updateForm("consentProcess", e.target.value)}></textarea>
                <div className="error-msg">Required.</div>
              </div>
              <div id="confidentiality" className={"field " + (errors.confidentiality ? "invalid" : "")}>
                <label className="q">Confidentiality &amp; Data Handling<span className="req">*</span></label>
                <p className="help">How participant data/identity will be protected, stored, and eventually disposed of or archived.</p>
                <textarea value={formData.confidentiality} onChange={e => updateForm("confidentiality", e.target.value)}></textarea>
                <div className="error-msg">Required.</div>
              </div>
              <div className="field">
                <label className="q">Compensation / Incentive to Participants (if any)</label>
                <input type="text" value={formData.compensation} onChange={e => updateForm("compensation", e.target.value)} />
              </div>
            </div>
          </section>

          {/* SECTION 5: Funding & Conflict of Interest */}
          <section className="card">
            <div className="card-head"><span className="card-num">5</span><h2>Funding &amp; Conflict of Interest</h2></div>
            <div className="card-body">
              <div id="isFunded" className={"field " + (errors.isFunded ? "invalid" : "")}>
                <label className="q">Is this study funded?<span className="req">*</span></label>
                <div className="inline-radios">
                  <div className="radio-row">
                    <input type="radio" id="fundYes" name="isFunded" checked={formData.isFunded === "Yes"} onChange={() => updateForm("isFunded", "Yes")} />
                    <label htmlFor="fundYes">Yes</label>
                  </div>
                  <div className="radio-row">
                    <input type="radio" id="fundNo" name="isFunded" checked={formData.isFunded === "No"} onChange={() => updateForm("isFunded", "No")} />
                    <label htmlFor="fundNo">No / Self-funded</label>
                  </div>
                </div>
                <div className="error-msg">Please select an option.</div>
              </div>
              <div className="field">
                <label className="q">Name of Funding Agency / Sponsor (if applicable)</label>
                <input type="text" value={formData.fundingAgency} onChange={e => updateForm("fundingAgency", e.target.value)} />
              </div>
              <div id="coiDeclared" className={"field " + (errors.coiDeclared ? "invalid" : "")}>
                <label className="q">Conflict of Interest Declaration<span className="req">*</span></label>
                <div className="check-row">
                  <input type="checkbox" id="coi1" checked={formData.coiDeclared} onChange={e => updateForm("coiDeclared", e.target.checked)} />
                  <label htmlFor="coi1">I declare that I have no undisclosed conflict of interest (financial, professional, or personal) relating to this study</label>
                </div>
                <div className="error-msg">Please confirm this declaration.</div>
              </div>
            </div>
          </section>

          {/* SECTION 6: Document Upload */}
          <section className="card">
            <div className="card-head"><span className="card-num">6</span><h2>Document Upload</h2></div>
            <div className="card-body">
              <div id="protocol" className={"field " + (errors.protocol ? "invalid" : "")}>
                <label className="q">Upload Study Protocol / Synopsis<span className="req">*</span></label>
                <p className="help">PDF or DOC, max 10MB.</p>
                <label className={"file-drop " + (files.protocol ? "has-file" : "")}>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => updateFile("protocol", e.target.files?.[0] || null)} />
                  <div className="dlabel"><b>Click to upload</b> or drag file here</div>
                  <div className="file-list">
                    {files.protocol && <div>{"✓ " + files.protocol.name + " (" + Math.round(files.protocol.size / 1024) + " KB)"}</div>}
                  </div>
                </label>
                <div className="error-msg">Please upload the study protocol/synopsis.</div>
              </div>

              <div id="icf" className={"field " + (errors.icf ? "invalid" : "")}>
                <label className="q">Upload Informed Consent Form (ICF) &amp; Participant Information Sheet (PIS)<span className="req">*</span></label>
                <label className={"file-drop " + (files.icf ? "has-file" : "")}>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => updateFile("icf", e.target.files?.[0] || null)} />
                  <div className="dlabel"><b>Click to upload</b> or drag file here</div>
                  <div className="file-list">
                    {files.icf && <div>{"✓ " + files.icf.name + " (" + Math.round(files.icf.size / 1024) + " KB)"}</div>}
                  </div>
                </label>
                <div className="error-msg">Please upload the ICF/PIS.</div>
              </div>

              <div className="field">
                <label className="q">Upload Questionnaire(s) / Data Collection Tool(s)</label>
                <label className={"file-drop " + (files.tools.length ? "has-file" : "")}>
                  <input type="file" accept=".pdf,.doc,.docx" multiple onChange={e => updateFilesArray("tools", e.target.files)} />
                  <div className="dlabel"><b>Click to upload</b> or drag file(s) here</div>
                  <div className="file-list">
                    {files.tools.map((f, i) => (
                      <div key={i}>{"✓ " + f.name + " (" + Math.round(f.size / 1024) + " KB)"}</div>
                    ))}
                  </div>
                </label>
              </div>

              <div id="piCv" className={"field " + (errors.piCv ? "invalid" : "")}>
                <label className="q">Upload CV of Principal Investigator<span className="req">*</span></label>
                <label className={"file-drop " + (files.piCv ? "has-file" : "")}>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => updateFile("piCv", e.target.files?.[0] || null)} />
                  <div className="dlabel"><b>Click to upload</b> or drag file here</div>
                  <div className="file-list">
                    {files.piCv && <div>{"✓ " + files.piCv.name + " (" + Math.round(files.piCv.size / 1024) + " KB)"}</div>}
                  </div>
                </label>
                <div className="error-msg">Please upload the PI's CV.</div>
              </div>

              <div className="field">
                <label className="q">Upload Draft / Submitted / Published Research Paper (if applicable)</label>
                <label className={"file-drop " + (files.researchPaper ? "has-file" : "")}>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => updateFile("researchPaper", e.target.files?.[0] || null)} />
                  <div className="dlabel"><b>Click to upload</b> or drag file here</div>
                  <div className="file-list">
                    {files.researchPaper && <div>{"✓ " + files.researchPaper.name + " (" + Math.round(files.researchPaper.size / 1024) + " KB)"}</div>}
                  </div>
                </label>
              </div>

              <div className="field">
                <label className="q">Upload Prior Ethics Approval(s) (if this is an amendment or multi-site study)</label>
                <label className={"file-drop " + (files.priorApproval ? "has-file" : "")}>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => updateFile("priorApproval", e.target.files?.[0] || null)} />
                  <div className="dlabel"><b>Click to upload</b> or drag file here</div>
                  <div className="file-list">
                    {files.priorApproval && <div>{"✓ " + files.priorApproval.name + " (" + Math.round(files.priorApproval.size / 1024) + " KB)"}</div>}
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 7: Declaration */}
          <section className="card">
            <div className="card-head"><span className="card-num">7</span><h2>Declaration</h2></div>
            <div className="card-body">
              <div id="decs" className={"field " + (errors.decs ? "invalid" : "")}>
                <label className="q">Declaration<span className="req">*</span></label>
                <div className="check-row">
                  <input type="checkbox" id="dec1" checked={formData.dec1} onChange={e => updateForm("dec1", e.target.checked)} />
                  <label htmlFor="dec1">I confirm that the information provided in this application is true and complete to the best of my knowledge</label>
                </div>
                <div className="check-row">
                  <input type="checkbox" id="dec2" checked={formData.dec2} onChange={e => updateForm("dec2", e.target.checked)} />
                  <label htmlFor="dec2">I agree to conduct the study strictly in accordance with the protocol approved by the ECRRB and to seek prior approval for any amendments</label>
                </div>
                <div className="check-row">
                  <input type="checkbox" id="dec3" checked={formData.dec3} onChange={e => updateForm("dec3", e.target.checked)} />
                  <label htmlFor="dec3">I agree to promptly report any serious adverse event, protocol deviation, or unanticipated problem to the ECRRB</label>
                </div>
                <div className="error-msg">Please confirm all three items.</div>
              </div>
              <div className="two-col">
                <div id="signature" className={"field " + (errors.signature ? "invalid" : "")}>
                  <label className="q">Digital Signature (Full Name)<span className="req">*</span></label>
                  <input type="text" value={formData.signature} onChange={e => updateForm("signature", e.target.value)} />
                  <div className="error-msg">Required.</div>
                </div>
                <div id="applicationDate" className={"field " + (errors.applicationDate ? "invalid" : "")}>
                  <label className="q">Date<span className="req">*</span></label>
                  <input type="date" value={formData.applicationDate} onChange={e => updateForm("applicationDate", e.target.value)} />
                  <div className="error-msg">Required.</div>
                </div>
              </div>
            </div>
          </section>

          <div className="footer-bar">
            <span className="req-note"><span style={{color: "#A23B3B"}}>*</span> Required field</span>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
