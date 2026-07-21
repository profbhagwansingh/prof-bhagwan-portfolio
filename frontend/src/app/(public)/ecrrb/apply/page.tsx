"use client";

import { useState, useRef, useEffect } from "react";
import Head from "next/head";

type FormState = {
  fullName: string;
  dateOfBirth: string;
  designation: string;
  affiliation: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  highestQualification: string;
  specialization: string;
  yearsOfExperience: string;
  elig1: boolean;
  elig2: boolean;
  elig3: boolean;
  experienceSummary: string;
  scopusId: string;
  scopusLink: string;
  totalScopusPubs: string;
  hIndex: string;
  gcpTraining: string;
  dec1: boolean;
  dec2: boolean;
  dec3: boolean;
  signature: string;
  applicationDate: string;
};

const defaultFormState: FormState = {
  fullName: "",
  dateOfBirth: "",
  designation: "",
  affiliation: "",
  email: "",
  phone: "",
  address: "",
  category: "",
  highestQualification: "",
  specialization: "",
  yearsOfExperience: "",
  elig1: false,
  elig2: false,
  elig3: false,
  experienceSummary: "",
  scopusId: "",
  scopusLink: "",
  totalScopusPubs: "",
  hIndex: "",
  gcpTraining: "",
  dec1: false,
  dec2: false,
  dec3: false,
  signature: "",
  applicationDate: "",
};

export default function EcrrbApplyPage() {
  const [formData, setFormData] = useState<FormState>(defaultFormState);
  
  // File states
  const [cv, setCv] = useState<File | null>(null);
  const [scopusExport, setScopusExport] = useState<File | null>(null);
  const [papers, setPapers] = useState<File[]>([]);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null); // Added photo state

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  
  const [progress, setProgress] = useState(0);

  // Compute progress based on required fields
  useEffect(() => {
    let filled = 0;
    const reqFields = [
      formData.fullName, formData.dateOfBirth, formData.designation, formData.affiliation,
      formData.email, formData.phone, formData.address, formData.category,
      formData.highestQualification, formData.specialization, formData.yearsOfExperience,
      formData.elig1 && formData.elig2 && formData.elig3, formData.experienceSummary,
      cv, formData.gcpTraining, formData.dec1 && formData.dec2 && formData.dec3,
      formData.signature, formData.applicationDate
    ];
    
    reqFields.forEach(f => {
      if (typeof f === 'boolean' && f === true) filled++;
      else if (typeof f === 'string' && f.trim() !== "") filled++;
      else if (f instanceof File) filled++;
    });

    const pct = Math.round((filled / reqFields.length) * 100);
    setProgress(pct);
  }, [formData, cv]);

  const updateForm = (key: keyof FormState, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: false })); // clear error on change
  };

  const validate = () => {
    const newErrors: { [key: string]: boolean } = {};
    let isValid = true;
    
    if (!formData.fullName) newErrors.fullName = true;
    if (!formData.dateOfBirth) newErrors.dateOfBirth = true;
    if (!formData.designation) newErrors.designation = true;
    if (!formData.affiliation) newErrors.affiliation = true;
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = true;
    if (!formData.phone) newErrors.phone = true;
    if (!formData.address) newErrors.address = true;
    if (!formData.category) newErrors.category = true;
    if (!formData.highestQualification) newErrors.highestQualification = true;
    if (!formData.specialization) newErrors.specialization = true;
    if (!formData.yearsOfExperience) newErrors.yearsOfExperience = true;
    if (!formData.elig1 || !formData.elig2 || !formData.elig3) newErrors.elig = true;
    if (!formData.experienceSummary) newErrors.experienceSummary = true;
    if (!cv) newErrors.cv = true;
    if (!formData.gcpTraining) newErrors.gcpTraining = true;
    if (!formData.dec1 || !formData.dec2 || !formData.dec3) newErrors.dec = true;
    if (!formData.signature) newErrors.signature = true;
    if (!formData.applicationDate) newErrors.applicationDate = true;

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      isValid = false;
      // Scroll to first error roughly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const fd = new FormData();
      
      // Map to backend expected names
      const mappedData = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        designation: formData.designation,
        affiliation: formData.affiliation,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        category: formData.category,
        highestQualification: formData.highestQualification,
        specialization: formData.specialization,
        yearsOfExperience: formData.yearsOfExperience,
        experienceSummary: formData.experienceSummary,
        scopusId: formData.scopusId,
        scopusLink: formData.scopusLink,
        totalScopusPubs: formData.totalScopusPubs,
        hIndex: formData.hIndex,
        hasEthicsTraining: formData.gcpTraining === "Yes",
        digitalSignature: formData.signature,
      };
      
      fd.append("data", JSON.stringify(mappedData));
      
      if (cv) fd.append("cv", cv);
      if (photo) fd.append("photo", photo);
      if (scopusExport) fd.append("scopusExport", scopusExport);
      if (certificate) fd.append("certificate", certificate);
      papers.forEach(p => fd.append("papers", p));

      const res = await fetch("/api/ecrrb/apply", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Failed to submit");
      
      const resData = await res.json();
      setRefCode(resData.applicationId?.slice(0, 8).toUpperCase() || 'ECRB-' + Date.now().toString(36).toUpperCase());
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Confirmation Screen
  if (submitSuccess) {
    return (
      <div className="custom-ecrb-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        <div className="confirm" style={{ display: 'block' }}>
          <div className="seal">&#10003;</div>
          <h2>Application Submitted</h2>
          <p>Thank you. Your ECRRB membership application has been recorded. The Trust's Secretariat will contact you regarding the status of your application.</p>
          <div className="ref">Reference No. {refCode}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-ecrb-container">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      <header className="letterhead">
        <div className="letterhead-inner">
          <p className="trust-name">Parsottam Mamorial Trust (PMT) &middot; Varanasi, U.P.</p>
          <h1 className="form-title">ECRRB Membership Application</h1>
          <p className="form-sub">Ethical Committee &amp; Research Review Board</p>
        </div>
      </header>

      <div className="wrap">
        <div className="intro">
          Use this form to apply for membership on the <strong>Ethical Committee &amp; Research Review Board (ECRRB)</strong> of Parsottam Mamorial Trust (PMT), Varanasi, U.P. Please keep your CV, list of publications, and any relevant certificates ready to upload before you begin. All fields marked with <span style={{color: '#A23B3B'}}>*</span> are required.
        </div>

        <div className="progress-rail">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-label">{progress}% complete</div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* SECTION 1 */}
          <section className="card">
            <div className="card-head"><span className="card-num">1</span><h2>Applicant Details</h2></div>
            <div className="card-body">
              <div className={`field ${errors.fullName ? 'invalid' : ''}`}>
                <label className="q">Full Name<span className="req">*</span></label>
                <input type="text" value={formData.fullName} onChange={e => updateForm("fullName", e.target.value)} />
                <div className="error-msg">Please enter your full name.</div>
              </div>
              <div className={`field ${errors.dateOfBirth ? 'invalid' : ''}`}>
                <label className="q">Date of Birth<span className="req">*</span></label>
                <input type="date" value={formData.dateOfBirth} onChange={e => updateForm("dateOfBirth", e.target.value)} />
                <div className="error-msg">Please enter your date of birth.</div>
              </div>
              <div className="field">
                <label className="q">Passport Photo (Optional)</label>
                <label className={`file-drop ${photo ? 'has-file' : ''}`}>
                  <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} />
                  <div className="dlabel"><b>Click to upload</b> or drag file here</div>
                  <div className="file-list">
                    {photo && <div>✓ {photo.name} ({Math.round(photo.size/1024)} KB)</div>}
                  </div>
                </label>
              </div>
              <div className={`field ${errors.designation ? 'invalid' : ''}`}>
                <label className="q">Current Designation / Occupation<span className="req">*</span></label>
                <input type="text" value={formData.designation} onChange={e => updateForm("designation", e.target.value)} />
                <div className="error-msg">This field is required.</div>
              </div>
              <div className={`field ${errors.affiliation ? 'invalid' : ''}`}>
                <label className="q">Organization / Institution Affiliation<span className="req">*</span></label>
                <input type="text" value={formData.affiliation} onChange={e => updateForm("affiliation", e.target.value)} />
                <div className="error-msg">This field is required.</div>
              </div>
              <div className={`field ${errors.email ? 'invalid' : ''}`}>
                <label className="q">Email Address<span className="req">*</span></label>
                <input type="email" value={formData.email} onChange={e => updateForm("email", e.target.value)} />
                <div className="error-msg">Please enter a valid email address.</div>
              </div>
              <div className={`field ${errors.phone ? 'invalid' : ''}`}>
                <label className="q">Phone Number<span className="req">*</span></label>
                <input type="tel" value={formData.phone} onChange={e => updateForm("phone", e.target.value)} />
                <div className="error-msg">Please enter a valid phone number.</div>
              </div>
              <div className={`field ${errors.address ? 'invalid' : ''}`}>
                <label className="q">Address<span className="req">*</span></label>
                <textarea value={formData.address} onChange={e => updateForm("address", e.target.value)}></textarea>
                <div className="error-msg">This field is required.</div>
              </div>
            </div>
          </section>

          {/* SECTION 2 */}
          <section className="card">
            <div className="card-head"><span className="card-num">2</span><h2>Category Applied For</h2></div>
            <div className="card-body">
              <div className={`field ${errors.category ? 'invalid' : ''}`}>
                <label className="q">Category of Membership<span className="req">*</span></label>
                <p className="help">Refer to Section 4 (Composition) of the ECRB Constitution.</p>
                <select value={formData.category} onChange={e => updateForm("category", e.target.value)}>
                  <option value="" disabled>Select a category</option>
                  <option>Chairperson</option>
                  <option>Member-Secretary</option>
                  <option>Basic Medical / Behavioural Scientist</option>
                  <option>Clinician / Subject Expert</option>
                  <option>Legal Expert</option>
                  <option>Social Scientist / Behavioural Scientist</option>
                  <option>Philosopher / Ethicist / Theologian</option>
                  <option>Layperson (Community Representative)</option>
                  <option>Member Unaffiliated with the Trust</option>
                </select>
                <div className="error-msg">Please select a category.</div>
              </div>
            </div>
          </section>

          {/* SECTION 3 */}
          <section className="card">
            <div className="card-head"><span className="card-num">3</span><h2>Qualifications &amp; Eligibility</h2></div>
            <div className="card-body">
              <div className={`field ${errors.highestQualification ? 'invalid' : ''}`}>
                <label className="q">Highest Qualification<span className="req">*</span></label>
                <input type="text" value={formData.highestQualification} onChange={e => updateForm("highestQualification", e.target.value)} />
                <div className="error-msg">This field is required.</div>
              </div>
              <div className={`field ${errors.specialization ? 'invalid' : ''}`}>
                <label className="q">Field of Specialization<span className="req">*</span></label>
                <input type="text" value={formData.specialization} onChange={e => updateForm("specialization", e.target.value)} />
                <div className="error-msg">This field is required.</div>
              </div>
              <div className={`field ${errors.yearsOfExperience ? 'invalid' : ''}`}>
                <label className="q">Years of Relevant Experience<span className="req">*</span></label>
                <input type="number" min="0" value={formData.yearsOfExperience} onChange={e => updateForm("yearsOfExperience", e.target.value)} />
                <div className="error-msg">Please enter a number.</div>
              </div>
              <div className={`field ${errors.elig ? 'invalid' : ''}`}>
                <label className="q">Eligibility Declarations<span className="req">*</span></label>
                <p className="help">Please confirm each of the following:</p>
                <div className="check-row">
                  <input type="checkbox" id="elig1" checked={formData.elig1} onChange={e => updateForm("elig1", e.target.checked)} />
                  <label htmlFor="elig1">I declare that I have no conflicts of interest that would compromise my impartiality on any study likely to be reviewed by this ECRRB</label>
                </div>
                <div className="check-row">
                  <input type="checkbox" id="elig2" checked={formData.elig2} onChange={e => updateForm("elig2", e.target.checked)} />
                  <label htmlFor="elig2">I have no undisclosed financial, professional, or personal conflict of interest</label>
                </div>
                <div className="check-row">
                  <input type="checkbox" id="elig3" checked={formData.elig3} onChange={e => updateForm("elig3", e.target.checked)} />
                  <label htmlFor="elig3">I agree to recuse myself from review of any proposal where a conflict of interest arises</label>
                </div>
                <div className="error-msg">Please confirm all three declarations.</div>
              </div>
              <div className={`field ${errors.experienceSummary ? 'invalid' : ''}`}>
                <label className="q">Brief Summary of Relevant Experience<span className="req">*</span></label>
                <p className="help">Describe your experience in research, ethics review, clinical practice, law, social work, or community engagement as relevant to the category applied for.</p>
                <textarea style={{ minHeight: '110px' }} value={formData.experienceSummary} onChange={e => updateForm("experienceSummary", e.target.value)}></textarea>
                <div className="error-msg">This field is required.</div>
              </div>
            </div>
          </section>

          {/* SECTION 4 */}
          <section className="card">
            <div className="card-head"><span className="card-num">4</span><h2>Research Contribution &mdash; Scopus</h2></div>
            <div className="card-body">
              <div className="field">
                <label className="q">Scopus Author ID</label>
                <p className="help">Found on your Scopus author profile URL, e.g. scopus.com/authid/detail.uri?authorId=XXXXXXXXX</p>
                <input type="text" value={formData.scopusId} onChange={e => updateForm("scopusId", e.target.value)} />
              </div>
              <div className="field">
                <label className="q">Scopus Profile Link</label>
                <input type="url" placeholder="https://www.scopus.com/authid/..." value={formData.scopusLink} onChange={e => updateForm("scopusLink", e.target.value)} />
              </div>
              <div className="field">
                <label className="q">Total Publications Indexed in Scopus</label>
                <input type="number" min="0" value={formData.totalScopusPubs} onChange={e => updateForm("totalScopusPubs", e.target.value)} />
              </div>
              <div className="field">
                <label className="q">Scopus H-index</label>
                <input type="number" min="0" value={formData.hIndex} onChange={e => updateForm("hIndex", e.target.value)} />
              </div>
              <div className={`field ${errors.cv ? 'invalid' : ''}`}>
                <label className="q">Upload CV / Resume<span className="req">*</span></label>
                <p className="help">PDF or DOC, max 10MB.</p>
                <label className={`file-drop ${cv ? 'has-file' : ''}`}>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => { setCv(e.target.files?.[0] || null); setErrors(prev => ({...prev, cv: false})) }} />
                  <div className="dlabel"><b>Click to upload</b> or drag file here</div>
                  <div className="file-list">
                    {cv && <div>✓ {cv.name} ({Math.round(cv.size/1024)} KB)</div>}
                  </div>
                </label>
                <div className="error-msg">Please upload your CV / Resume.</div>
              </div>
              <div className="field">
                <label className="q">Upload Scopus Publication List / Export</label>
                <p className="help">CSV or PDF, max 10MB.</p>
                <label className={`file-drop ${scopusExport ? 'has-file' : ''}`}>
                  <input type="file" accept=".pdf,.csv" onChange={e => setScopusExport(e.target.files?.[0] || null)} />
                  <div className="dlabel"><b>Click to upload</b> or drag file here</div>
                  <div className="file-list">
                    {scopusExport && <div>✓ {scopusExport.name} ({Math.round(scopusExport.size/1024)} KB)</div>}
                  </div>
                </label>
              </div>
              <div className="field">
                <label className="q">Upload Representative Research Papers</label>
                <p className="help">Up to 3 PDF files, max 10MB each.</p>
                <label className={`file-drop ${papers.length > 0 ? 'has-file' : ''}`}>
                  <input type="file" accept=".pdf" multiple onChange={e => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 3) alert("Max 3 files");
                    setPapers(files.slice(0, 3));
                  }} />
                  <div className="dlabel"><b>Click to upload</b> or drag up to 3 files here</div>
                  <div className="file-list">
                    {papers.map((p, i) => <div key={i}>✓ {p.name} ({Math.round(p.size/1024)} KB)</div>)}
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 5 */}
          <section className="card">
            <div className="card-head"><span className="card-num">5</span><h2>Training</h2></div>
            <div className="card-body">
              <div className={`field ${errors.gcpTraining ? 'invalid' : ''}`}>
                <label className="q">Have you completed Good Clinical Practice (GCP) / Research Ethics training?<span className="req">*</span></label>
                <div className="radio-row">
                  <input type="radio" id="gcpYes" name="gcpTraining" value="Yes" checked={formData.gcpTraining === "Yes"} onChange={e => updateForm("gcpTraining", e.target.value)} />
                  <label htmlFor="gcpYes">Yes</label>
                </div>
                <div className="radio-row">
                  <input type="radio" id="gcpNo" name="gcpTraining" value="No" checked={formData.gcpTraining === "No"} onChange={e => updateForm("gcpTraining", e.target.value)} />
                  <label htmlFor="gcpNo">No</label>
                </div>
                <div className="error-msg">Please select an option.</div>
              </div>
              <div className="field">
                <label className="q">Upload Training Certificate (if applicable)</label>
                <label className={`file-drop ${certificate ? 'has-file' : ''}`}>
                  <input type="file" accept=".pdf,.jpg,.png" onChange={e => setCertificate(e.target.files?.[0] || null)} />
                  <div className="dlabel"><b>Click to upload</b> or drag file here</div>
                  <div className="file-list">
                    {certificate && <div>✓ {certificate.name} ({Math.round(certificate.size/1024)} KB)</div>}
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 6 */}
          <section className="card">
            <div className="card-head"><span className="card-num">6</span><h2>Declaration</h2></div>
            <div className="card-body">
              <div className={`field ${errors.dec ? 'invalid' : ''}`}>
                <label className="q">Declaration<span className="req">*</span></label>
                <div className="check-row">
                  <input type="checkbox" id="dec1" checked={formData.dec1} onChange={e => updateForm("dec1", e.target.checked)} />
                  <label htmlFor="dec1">I agree to maintain confidentiality of all protocols, participant data, and Committee deliberations as required under the ECRRB Constitution</label>
                </div>
                <div className="check-row">
                  <input type="checkbox" id="dec2" checked={formData.dec2} onChange={e => updateForm("dec2", e.target.checked)} />
                  <label htmlFor="dec2">I agree to disclose any conflict of interest at the earliest opportunity</label>
                </div>
                <div className="check-row">
                  <input type="checkbox" id="dec3" checked={formData.dec3} onChange={e => updateForm("dec3", e.target.checked)} />
                  <label htmlFor="dec3">I confirm that the information provided above is true and accurate to the best of my knowledge</label>
                </div>
                <div className="error-msg">Please confirm all three items.</div>
              </div>
              <div className={`field ${errors.signature ? 'invalid' : ''}`}>
                <label className="q">Digital Signature (Full Name)<span className="req">*</span></label>
                <input type="text" value={formData.signature} onChange={e => updateForm("signature", e.target.value)} />
                <div className="error-msg">Please type your full name as signature.</div>
              </div>
              <div className={`field ${errors.applicationDate ? 'invalid' : ''}`}>
                <label className="q">Date of Application<span className="req">*</span></label>
                <input type="date" value={formData.applicationDate} onChange={e => updateForm("applicationDate", e.target.value)} />
                <div className="error-msg">Please select a date.</div>
              </div>
            </div>
          </section>

          <div className="footer-bar">
            <span className="req-note"><span style={{color: '#A23B3B'}}>*</span> Required field</span>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Scoped CSS injected using styled-jsx / style tags to prevent leaking globally
const customStyles = `
  .custom-ecrb-container {
    --navy:#1F3864;
    --navy-deep:#142544;
    --ivory:#FAF7F0;
    --paper:#FFFFFF;
    --gold:#B08D57;
    --gold-soft:#E7DCC5;
    --ink:#2B2B2B;
    --ink-soft:#5B5F6B;
    --line:#DDD5C4;
    --success:#2F6B4F;
    --error:#A23B3B;
    --radius:3px;
    
    background: var(--ivory);
    color: var(--ink);
    font-family: 'Source Sans 3', sans-serif;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  
  .custom-ecrb-container * {
    box-sizing: border-box;
  }

  .custom-ecrb-container .wrap {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 20px 80px;
  }

  .custom-ecrb-container header.letterhead {
    background: var(--navy);
    color: #fff;
    padding: 38px 20px 30px;
    position: relative;
    overflow: hidden;
  }
  
  .custom-ecrb-container header.letterhead::after {
    content: "";
    position: absolute; left: 0; right: 0; bottom: 0;
    height: 5px;
    background: linear-gradient(90deg, var(--gold) 0%, var(--gold) 40%, transparent 40%, transparent 60%, var(--gold) 60%);
  }
  
  .custom-ecrb-container .letterhead-inner {
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
  }
  
  .custom-ecrb-container .trust-name {
    font-family: 'Jost', sans-serif;
    letter-spacing: .14em;
    text-transform: uppercase;
    font-size: 12.5px;
    color: var(--gold-soft);
    margin: 0 0 10px;
  }
  
  .custom-ecrb-container h1.form-title {
    font-family: 'Lora', serif;
    font-weight: 700;
    font-size: clamp(26px, 4vw, 34px);
    margin: 0 0 8px;
    letter-spacing: .01em;
  }
  
  .custom-ecrb-container .form-sub {
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: 16px;
    color: #D9DEEA;
    margin: 0;
  }

  .custom-ecrb-container .intro {
    background: var(--paper);
    border: 1px solid var(--line);
    border-top: none;
    padding: 20px 26px;
    font-size: 14.5px;
    color: var(--ink-soft);
    margin-bottom: 28px;
  }
  .custom-ecrb-container .intro strong { color: var(--ink); }

  .custom-ecrb-container .progress-rail {
    position: sticky; top: 0; z-index: 20;
    background: var(--ivory);
    padding: 14px 0 10px;
  }
  .custom-ecrb-container .progress-track {
    height: 4px; background: var(--gold-soft); border-radius: 4px; overflow: hidden;
  }
  .custom-ecrb-container .progress-fill {
    height: 100%; background: var(--navy); width: 0%;
    transition: width .35s ease;
  }
  .custom-ecrb-container .progress-label {
    font-family: 'Jost', sans-serif;
    font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
    color: var(--ink-soft); margin-top: 6px;
  }

  .custom-ecrb-container form { margin-top: 10px; }

  .custom-ecrb-container section.card {
    background: var(--paper);
    border: 1px solid var(--line);
    margin-bottom: 22px;
    box-shadow: 0 1px 2px rgba(31,56,100,0.04);
  }
  .custom-ecrb-container .card-head {
    display: flex; align-items: baseline; gap: 12px;
    padding: 20px 26px 14px;
    border-bottom: 1px solid var(--line);
  }
  .custom-ecrb-container .card-num {
    font-family: 'Lora', serif; font-weight: 700; font-size: 14px;
    color: var(--gold);
    border: 1px solid var(--gold-soft);
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex: none;
  }
  .custom-ecrb-container .card-head h2 {
    font-family: 'Lora', serif; font-size: 19px; font-weight: 600; margin: 0;
    color: var(--navy);
  }
  .custom-ecrb-container .card-body { padding: 22px 26px 26px; }

  .custom-ecrb-container .field { margin-bottom: 20px; }
  .custom-ecrb-container .field:last-child { margin-bottom: 0; }
  .custom-ecrb-container label.q {
    display: block; font-weight: 600; font-size: 14.5px; margin-bottom: 4px; color: var(--ink);
  }
  .custom-ecrb-container label.q .req { color: var(--error); margin-left: 3px; }
  .custom-ecrb-container .help { font-size: 12.5px; color: var(--ink-soft); margin: 0 0 8px; }

  .custom-ecrb-container input[type=text], 
  .custom-ecrb-container input[type=email], 
  .custom-ecrb-container input[type=tel], 
  .custom-ecrb-container input[type=url], 
  .custom-ecrb-container input[type=number], 
  .custom-ecrb-container input[type=date], 
  .custom-ecrb-container textarea, 
  .custom-ecrb-container select {
    width: 100%;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14.5px;
    padding: 10px 12px;
    border: 1px solid #C9C2B0;
    border-radius: var(--radius);
    background: #fff;
    color: var(--ink);
  }
  .custom-ecrb-container textarea { resize: vertical; min-height: 80px; }
  .custom-ecrb-container input:focus, 
  .custom-ecrb-container textarea:focus, 
  .custom-ecrb-container select:focus {
    outline: none; border-color: var(--navy); box-shadow: 0 0 0 3px rgba(31,56,100,0.12);
  }

  .custom-ecrb-container .check-row, 
  .custom-ecrb-container .radio-row {
    display: flex; align-items: flex-start; gap: 10px; padding: 8px 0;
    border-bottom: 1px dashed var(--line);
  }
  .custom-ecrb-container .check-row:last-child, 
  .custom-ecrb-container .radio-row:last-child { border-bottom: none; }
  .custom-ecrb-container .check-row input, 
  .custom-ecrb-container .radio-row input { margin-top: 3px; accent-color: var(--navy); flex: none; }
  .custom-ecrb-container .check-row label, 
  .custom-ecrb-container .radio-row label { font-size: 14px; color: var(--ink); cursor: pointer; }

  .custom-ecrb-container .file-drop {
    display: block;
    border: 1.5px dashed #C9C2B0;
    border-radius: var(--radius);
    padding: 18px; text-align: center;
    background: #FCFAF5;
    cursor: pointer;
    transition: border-color .2s, background .2s;
  }
  .custom-ecrb-container .file-drop:hover { border-color: var(--navy); background: #F5F2E8; }
  .custom-ecrb-container .file-drop.has-file { border-color: var(--success); background: #F1F7F3; }
  .custom-ecrb-container .file-drop input { display: none; }
  .custom-ecrb-container .file-drop .dlabel { font-size: 13.5px; color: var(--ink-soft); }
  .custom-ecrb-container .file-drop .dlabel b { color: var(--navy); }
  .custom-ecrb-container .file-list { margin-top: 8px; font-size: 12.5px; color: var(--success); text-align: left; }
  .custom-ecrb-container .file-list div { padding: 2px 0; }

  .custom-ecrb-container select {
    appearance: none; 
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231F3864' stroke-width='1.6' fill='none'/%3E%3C/svg%3E"); 
    background-repeat: no-repeat; 
    background-position: right 12px center;
  }

  .custom-ecrb-container .footer-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 26px 4px 0;
  }
  .custom-ecrb-container .req-note { font-size: 12.5px; color: var(--ink-soft); }
  .custom-ecrb-container button.submit-btn {
    background: var(--navy); color: #fff; border: none;
    font-family: 'Jost', sans-serif; font-size: 14px; letter-spacing: .03em;
    padding: 14px 34px; border-radius: var(--radius);
    cursor: pointer; transition: background .2s;
  }
  .custom-ecrb-container button.submit-btn:hover { background: var(--navy-deep); }
  .custom-ecrb-container button.submit-btn:disabled { background: #A9AFC0; cursor: not-allowed; }

  .custom-ecrb-container .error-msg { color: var(--error); font-size: 12.5px; margin-top: 5px; display: none; }
  .custom-ecrb-container .field.invalid input, 
  .custom-ecrb-container .field.invalid textarea, 
  .custom-ecrb-container .field.invalid select { border-color: var(--error); }
  .custom-ecrb-container .field.invalid .error-msg { display: block; }

  .custom-ecrb-container .confirm {
    background: var(--paper); border: 1px solid var(--line);
    padding: 50px 40px; text-align: center;
    max-width: 600px; margin: 40px auto;
  }
  .custom-ecrb-container .confirm .seal {
    width: 64px; height: 64px; border-radius: 50%;
    border: 2px solid var(--success); color: var(--success);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; font-size: 30px;
  }
  .custom-ecrb-container .confirm h2 { font-family: 'Lora', serif; color: var(--navy); margin-bottom: 10px; }
  .custom-ecrb-container .confirm p { color: var(--ink-soft); font-size: 14.5px; max-width: 440px; margin: 0 auto; }
  .custom-ecrb-container .confirm .ref {
    margin-top: 22px; font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: .06em;
    color: var(--gold); text-transform: uppercase;
  }

  @media (max-width: 600px) {
    .custom-ecrb-container .card-body, 
    .custom-ecrb-container .card-head, 
    .custom-ecrb-container .intro { padding-left: 18px; padding-right: 18px; }
    .custom-ecrb-container .footer-bar { flex-direction: column; gap: 14px; align-items: stretch; }
    .custom-ecrb-container button.submit-btn { width: 100%; }
  }
`;
