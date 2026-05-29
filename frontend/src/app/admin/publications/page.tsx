"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, FileText, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApiQuery, useApiMutation, useInvalidate } from "@/hooks";
import { FormField, inputStyles, selectStyles, textareaStyles } from "@/components/shared/FormField";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useToast } from "@/components/providers/ToastProvider";
import { publicationFormSchema, type PublicationFormData } from "@/lib/validations";

type Tag = "SCOPUS" | "PEER_REVIEWED" | "UGC_CARE" | "CONFERENCE";

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
  CONFERENCE:    "bg-purple-50 text-purple-700 border-purple-200",
};

export default function PublicationsAdminPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const invalidate = useInvalidate();

  const { data: pubs = [], isLoading } = useApiQuery<Publication[]>(
    ["admin-publications"],
    "/api/publications/admin/all"
  );

  const { mutate: createPub, isPending: isCreating } = useApiMutation<Publication, PublicationFormData>(
    "POST",
    "/api/publications/admin",
    {
      onSuccess: () => {
        toast({ type: "success", title: "Publication added successfully" });
        setShowAdd(false);
        reset();
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

  const onSubmit = (data: PublicationFormData) => {
    createPub(data);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Publications</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{pubs.length} entries in database</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Publication
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="card-base p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="font-display text-base font-semibold text-[var(--text-primary)] mb-5">New Publication</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField label="Title" required error={errors.title}>
              <input {...register("title")} placeholder="Publication title" className={inputStyles} disabled={isCreating} />
            </FormField>
            
            <FormField label="Authors" required error={errors.authors}>
              <input {...register("authors")} placeholder="John Doe, Jane Smith" className={inputStyles} disabled={isCreating} />
            </FormField>

            <div className="grid sm:grid-cols-3 gap-5">
              <FormField label="Journal / Conference" required error={errors.journal} className="sm:col-span-1">
                <input {...register("journal")} placeholder="Journal name" className={inputStyles} disabled={isCreating} />
              </FormField>
              <FormField label="Year" required error={errors.year}>
                <input type="number" {...register("year", { valueAsNumber: true })} min="1950" max="2050" className={inputStyles} disabled={isCreating} />
              </FormField>
              <FormField label="Tag" required error={errors.tag}>
                <select {...register("tag")} className={selectStyles} disabled={isCreating}>
                  <option value="SCOPUS">Scopus</option>
                  <option value="PEER_REVIEWED">Peer Reviewed</option>
                  <option value="UGC_CARE">UGC CARE</option>
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
                Save Publication
              </button>
              <button type="button" onClick={() => { setShowAdd(false); reset(); }} disabled={isCreating}
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
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Title & Authors</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">Journal</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">Year</th>
                  <th className="px-5 py-3 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {pubs.map((pub) => (
                  <tr key={pub.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors group">
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
                    <td className="px-5 py-4 hidden sm:table-cell align-top">
                      <span className="text-sm text-[var(--text-soft)] bg-[var(--bg-secondary)] px-2.5 py-1 rounded-lg border border-[var(--border)]">{pub.year}</span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <button onClick={() => setDeleteId(pub.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
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