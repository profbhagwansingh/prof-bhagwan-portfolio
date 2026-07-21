"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, FileText, Search, Save } from "lucide-react";
import api from "@/lib/api";

interface InvitedLecture {
  id: string;
  slNo: number;
  title: string;
  conferenceDetails: string;
  category: string;
  lectureDate: string | null;
  sortOrder: number;
  isActive: boolean;
}

export default function AdminInvitedLectures() {
  const [lectures, setLectures] = useState<InvitedLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slNo: 0,
    title: "",
    conferenceDetails: "",
    category: "National",
    lectureDate: "",
    isActive: true,
  });

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const res = await api.get("/api/content/invited-lectures");
      if (Array.isArray(res.data)) {
        setLectures(res.data);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load lectures");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (lecture?: InvitedLecture) => {
    if (lecture) {
      setEditingId(lecture.id);
      setFormData({
        slNo: lecture.slNo,
        title: lecture.title,
        conferenceDetails: lecture.conferenceDetails,
        category: lecture.category,
        lectureDate: lecture.lectureDate ? new Date(lecture.lectureDate).toISOString().split("T")[0] : "",
        isActive: lecture.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        slNo: lectures.length + 1,
        title: "",
        conferenceDetails: "",
        category: "National",
        lectureDate: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        slNo: parseInt(formData.slNo.toString()),
        lectureDate: formData.lectureDate ? new Date(formData.lectureDate).toISOString() : null,
      };

      if (editingId) {
        await api.post(`/api/content/admin/invited-lectures`, { ...payload, id: editingId });
      } else {
        await api.post("/api/content/admin/invited-lectures", payload);
      }
      await fetchLectures();
      closeModal();
    } catch (err: any) {
      console.error(err);
      alert("Error saving lecture");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;
    try {
      await api.delete(`/api/content/admin/invited-lectures/${id}`);
      await fetchLectures();
    } catch (err) {
      console.error(err);
      alert("Failed to delete lecture");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await api.post(`/api/content/admin/invited-lectures`, { id, isActive: !currentStatus });
      await fetchLectures();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = lectures.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.conferenceDetails.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Invited Lectures</h1>
          <p className="text-[var(--text-muted)] text-sm">Manage {lectures.length} invited lectures and presentations.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Lecture
        </button>
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--bg-secondary)]/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search lectures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-lg border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3 font-semibold text-[var(--text-muted)] w-16">Sl.No</th>
                <th className="px-6 py-3 font-semibold text-[var(--text-muted)]">Title</th>
                <th className="px-6 py-3 font-semibold text-[var(--text-muted)] w-48">Category</th>
                <th className="px-6 py-3 font-semibold text-[var(--text-muted)] w-32">Date</th>
                <th className="px-6 py-3 font-semibold text-[var(--text-muted)] w-24 text-center">Active</th>
                <th className="px-6 py-3 font-semibold text-[var(--text-muted)] w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[var(--text-muted)]">
                    Loading lectures...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[var(--text-muted)]">
                    No lectures found.
                  </td>
                </tr>
              ) : (
                filtered.map((lec) => (
                  <tr key={lec.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary-600">{lec.slNo}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[var(--text-primary)] line-clamp-2" title={lec.title}>{lec.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1" title={lec.conferenceDetails}>{lec.conferenceDetails}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {lec.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">
                      {lec.lectureDate ? new Date(lec.lectureDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleActive(lec.id, lec.isActive)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${lec.isActive ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${lec.isActive ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(lec)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(lec.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                {editingId ? "Edit Lecture" : "Add New Lecture"}
              </h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sl. No.</label>
                  <input
                    type="number"
                    required
                    value={formData.slNo}
                    onChange={(e) => setFormData({ ...formData, slNo: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={formData.lectureDate}
                    onChange={(e) => setFormData({ ...formData, lectureDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="National">National</option>
                  <option value="International (within country)">International (within country)</option>
                  <option value="International">International</option>
                  <option value="State/University">State/University</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title of the Invited Lecture / Paper</label>
                <textarea
                  required
                  rows={3}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Details of Conference / Seminar & Organizer</label>
                <textarea
                  required
                  rows={3}
                  value={formData.conferenceDetails}
                  onChange={(e) => setFormData({ ...formData, conferenceDetails: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                />
              </div>
            </form>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shadow-sm">
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-sm shadow-primary-500/20 flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? "Saving..." : (
                  <>
                    <Save className="w-4 h-4" /> Save Lecture
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
