"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, FileText, ExternalLink, Loader2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApiQuery, useApiMutation, useInvalidate } from "@/hooks";
import { FormField, inputStyles, selectStyles, textareaStyles } from "@/components/shared/FormField";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useToast } from "@/components/providers/ToastProvider";
import { publicationFormSchema, type PublicationFormData } from "@/lib/validations";

type Tag = "SCOPUS" | "PEER_REVIEWED" | "UGC_CARE" | "UGC_APPROVED" | "CONFERENCE";

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  tag: Tag;
  authors: string;
  externalUrl: string | null;
}

const tagConfig: Record<Tag, string> = {
  SCOPUS:        "bg-blue-50 text-blue-700 border-blue-200",
  PEER_REVIEWED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  UGC_CARE:      "bg-amber-50 text-amber-700 border-amber-200",
  UGC_APPROVED:  "bg-amber-50 text-amber-700 border-amber-200",
  CONFERENCE:    "bg-purple-50 text-purple-700 border-purple-200",
};

const tagLabels: Record<Tag, string> = {
  SCOPUS: "Scopus",
  PEER_REVIEWED: "Peer Reviewed",
  UGC_CARE: "UGC Care",
  UGC_APPROVED: "UGC Approved",
  CONFERENCE: "Conference",
};

// predefinedJournals are now fetched dynamically from settings
export default function PublicationsAdminPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [filterTag, setFilterTag] = useState<Tag | "ALL">("ALL");
  const [filterJournal, setFilterJournal] = useState<string>("ALL");
  const [editPub, setEditPub] = useState<Publication | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const invalidate = useInvalidate();

  const { data: pubs = [], isLoading } = useApiQuery<Publication[]>(
    ["admin-publications"],
    "/api/publications/admin/all"
  );

  const { data: settingsData } = useApiQuery<{ key: string; value: string }[]>(
    ["admin-settings"],
    "/api/settings/admin/all"
  );

  const journalFiltersSetting = settingsData?.find(s => s.key === "journal_filters")?.value;
  const predefinedJournals = journalFiltersSetting 
    ? journalFiltersSetting.split(",").map(s => s.trim()).filter(Boolean)
    : [
        "British Food Journal (Emerald Publishing Limited)",
        "SMS Journal of Entrepreneurship & Innovation",
        "Journal of Content, Community & Communication",
        "Global Journal of Enterprise Information System",
        "Education and Society",
        "Indian Journal of Commerce Association",
        "Society and Business Review",
        "CSI Communications",
        "Business Strategy & Development (John Wiley & Sons Ltd and ERP Environment)",
        "Arni University International Journal",
        "International Journal of Economics & Managerial Thoughts",
        "Pacific Business Review",
        "Asian Journal of Multidisciplinary Studies (AJMS)",
        "Commerce Spectrum (International Journal of Commerce & Business Studies)",
        "International Journal of Commerce & Social Sciences",
        "Aatmbodh"
      ];

  const { mutate: createPub, isPending: isCreating } = useApiMutation<Publication, PublicationFormData>(
    "POST",
    "/api/publications/admin",
    {
      onSuccess: () => {
        toast({ type: "success", title: editPub ? "Publication updated successfully" : "Publication added successfully" });
        setShowAdd(false);
        setEditPub(null);
        reset({ title: "", authors: "", journal: "", year: new Date().getFullYear(), tag: "SCOPUS", url: "", abstract: "" });
        invalidate(["admin-publications"]);
      },
      onError: (err: any) => {
        toast({ type: "error", title: "Failed to add publication", description: err.message });
      },
    }
  );

  const { mutate: deletePub, isPending: isDeleting } = useApiMutation<void, string>(
    "DELETE",
    (id) => `/api/publications/admin/${id}`,
    {
      onSuccess: () => {
        toast({ type: "success", title: "Publication deleted" });
        setDeleteId(null);
        invalidate(["admin-publications"]);
      },
      onError: (err: any) => {
        toast({ type: "error", title: "Failed to delete", description: err.message });
        setDeleteId(null);
      },
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublicationFormData>({
    resolver: zodResolver(publicationFormSchema),
    defaultValues: {
      title: "",
      authors: "",
      journal: "",
      year: new Date().getFullYear(),
      tag: "SCOPUS" as any,
      url: "",
      abstract: "",
    },
  });

  const onSubmit = (data: any) => {
    createPub({ ...data, id: editPub?.id });
  };

  const filteredPubs = pubs.filter(p => {
    const matchTag = filterTag === "ALL" || p.tag === filterTag;
    
    let matchJournal = filterJournal === "ALL";
    if (!matchJournal && p.journal) {
      // Normalize both strings to handle minor typos, missing spaces (e.g. "&Innovations"), and extra metadata
      const sanitize = (str: string) => str.toLowerCase()
        .replace(/innovations/g, "innovation")
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]/g, ""); // strip spaces and punctuation
        
      const normFilter = sanitize(filterJournal);
      const normDB = sanitize(p.journal);
      matchJournal = normDB.includes(normFilter);
    }
    
    return matchTag && matchJournal;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Publications</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{pubs.length} entries in database</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setEditPub(null);
              reset({ title: "", authors: "", journal: "", year: new Date().getFullYear(), tag: "SCOPUS", url: "", abstract: "" });
              setShowAdd(!showAdd);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Publication
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="card-base p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="font-display text-base font-semibold text-[var(--text-primary)] mb-5">
            {editPub ? "Edit Publication" : "New Publication"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField label="Title" required error={errors.title}>
              <input {...register("title")} placeholder="Publication title" className={inputStyles} disabled={isCreating} />
            </FormField>
            
            <FormField label="Authors" required error={errors.authors}>
              <input {...register("authors")} placeholder="John Doe, Jane Smith" className={inputStyles} disabled={isCreating} />
            </FormField>

            <div className="grid sm:grid-cols-3 gap-5">
              <FormField label="Journal / Conference" required error={errors.journal} className="sm:col-span-1">
                <input 
                  {...register("journal")} 
                  list="journal-options" 
                  placeholder="Select or type Journal..." 
                  className={inputStyles} 
                  disabled={isCreating} 
                />
                <datalist id="journal-options">
                  {predefinedJournals.map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </datalist>
              </FormField>
              <FormField label="Year" required error={errors.year}>
                <input type="number" {...register("year", { valueAsNumber: true })} min="1950" max="2050" className={inputStyles} disabled={isCreating} />
              </FormField>
              <FormField label="Tag" required error={errors.tag}>
                <select {...register("tag")} className={selectStyles} disabled={isCreating}>
                  <option value="SCOPUS">Scopus</option>
                  <option value="PEER_REVIEWED">Peer Reviewed</option>
                  <option value="UGC_CARE">UGC Care</option>
                  <option value="UGC_APPROVED">UGC Approved</option>
                  <option value="CONFERENCE">Conference</option>
                </select>
              </FormField>
            </div>

            <FormField label="External URL (DOI / PDF)" error={errors.url}>
              <input {...register("url")} placeholder="https://doi.org/..." className={inputStyles} disabled={isCreating} />
            </FormField>

            <FormField label="Abstract" error={errors.abstract}>
              <textarea {...register("abstract")} placeholder="Brief summary of the publication..." className={textareaStyles} disabled={isCreating} />
            </FormField>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={isCreating}
                className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center gap-2">
                {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                {editPub ? "Update Publication" : "Save Publication"}
              </button>
              <button type="button" onClick={() => { setShowAdd(false); setEditPub(null); reset({ title: "", authors: "", journal: "", year: new Date().getFullYear(), tag: "SCOPUS", url: "", abstract: "" }); }} disabled={isCreating}
                className="px-5 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] text-sm font-medium hover:border-primary-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card-base overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
            <p className="text-sm text-[var(--text-muted)]">Loading publications...</p>
          </div>
        ) : pubs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)]">No publications yet</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Add your first publication using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-12 align-bottom">S.No</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider align-bottom">Title & Authors</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell align-bottom">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Journal</span>
                      <select
                        value={filterJournal}
                        onChange={(e) => setFilterJournal(e.target.value)}
                        className="px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-full max-w-[200px]"
                      >
                        <option value="ALL">All Journals</option>
                        {predefinedJournals.map(journal => (
                          <option key={journal} value={journal} className="truncate">{journal}</option>
                        ))}
                      </select>
                    </div>
                  </th>
                  <th className="px-5 py-3 text-left hidden lg:table-cell align-bottom">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Type</span>
                      <select
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value as any)}
                        className="px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-full max-w-[140px]"
                      >
                        <option value="ALL">All Types</option>
                        <option value="SCOPUS">Scopus</option>
                        <option value="PEER_REVIEWED">Peer Reviewed</option>
                        <option value="UGC_CARE">UGC Care</option>
                        <option value="UGC_APPROVED">UGC Approved</option>
                        <option value="CONFERENCE">Conference</option>
                      </select>
                    </div>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell align-bottom">Year</th>
                  <th className="px-5 py-3 w-[100px] align-bottom" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredPubs.map((pub, index) => (
                  <tr key={pub.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors group">
                    <td className="px-5 py-4 text-sm font-medium text-[var(--text-soft)]">
                      {index + 1}.
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 pr-4">{pub.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">{pub.authors}</p>
                      {pub.externalUrl && (
                        <a href={pub.externalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-primary-500 mt-2 hover:underline">
                          View PDF <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell align-top">
                      <p className="text-sm text-[var(--text-soft)] italic">{pub.journal}</p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell align-top">
                      <span className={cn("text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full border whitespace-nowrap", tagConfig[pub.tag] || tagConfig.PEER_REVIEWED)}>
                        {tagLabels[pub.tag] || pub.tag.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell align-top">
                      <span className="text-sm text-[var(--text-soft)] bg-[var(--bg-secondary)] px-2.5 py-1 rounded-lg border border-[var(--border)]">{pub.year}</span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditPub(pub);
                            reset({
                              title: pub.title,
                              authors: pub.authors,
                              journal: pub.journal,
                              year: pub.year,
                              tag: pub.tag,
                              url: pub.externalUrl || "",
                              abstract: (pub as any).abstractText || "",
                            });
                            setShowAdd(true);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-soft)] hover:text-blue-600 hover:bg-blue-100 transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(pub.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-soft)] hover:text-red-500 hover:bg-red-500/10 transition-all"
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

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deletePub(deleteId)}
        title="Delete Publication"
        description="Are you sure you want to delete this publication? This action cannot be undone."
        loading={isDeleting}
      />
    </div>
  );
}