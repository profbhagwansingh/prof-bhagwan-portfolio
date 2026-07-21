"use client";

import { useState, useEffect } from "react";
import { Loader2, Eye, Trash2, X, Download, FileText, CheckCircle } from "lucide-react";
import api from "@/lib/api";

export default function AdminEcrrbCertificationPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/api/ecrrb/admin/certifications");
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (id: string) => {
    try {
      const res = await api.get("/api/ecrrb/admin/certifications/" + id);
      setSelectedApp(res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch application details:", error);
      alert("Error loading details");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification application?")) return;
    setIsDeleting(id);
    try {
      await api.delete("/api/ecrrb/admin/certifications/" + id);
      setApplications(applications.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Error deleting application");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Research Certifications</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Review research certification applications for the ECRRB.</p>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-muted)] border-b border-[var(--border-color)] text-sm text-[var(--text-muted)]">
                <th className="px-6 py-4 font-medium">PI Name</th>
                <th className="px-6 py-4 font-medium">Study Title</th>
                <th className="px-6 py-4 font-medium">Submission Type</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-muted)]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-muted)]">
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[var(--bg-muted)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text-primary)]">{app.piName}</div>
                      <div className="text-sm text-[var(--text-muted)]">{app.piEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate" title={app.studyTitle}>
                      {app.studyTitle}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
                        {app.submissionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-muted)] whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewDetails(app.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          disabled={isDeleting === app.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Application"
                        >
                          {isDeleting === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {isModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--bg-card)] rounded-2xl w-full max-w-4xl shadow-2xl border border-[var(--border-color)] overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-muted)]/50 sticky top-0 z-10">
              <h2 className="text-xl font-display font-semibold text-[var(--text-primary)]">
                Certification Application Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[var(--text-muted)] hover:bg-[var(--border-color)] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[75vh]">
              {/* Section 1: PI Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 border-b pb-2">1. Principal Investigator</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Full Name" value={selectedApp.piName} />
                  <DetailItem label="Designation" value={selectedApp.piDesignation} />
                  <DetailItem label="Institution" value={selectedApp.piInstitution} />
                  <DetailItem label="Email" value={selectedApp.piEmail} />
                  <DetailItem label="Phone" value={selectedApp.piPhone} />
                  <DetailItem label="ORCID/Scopus" value={selectedApp.orcidScopusId || "N/A"} />
                </div>
                {selectedApp.coInvestigators && (
                  <div className="mt-4">
                    <DetailItem label="Co-Investigators" value={selectedApp.coInvestigators} />
                  </div>
                )}
              </div>

              {/* Section 2: Proposal Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 border-b pb-2">2. Proposal Details</h3>
                <DetailItem label="Study Title" value={selectedApp.studyTitle} className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Submission Type" value={selectedApp.submissionType} />
                  <DetailItem label="Research Type" value={selectedApp.researchType} />
                  <DetailItem label="Start Date" value={new Date(selectedApp.startDate).toLocaleDateString()} />
                  <DetailItem label="Duration" value={selectedApp.duration} />
                  <DetailItem label="Study Sites" value={selectedApp.studySites || "N/A"} />
                  <DetailItem label="Target Journal" value={selectedApp.journalName || "N/A"} />
                </div>
              </div>

              {/* Section 3: Methodology */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 border-b pb-2">3. Objectives & Methodology</h3>
                <div className="space-y-4">
                  <DetailItem label="Objectives" value={selectedApp.objectives} />
                  <DetailItem label="Methodology Summary" value={selectedApp.methodology} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Study Population" value={selectedApp.studyPopulation} />
                    <DetailItem label="Sample Size" value={selectedApp.sampleSize} />
                  </div>
                  <DetailItem label="Inclusion/Exclusion" value={selectedApp.inclusionExclusion || "N/A"} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Vulnerable Population" value={selectedApp.vulnerable} />
                    <DetailItem label="Vulnerable Safeguards" value={selectedApp.vulnerableSafeguards || "N/A"} />
                  </div>
                </div>
              </div>

              {/* Section 4: Ethical Considerations */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 border-b pb-2">4. Ethical Considerations</h3>
                <div className="space-y-4">
                  <DetailItem label="Anticipated Risks" value={selectedApp.risks} />
                  <DetailItem label="Anticipated Benefits" value={selectedApp.benefits} />
                  <DetailItem label="Consent Process" value={selectedApp.consentProcess} />
                  <DetailItem label="Confidentiality" value={selectedApp.confidentiality} />
                  <DetailItem label="Compensation" value={selectedApp.compensation || "N/A"} />
                </div>
              </div>

              {/* Section 5: Funding */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 border-b pb-2">5. Funding & COI</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Is Funded?" value={selectedApp.isFunded} />
                  <DetailItem label="Funding Agency" value={selectedApp.fundingAgency || "N/A"} />
                  <DetailItem label="No COI Declared" value={selectedApp.coiDeclared ? "Yes" : "No"} />
                </div>
              </div>

              {/* Section 6: Documents */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 border-b pb-2">6. Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FileLink label="Study Protocol" url={selectedApp.protocolUrl} />
                  <FileLink label="ICF / PIS" url={selectedApp.icfUrl} />
                  <FileLink label="PI CV" url={selectedApp.piCvUrl} />
                  <FileLink label="Research Paper" url={selectedApp.researchPaperUrl} />
                  <FileLink label="Prior Approval" url={selectedApp.priorApprovalUrl} />
                </div>
                {selectedApp.toolUrls && selectedApp.toolUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-[var(--text-muted)] mb-2">Questionnaires / Tools:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedApp.toolUrls.map((url: string, idx: number) => (
                        <FileLink key={idx} label={"Tool " + (idx + 1)} url={url} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 7: Declarations */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 border-b pb-2">7. Declaration</h3>
                <div className="space-y-2 mb-4">
                  <DeclarationItem text="Information provided is true and complete" checked={selectedApp.dec1} />
                  <DeclarationItem text="Will conduct study according to ECRRB approved protocol" checked={selectedApp.dec2} />
                  <DeclarationItem text="Will promptly report adverse events" checked={selectedApp.dec3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--bg-muted)] p-4 rounded-lg">
                  <DetailItem label="Digital Signature" value={selectedApp.digitalSignature} />
                  <DetailItem label="Date Signed" value={new Date(selectedApp.applicationDate).toLocaleDateString()} />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers

function DetailItem({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-[var(--text-muted)] mb-1 uppercase tracking-wider">{label}</p>
      <div className="text-[var(--text-primary)] text-sm whitespace-pre-wrap bg-[var(--bg-muted)]/30 p-3 rounded-lg border border-[var(--border-color)]">
        {value}
      </div>
    </div>
  );
}

function FileLink({ label, url }: { label: string; url?: string | null }) {
  if (!url) return null;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const fullUrl = baseUrl + url;
  const fileName = url.split("/").pop() || "Download";
  
  return (
    <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-muted)]/50">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
          <p className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[150px]" title={fileName}>
            {fileName}
          </p>
        </div>
      </div>
      <a 
        href={fullUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg shadow-sm transition-colors shrink-0"
        title="Download"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}

function DeclarationItem({ text, checked }: { text: string; checked: boolean }) {
  return (
    <div className="flex items-start gap-3">
      {checked ? (
        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0 mt-0.5" />
      )}
      <p className="text-sm text-[var(--text-primary)]">{text}</p>
    </div>
  );
}
