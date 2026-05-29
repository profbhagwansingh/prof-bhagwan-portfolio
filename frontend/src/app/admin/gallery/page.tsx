"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus, Trash2, Image, Video, Newspaper, Loader2,
  RefreshCw, Check, X as XIcon, Sparkles, ImagePlus, Pencil,
  FolderOpen, ChevronRight, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApiQuery, useApiMutation, useInvalidate } from "@/hooks";
import { FormField, inputStyles, selectStyles } from "@/components/shared/FormField";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useToast } from "@/components/providers/ToastProvider";
import { MediaUploader } from "@/components/shared/MediaUploader";
import { galleryItemFormSchema, type GalleryItemFormData } from "@/lib/validations";
import api from "@/lib/api";

type MediaType = "PHOTO" | "VIDEO" | "CLIPPING";
type Tab = "items" | "categories" | "slideshow";

interface GalleryItem {
  id: string; caption: string; mediaType: MediaType; mediaUrl: string; sortOrder: number; isSlideshow?: boolean;
}
interface Category { id: string; name: string; slug: string; }
interface FolderInfo { folder: string; label: string; count: number; }

const mediaIcons: Record<MediaType, React.ElementType> = { PHOTO: Image, VIDEO: Video, CLIPPING: Newspaper };
const mediaColors: Record<MediaType, string> = {
  PHOTO: "bg-blue-50 text-blue-600 border-blue-200",
  VIDEO: "bg-purple-50 text-purple-600 border-purple-200",
  CLIPPING: "bg-amber-50 text-amber-600 border-amber-200",
};

// ─── Reusable File Grid Component ─────────────────────────────
function FileGrid({
  files, loading, error, onRefresh, onUpload, uploading,
  onRename, onDelete, emptyLabel,
}: {
  files: string[]; loading: boolean; error: string | null;
  onRefresh: () => void; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean; onRename: (fileUrl: string, newName: string) => Promise<void>;
  onDelete: (fileUrl: string) => Promise<void>; emptyLabel?: string;
}) {
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [renamingFile, setRenamingFile] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const startRename = (fileUrl: string) => {
    const filename = fileUrl.split("/").pop() || "";
    setEditingFile(fileUrl);
    setEditName(filename.replace(/\.[^.]+$/, ""));
  };

  const handleRename = async () => {
    if (!editingFile || !editName.trim()) return;
    setRenamingFile(true);
    try {
      await onRename(editingFile, editName.trim());
      setEditingFile(null);
    } catch {}
    setRenamingFile(false);
  };

  const handleDelete = async (fileUrl: string) => {
    setDeletingFile(fileUrl);
    try { await onDelete(fileUrl); } catch {}
    setDeletingFile(null);
  };

  if (loading) {
    return (
      <div className="card-base p-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
        <p className="text-sm text-[var(--text-muted)]">Scanning files...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
        <span>{error}</span>
        <button onClick={onRefresh} className="text-xs underline hover:no-underline ml-3">Retry</button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="card-base p-12 text-center">
        <Image className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">{emptyLabel || "No images found."}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">Upload images using the button above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((fileUrl, index) => {
        const filename = fileUrl.split("/").pop() || "";
        const isEditing = editingFile === fileUrl;
        const isDeleting = deletingFile === fileUrl;
        return (
          <div key={fileUrl} className="relative group rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-card)] shadow-sm hover:shadow-md transition-all">
            <div className="aspect-[4/3] w-full relative">
              <img src={fileUrl} alt={filename} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-2 left-2 w-6 h-6 rounded-lg bg-black/50 backdrop-blur-sm text-white flex items-center justify-center text-[10px] font-bold">{index + 1}</div>
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => startRename(fileUrl)} className="w-7 h-7 rounded-lg bg-blue-500/90 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm" title="Rename"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(fileUrl)} disabled={isDeleting} className="w-7 h-7 rounded-lg bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50" title="Delete">
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="p-2.5">
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setEditingFile(null); }}
                    className="flex-1 text-xs px-2 py-1 rounded-lg border border-primary-300 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-0" autoFocus disabled={renamingFile} />
                  <button onClick={handleRename} disabled={renamingFile || !editName.trim()} className="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50 flex-shrink-0">
                    {renamingFile ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  </button>
                  <button onClick={() => setEditingFile(null)} disabled={renamingFile} className="w-6 h-6 rounded-md bg-[var(--bg-secondary)] text-[var(--text-muted)] flex items-center justify-center hover:bg-red-100 hover:text-red-500 flex-shrink-0">
                    <XIcon className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-[var(--text-soft)] truncate font-medium cursor-pointer hover:text-primary-500 transition-colors" title={`Click to rename: ${filename}`} onClick={() => startRename(fileUrl)}>
                  {filename}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function GalleryAdminPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [showCatAdd, setShowCatAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("items");
  const [deleteId, setDeleteId] = useState<{ type: "item" | "category"; id: string } | null>(null);
  const [catName, setCatName] = useState("");
  const { toast } = useToast();
  const invalidate = useInvalidate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab") as Tab;
    if (tab && ["items", "categories", "slideshow"].includes(tab)) setActiveTab(tab);
  }, []);

  // ─── DB QUERIES ───────────────────────────────────────────
  const { data: categories = [], isLoading: catsLoading } = useApiQuery<Category[]>(["admin-gallery-categories"], "/api/gallery/categories");
  const normalize = (d: unknown): any[] => {
    if (Array.isArray(d)) return d;
    if (d && typeof d === "object") { const o = d as any; if (Array.isArray(o.data)) return o.data; if (Array.isArray(o.items)) return o.items; }
    return [];
  };
  const cleanCategories = normalize(categories) as Category[];

  // ─── MUTATIONS ────────────────────────────────────────────
  const { mutate: createItem, isPending: isCreatingItem } = useApiMutation<GalleryItem, GalleryItemFormData>(
    "POST", "/api/gallery/admin/items",
    { onSuccess: () => { toast({ type: "success", title: "Media added" }); setShowAdd(false); reset(); invalidate(["admin-gallery-items"]); }, onError: (e: any) => toast({ type: "error", title: "Failed", description: e.message }) }
  );
  const { mutate: deleteItem, isPending: isDeletingItem } = useApiMutation<void, string>(
    "DELETE", (id) => `/api/gallery/admin/items/${id}`,
    { onSuccess: () => { toast({ type: "success", title: "Deleted" }); setDeleteId(null); invalidate(["admin-gallery-items"]); }, onError: (e: any) => { toast({ type: "error", title: "Failed", description: e.message }); setDeleteId(null); } }
  );
  const { mutate: createCat, isPending: isCreatingCat } = useApiMutation<Category, any>(
    "POST", "/api/gallery/admin/categories",
    { onSuccess: () => { toast({ type: "success", title: "Category added" }); setShowCatAdd(false); setCatName(""); invalidate(["admin-gallery-categories"]); }, onError: (e: any) => toast({ type: "error", title: "Failed", description: e.message }) }
  );
  const { mutate: deleteCat, isPending: isDeletingCat } = useApiMutation<void, string>(
    "DELETE", (id) => `/api/gallery/admin/categories/${id}`,
    { onSuccess: () => { toast({ type: "success", title: "Category deleted" }); setDeleteId(null); invalidate(["admin-gallery-categories"]); }, onError: (e: any) => { toast({ type: "error", title: "Failed", description: e.message }); setDeleteId(null); } }
  );

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<GalleryItemFormData>({
    resolver: zodResolver(galleryItemFormSchema),
    defaultValues: { caption: "", mediaUrl: "", mediaType: "PHOTO", categoryId: undefined, sortOrder: 0 },
  });
  const onSubmitItem = (data: GalleryItemFormData) => createItem(data);
  const handleAddCat = (e: React.FormEvent) => { e.preventDefault(); if (!catName.trim()) return; createCat({ name: catName, slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") }); };
  const handleDeleteConfirm = () => { if (!deleteId) return; deleteId.type === "item" ? deleteItem(deleteId.id) : deleteCat(deleteId.id); };

  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [foldersLoading, setFoldersLoading] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  // Folder management state
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [isRenamingFolder, setIsRenamingFolder] = useState(false);
  const [isDeletingFolder, setIsDeletingFolder] = useState<string | null>(null);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const [folderFiles, setFolderFiles] = useState<string[]>([]);
  const [folderFilesLoading, setFolderFilesLoading] = useState(false);
  const [folderError, setFolderError] = useState<string | null>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const fetchFolders = useCallback(async () => {
    setFoldersLoading(true);
    try {
      const { data } = await api.get("/api/gallery/admin/folders");
      setFolders(Array.isArray(data) ? data : []);
    } catch { }
    setFoldersLoading(false);
  }, []);

  const fetchFolderFiles = useCallback(async (folder: string) => {
    setFolderFilesLoading(true);
    setFolderError(null);
    try {
      const { data } = await api.get(`/api/gallery/admin/files?folder=${encodeURIComponent(folder)}`);
      setFolderFiles(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setFolderError(`Failed: ${err?.message}`);
    }
    setFolderFilesLoading(false);
  }, []);

  useEffect(() => { if (activeTab === "items") fetchFolders(); }, [activeTab, fetchFolders]);
  useEffect(() => { if (activeFolder) fetchFolderFiles(activeFolder); }, [activeFolder, fetchFolderFiles]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setIsCreatingFolder(true);
    try {
      await api.post("/api/gallery/admin/folders", { name: newFolderName.trim() });
      toast({ type: "success", title: "Folder created" });
      setNewFolderName("");
      setShowAddFolder(false);
      fetchFolders();
    } catch (err: any) { toast({ type: "error", title: "Failed", description: err?.response?.data?.message || err?.message }); }
    setIsCreatingFolder(false);
  };

  const handleRenameFolder = async (oldName: string) => {
    if (!editFolderName.trim()) return;
    setIsRenamingFolder(true);
    try {
      await api.patch("/api/gallery/admin/folders/rename", { oldName, newName: editFolderName.trim() });
      toast({ type: "success", title: "Folder renamed" });
      setEditingFolder(null);
      fetchFolders();
    } catch (err: any) { toast({ type: "error", title: "Failed", description: err?.response?.data?.message || err?.message }); }
    setIsRenamingFolder(false);
  };

  const handleDeleteFolder = async (folderName: string) => {
    if (!confirm(`Delete folder "${folderName}" and all its images?`)) return;
    setIsDeletingFolder(folderName);
    try {
      await api.delete(`/api/gallery/admin/folders?folder=${encodeURIComponent(folderName)}`);
      toast({ type: "success", title: "Folder deleted" });
      fetchFolders();
    } catch (err: any) { toast({ type: "error", title: "Failed", description: err?.response?.data?.message || err?.message }); }
    setIsDeletingFolder(null);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || !activeFolder) return;
    setGalleryUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < fileList.length; i++) formData.append("files", fileList[i]);
      await api.post(`/api/gallery/admin/files/upload?folder=${encodeURIComponent(activeFolder)}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast({ type: "success", title: `${fileList.length} image(s) uploaded` });
      fetchFolderFiles(activeFolder);
      fetchFolders();
    } catch (err: any) { toast({ type: "error", title: "Upload failed", description: err?.message }); }
    setGalleryUploading(false);
    e.target.value = "";
  };

  const handleGalleryRename = async (fileUrl: string, newName: string) => {
    if (!activeFolder) return;
    const oldName = fileUrl.split("/").pop() || "";
    try {
      await api.patch("/api/gallery/admin/files/rename", { folder: activeFolder, oldName, newName });
      toast({ type: "success", title: "Renamed" });
      if (activeFolder) fetchFolderFiles(activeFolder);
    } catch (err: any) {
      toast({ type: "error", title: "Rename failed", description: err?.response?.data?.message || err?.message });
      throw err;
    }
  };

  const handleGalleryDelete = async (fileUrl: string) => {
    if (!activeFolder) return;
    const filename = fileUrl.split("/").pop() || "";
    try {
      await api.delete(`/api/gallery/admin/files/${encodeURIComponent(filename)}?folder=${encodeURIComponent(activeFolder)}`);
      toast({ type: "success", title: "Image deleted" });
      if (activeFolder) { fetchFolderFiles(activeFolder); fetchFolders(); }
    } catch (err: any) {
      toast({ type: "error", title: "Delete failed", description: err?.response?.data?.message || err?.message });
      throw err;
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  SLIDESHOW STATE
  // ═══════════════════════════════════════════════════════════
  const [slideshowFiles, setSlideshowFiles] = useState<string[]>([]);
  const [slideshowLoading, setSlideshowLoading] = useState(false);
  const [slideshowError, setSlideshowError] = useState<string | null>(null);
  const [slideshowUploading, setSlideshowUploading] = useState(false);

  const fetchSlideshow = useCallback(async () => {
    setSlideshowLoading(true); setSlideshowError(null);
    try { const { data } = await api.get("/api/gallery/admin/slideshow-files"); setSlideshowFiles(Array.isArray(data) ? data : []); }
    catch (err: any) { setSlideshowError(`Failed: ${err?.message}`); }
    setSlideshowLoading(false);
  }, []);

  useEffect(() => { if (activeTab === "slideshow") fetchSlideshow(); }, [activeTab, fetchSlideshow]);

  const handleSlideshowUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setSlideshowUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < fileList.length; i++) formData.append("files", fileList[i]);
      await api.post("/api/gallery/admin/slideshow-files/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast({ type: "success", title: `${fileList.length} image(s) uploaded` });
      fetchSlideshow();
    } catch (err: any) { toast({ type: "error", title: "Upload failed", description: err?.message }); }
    setSlideshowUploading(false);
    e.target.value = "";
  };

  const handleSlideshowRename = async (fileUrl: string, newName: string) => {
    const oldName = fileUrl.split("/").pop() || "";
    try {
      await api.patch("/api/gallery/admin/slideshow-files/rename", { oldName, newName });
      toast({ type: "success", title: "Renamed" });
      fetchSlideshow();
    } catch (err: any) {
      toast({ type: "error", title: "Rename failed", description: err?.response?.data?.message || err?.message });
      throw err;
    }
  };

  const handleSlideshowDelete = async (fileUrl: string) => {
    const filename = fileUrl.split("/").pop() || "";
    try {
      await api.delete(`/api/gallery/admin/slideshow-files/${encodeURIComponent(filename)}`);
      toast({ type: "success", title: "Image deleted" });
      fetchSlideshow();
    } catch (err: any) {
      toast({ type: "error", title: "Delete failed", description: err?.response?.data?.message || err?.message });
      throw err;
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Gallery Management</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {activeTab === "items" && !activeFolder ? `${folders.length} folders` : activeTab === "items" && activeFolder ? `${folderFiles.length} images` : activeTab === "categories" ? `${cleanCategories.length} categories` : `${slideshowFiles.length} slideshow images`}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-xl w-fit border border-[var(--border)]">
        {(["items", "categories", "slideshow"] as const).map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); if (tab === "items") setActiveFolder(null); }} className={cn(
            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
            activeTab === tab ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-soft)]"
          )}>
            {tab === "slideshow" && <Sparkles className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
            {tab === "items" ? "Gallery" : tab}
          </button>
        ))}
      </div>

      {/* ──── ITEMS TAB: Folder Browser ──── */}
      {activeTab === "items" && !activeFolder && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">Media Folders</h2>
            <div className="flex gap-2">
              <button onClick={() => setShowAddFolder(!showAddFolder)} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm">
                <Plus className="w-4 h-4" /> Add Folder
              </button>
              <button onClick={fetchFolders} disabled={foldersLoading} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-soft)] text-sm font-medium hover:border-primary-300 transition-colors">
                <RefreshCw className={cn("w-4 h-4", foldersLoading && "animate-spin")} />
              </button>
            </div>
          </div>

          {showAddFolder && (
            <div className="card-base p-5 animate-in fade-in slide-in-from-top-4 duration-200">
              <form onSubmit={handleCreateFolder} className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[200px]"><FormField label="New Folder Name" required><input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="e.g. img/Awards" className={inputStyles} disabled={isCreatingFolder} /></FormField></div>
                <button type="submit" disabled={isCreatingFolder || !newFolderName.trim()} className="px-5 py-2.5 h-[42px] rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center gap-2">{isCreatingFolder && <Loader2 className="w-4 h-4 animate-spin" />} Create</button>
              </form>
            </div>
          )}

          {foldersLoading ? (
            <div className="card-base p-12 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
              <p className="text-sm text-[var(--text-muted)]">Scanning folders...</p>
            </div>
          ) : folders.length === 0 ? (
            <div className="card-base p-12 text-center">
              <FolderOpen className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-muted)]">No media folders found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {folders.map((f) => {
                const isEditing = editingFolder === f.folder;
                return (
                <div key={f.folder} className="card-base p-5 flex items-center gap-4 hover:border-primary-300 hover:shadow-md transition-all text-left group">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0 cursor-pointer" onClick={() => setActiveFolder(f.folder)}>
                    <FolderOpen className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <input value={editFolderName} onChange={(e) => setEditFolderName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleRenameFolder(f.folder); if (e.key === "Escape") setEditingFolder(null); }} className="flex-1 text-xs px-2 py-1 rounded-md border border-primary-300 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 min-w-0" autoFocus disabled={isRenamingFolder} />
                        <button onClick={() => handleRenameFolder(f.folder)} disabled={isRenamingFolder} className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50"><Check className="w-3 h-3" /></button>
                        <button onClick={() => setEditingFolder(null)} disabled={isRenamingFolder} className="w-6 h-6 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)] flex items-center justify-center hover:text-red-500"><XIcon className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-[var(--text-primary)] capitalize truncate cursor-pointer hover:text-primary-500" onClick={() => setActiveFolder(f.folder)}>{f.label}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{f.count} image{f.count !== 1 ? "s" : ""}</p>
                      </>
                    )}
                  </div>
                  {!isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setEditingFolder(f.folder); setEditFolderName(f.folder); }} className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-soft)] flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteFolder(f.folder); }} disabled={isDeletingFolder === f.folder} className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-soft)] flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50">
                        {isDeletingFolder === f.folder ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-primary-500 transition-colors flex-shrink-0 cursor-pointer" onClick={() => setActiveFolder(f.folder)} />
                </div>
              )})}
            </div>
          )}
        </div>
      )}

      {/* ──── ITEMS TAB: Folder Contents ──── */}
      {activeTab === "items" && activeFolder && (
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveFolder(null)} className="w-9 h-9 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-300 transition-all">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] capitalize">
                  {activeFolder.split("/").pop()?.replace(/[-_]/g, " ")}
                </h2>
                <p className="text-xs text-[var(--text-muted)] font-mono">media/{activeFolder}/</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors shadow-sm text-white",
                galleryUploading ? "bg-primary-400 cursor-wait" : "bg-primary-500 hover:bg-primary-600"
              )}>
                {galleryUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                {galleryUploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={galleryUploading} />
              </label>
              <button onClick={() => fetchFolderFiles(activeFolder)} disabled={folderFilesLoading} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-soft)] text-sm font-medium hover:border-primary-300 transition-colors">
                <RefreshCw className={cn("w-4 h-4", folderFilesLoading && "animate-spin")} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">Images</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-500 text-white">{folderFiles.length}</span>
          </div>

          <FileGrid
            files={folderFiles} loading={folderFilesLoading} error={folderError}
            onRefresh={() => fetchFolderFiles(activeFolder)} onUpload={handleGalleryUpload}
            uploading={galleryUploading} onRename={handleGalleryRename} onDelete={handleGalleryDelete}
            emptyLabel="No images in this folder."
          />
        </div>
      )}

      {/* ──── CATEGORIES TAB ──── */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowCatAdd(!showCatAdd)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-primary-300 text-[var(--text-soft)] text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Add Category</button>
          </div>
          {showCatAdd && (
            <div className="card-base p-5 animate-in fade-in slide-in-from-top-4 duration-200">
              <form onSubmit={handleAddCat} className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[200px]"><FormField label="Category Name" required><input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Research" className={inputStyles} disabled={isCreatingCat} /></FormField></div>
                <button type="submit" disabled={isCreatingCat || !catName.trim()} className="px-5 py-2.5 h-[42px] rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center gap-2">{isCreatingCat && <Loader2 className="w-4 h-4 animate-spin" />} Save</button>
              </form>
            </div>
          )}
          <div className="card-base divide-y divide-[var(--border)]">
            {catsLoading ? <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 text-primary-500 animate-spin" /></div>
            : cleanCategories.length === 0 ? <div className="p-8 text-center text-sm text-[var(--text-muted)]">No categories yet.</div>
            : cleanCategories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-5 py-4 group hover:bg-[var(--bg-secondary)]/50 transition-colors">
                <div><p className="text-sm font-medium text-[var(--text-primary)]">{cat.name}</p><p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{cat.slug}</p></div>
                <button onClick={() => setDeleteId({ type: "category", id: cat.id })} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──── SLIDESHOW TAB ──── */}
      {activeTab === "slideshow" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">Hero Slideshow Manager</h2>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage images in the homepage hero slideshow</p>
            </div>
            <div className="flex items-center gap-2">
              <label className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors shadow-sm text-white",
                slideshowUploading ? "bg-primary-400 cursor-wait" : "bg-primary-500 hover:bg-primary-600"
              )}>
                {slideshowUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                {slideshowUploading ? "Uploading..." : "Upload Images"}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleSlideshowUpload} disabled={slideshowUploading} />
              </label>
              <button onClick={fetchSlideshow} disabled={slideshowLoading} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-soft)] text-sm font-medium hover:border-primary-300 transition-colors">
                <RefreshCw className={cn("w-4 h-4", slideshowLoading && "animate-spin")} />
              </button>
            </div>
          </div>

          {slideshowFiles.length > 0 && !slideshowLoading && (
            <div className="flex items-center gap-3">
              <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">Slideshow Images</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-500 text-white">{slideshowFiles.length}</span>
            </div>
          )}

          <FileGrid
            files={slideshowFiles} loading={slideshowLoading} error={slideshowError}
            onRefresh={fetchSlideshow} onUpload={handleSlideshowUpload}
            uploading={slideshowUploading} onRename={handleSlideshowRename} onDelete={handleSlideshowDelete}
          />
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title={deleteId?.type === "item" ? "Delete Media" : "Delete Category"}
        description={deleteId?.type === "item" ? "Delete this media item? This cannot be undone." : "Delete this category? Items will become uncategorized."}
        loading={isDeletingItem || isDeletingCat}
      />
    </div>
  );
}