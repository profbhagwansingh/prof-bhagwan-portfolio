"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Plus, Edit2, Trash2, X, MoveUp, MoveDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface Testimonial {
  id: string;
  authorName: string;
  authorTitle: string | null;
  authorImage: string | null;
  content: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [authorName, setAuthorName] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [authorImage, setAuthorImage] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchTestimonials = () => {
    api.get("/api/testimonials/admin/all")
      .then((r) => setTestimonials(r.data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const resetForm = () => {
    setAuthorName("");
    setAuthorTitle("");
    setAuthorImage("");
    setContent("");
    setIsActive(true);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setAuthorName(t.authorName);
    setAuthorTitle(t.authorTitle || "");
    setAuthorImage(t.authorImage || "");
    setContent(t.content);
    setIsActive(t.isActive);
    setEditingId(t.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", e.target.files[0]);
    try {
      const res = await api.post("/api/media/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAuthorImage(res.data.url);
    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      authorName,
      authorTitle: authorTitle || null,
      authorImage: authorImage || null,
      content,
      isActive,
    };

    try {
      if (editingId) {
        await api.patch(`/api/testimonials/admin/${editingId}`, payload);
      } else {
        await api.post("/api/testimonials/admin", payload);
      }
      closeModal();
      fetchTestimonials();
    } catch (error) {
      alert("Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await api.delete(`/api/testimonials/admin/${id}`);
      fetchTestimonials();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const handleToggleActive = async (t: Testimonial) => {
    try {
      await api.patch(`/api/testimonials/admin/${t.id}`, { isActive: !t.isActive });
      fetchTestimonials();
    } catch (error) {
      alert("Toggle failed");
    }
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col h-screen">
      {/* Header */}
      <header className="flex-none bg-white dark:bg-[#151522] border-b border-black/5 dark:border-white/5 h-16 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Testimonials</h1>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-[#0f0f1a]">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#151522] rounded-2xl border border-black/5 dark:border-white/5">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No Testimonials</h3>
              <p className="text-sm text-slate-500">Click "Add Testimonial" to create your first one.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white dark:bg-[#151522] rounded-2xl border border-black/5 dark:border-white/5 p-6 flex flex-col group relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      {t.authorImage ? (
                        <img src={t.authorImage} alt={t.authorName} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">{t.authorName}</h4>
                        {t.authorTitle && <p className="text-sm text-slate-500">{t.authorTitle}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(t)}
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full border transition-colors",
                          t.isActive 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                            : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                        )}
                      >
                        {t.isActive ? "Active" : "Hidden"}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 flex-1 line-clamp-4 italic">
                    "{t.content}"
                  </p>

                  <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(t)}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#151522] rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="testimonial-form" onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Author Name</label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={e => setAuthorName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title / Organization</label>
                    <input
                      type="text"
                      value={authorTitle}
                      onChange={e => setAuthorTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                      placeholder="e.g. CEO at TechCorp"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Author Photo</label>
                  <div className="flex items-center gap-4">
                    {authorImage && (
                      <img src={authorImage} alt="Preview" className="w-12 h-12 rounded-full object-cover" />
                    )}
                    <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-medium rounded-lg cursor-pointer transition-colors text-slate-700 dark:text-slate-300">
                      {uploading ? "Uploading..." : authorImage ? "Change Photo" : "Upload Photo"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Testimonial Content</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0f0f1a] border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                    placeholder="Enter the testimonial..."
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={e => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
                    <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Active (Visible to public)
                    </span>
                  </label>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-black/5 dark:border-white/5 flex justify-end gap-3 bg-slate-50 dark:bg-black/20 rounded-b-2xl">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="testimonial-form"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingId ? "Save Changes" : "Create Testimonial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
