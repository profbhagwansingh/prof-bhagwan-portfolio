"use client";

import { useState, useEffect } from "react";
import { Loader2, Eye, Trash2, X, Download, FileText, CheckCircle } from "lucide-react";
import api from "@/lib/api";

export default function AdminEcrrbPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/ecrrb/admin/applications");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const viewDetails = async (id: string) => {
    try {
      const res = await api.get(`/api/ecrrb/admin/applications/${id}`);
      setSelectedApp(res.data);
      setIsViewing(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load details");
    }
  };

  const deleteApp = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      await api.delete(`/api/ecrrb/admin/applications/${id}`);
      setApplications(prev => prev.filter(a => a.id !== id));
      if (selectedApp?.id === id) setIsViewing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete application");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">ECRRB Applications</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Review membership applications for the Ethical Committee.</p>
        </div>
      </div>

      <div className="card-base overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
            <p className="text-[var(--text-muted)]">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="font-medium text-[var(--text-primary)] mb-1">No Applications Yet</h3>
            <p className="text-sm text-[var(--text-muted)]">When users apply, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wider">Applicant Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wider">Date Applied</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text-primary)]">{app.fullName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-soft)]">{app.category}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-soft)]">{app.email}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-soft)]">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewDetails(app.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteApp(app.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {isViewing && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--bg-primary)] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 border border-[var(--border)]">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50">
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">Application Details</h2>
              <button onClick={() => setIsViewing(false)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Left Col */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4 pb-2 border-b border-[var(--border)]">1. Applicant Details</h3>
                    <div className="space-y-3 text-sm">
                      <p><span className="text-[var(--text-muted)]">Name:</span> <span className="font-medium text-[var(--text-primary)]">{selectedApp.fullName}</span></p>
                      <p><span className="text-[var(--text-muted)]">DOB:</span> <span className="text-[var(--text-primary)]">{new Date(selectedApp.dateOfBirth).toLocaleDateString()}</span></p>
                      <p><span className="text-[var(--text-muted)]">Designation:</span> <span className="text-[var(--text-primary)]">{selectedApp.designation}</span></p>
                      <p><span className="text-[var(--text-muted)]">Affiliation:</span> <span className="text-[var(--text-primary)]">{selectedApp.affiliation}</span></p>
                      <p><span className="text-[var(--text-muted)]">Email:</span> <span className="text-[var(--text-primary)]">{selectedApp.email}</span></p>
                      <p><span className="text-[var(--text-muted)]">Phone:</span> <span className="text-[var(--text-primary)]">{selectedApp.phone}</span></p>
                      <p><span className="text-[var(--text-muted)]">Address:</span> <span className="text-[var(--text-primary)]">{selectedApp.address}</span></p>
                      {selectedApp.photoUrl && (
                        <div className="mt-4">
                          <p className="text-[var(--text-muted)] mb-2">Photo:</p>
                          <img src={selectedApp.photoUrl} alt="Applicant" className="w-24 h-32 object-cover rounded-lg border border-[var(--border)]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4 pb-2 border-b border-[var(--border)]">2. Category</h3>
                    <p className="font-medium text-[var(--text-primary)]">{selectedApp.category}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4 pb-2 border-b border-[var(--border)]">3. Qualifications</h3>
                    <div className="space-y-3 text-sm">
                      <p><span className="text-[var(--text-muted)]">Highest Qualification:</span> <span className="text-[var(--text-primary)]">{selectedApp.highestQualification}</span></p>
                      <p><span className="text-[var(--text-muted)]">Specialization:</span> <span className="text-[var(--text-primary)]">{selectedApp.specialization}</span></p>
                      <p><span className="text-[var(--text-muted)]">Years of Exp:</span> <span className="text-[var(--text-primary)]">{selectedApp.yearsOfExperience}</span></p>
                      <div>
                        <p className="text-[var(--text-muted)] mb-1">Experience Summary:</p>
                        <p className="text-[var(--text-primary)] bg-[var(--bg-secondary)] p-3 rounded-lg text-sm">{selectedApp.experienceSummary}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4 pb-2 border-b border-[var(--border)]">4. Research Contribution</h3>
                    <div className="space-y-3 text-sm">
                      <p><span className="text-[var(--text-muted)]">Scopus ID:</span> <span className="text-[var(--text-primary)]">{selectedApp.scopusId || "N/A"}</span></p>
                      <p><span className="text-[var(--text-muted)]">Scopus Link:</span> {selectedApp.scopusLink ? <a href={selectedApp.scopusLink} target="_blank" className="text-primary-600 underline">View Profile</a> : "N/A"}</p>
                      <p><span className="text-[var(--text-muted)]">Total Scopus Pubs:</span> <span className="text-[var(--text-primary)]">{selectedApp.totalScopusPubs || "N/A"}</span></p>
                      <p><span className="text-[var(--text-muted)]">H-Index:</span> <span className="text-[var(--text-primary)]">{selectedApp.hIndex || "N/A"}</span></p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4 pb-2 border-b border-[var(--border)]">5. Attachments</h3>
                    <div className="flex flex-col gap-2">
                      {selectedApp.cvUrl && (
                        <a href={selectedApp.cvUrl} target="_blank" className="inline-flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border)] transition-colors text-sm text-[var(--text-primary)]">
                          <Download className="w-4 h-4 text-primary-500" /> Download CV / Resume
                        </a>
                      )}
                      {selectedApp.scopusExportUrl && (
                        <a href={selectedApp.scopusExportUrl} target="_blank" className="inline-flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border)] transition-colors text-sm text-[var(--text-primary)]">
                          <Download className="w-4 h-4 text-primary-500" /> Download Scopus Export
                        </a>
                      )}
                      {selectedApp.certificateUrl && (
                        <a href={selectedApp.certificateUrl} target="_blank" className="inline-flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border)] transition-colors text-sm text-[var(--text-primary)]">
                          <Download className="w-4 h-4 text-primary-500" /> Download Training Certificate
                        </a>
                      )}
                      {selectedApp.paperUrls && selectedApp.paperUrls.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" className="inline-flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border)] transition-colors text-sm text-[var(--text-primary)]">
                          <Download className="w-4 h-4 text-primary-500" /> Download Paper {i+1}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4 pb-2 border-b border-[var(--border)]">6. Training & Declaration</h3>
                    <div className="space-y-3 text-sm">
                      <p className="flex items-center gap-2 text-[var(--text-primary)]">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Completed Ethics Training: {selectedApp.hasEthicsTraining ? "Yes" : "No"}
                      </p>
                      <p className="flex items-center gap-2 text-[var(--text-primary)]">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Declarations Checked
                      </p>
                      <p><span className="text-[var(--text-muted)]">Digital Signature:</span> <span className="font-medium font-serif italic text-lg ml-2">{selectedApp.digitalSignature}</span></p>
                      <p><span className="text-[var(--text-muted)]">Date:</span> <span className="text-[var(--text-primary)]">{new Date(selectedApp.createdAt).toLocaleDateString()}</span></p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-[var(--border)] flex justify-end gap-3 bg-[var(--bg-secondary)]/50 mt-auto">
              <button onClick={() => deleteApp(selectedApp.id)} className="px-4 py-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-medium text-sm transition-colors">
                Delete Application
              </button>
              <button onClick={() => setIsViewing(false)} className="px-4 py-2 rounded-xl bg-[var(--border)] hover:bg-gray-300 dark:hover:bg-gray-700 font-medium text-sm transition-colors text-[var(--text-primary)]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
