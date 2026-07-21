"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, BookOpen, Loader2, Pencil } from "lucide-react";
import { useApiQuery, useApiMutation, useInvalidate } from "@/hooks";
import { FormField, inputStyles } from "@/components/shared/FormField";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useToast } from "@/components/providers/ToastProvider";

const bookChapterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.string().optional(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  year: z.coerce.number().min(1900).max(2100),
  slNo: z.coerce.number().min(1)
});
type BookChapterFormData = z.infer<typeof bookChapterSchema>;

interface BookChapter {
  id: string;
  slNo: number;
  title: string;
  authors: string | null;
  publisher: string | null;
  isbn: string | null;
  year: number;
}

export default function BookChaptersAdminPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [editChapter, setEditChapter] = useState<BookChapter | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const invalidate = useInvalidate();

  const { data: chapters = [], isLoading } = useApiQuery<BookChapter[]>(
    ["admin-book-chapters"],
    "/api/publications/admin/chapters/all"
  );

  const { mutate: createChapter, isPending: isCreating } = useApiMutation<BookChapter, BookChapterFormData>(
    "POST",
    "/api/publications/admin/chapters",
    {
      onSuccess: () => {
        toast({ type: "success", title: "Book chapter saved successfully" });
        invalidate(["admin-book-chapters"]);
        setShowAdd(false);
        setEditChapter(null);
        reset();
      }
    }
  );

  const { mutate: deleteChapter, isPending: isDeleting } = useApiMutation(
    "DELETE",
    (id: string) => `/api/publications/admin/chapters/${id}`,
    {
      onSuccess: () => {
        toast({ type: "success", title: "Book chapter deleted" });
        invalidate(["admin-book-chapters"]);
        setDeleteId(null);
      }
    }
  );

  const { register, handleSubmit, formState: { errors }, reset } = useForm<any>({
    resolver: zodResolver(bookChapterSchema),
    defaultValues: { year: new Date().getFullYear(), slNo: chapters.length + 1 }
  });

  const onSubmit = (data: any) => {
    createChapter(editChapter ? { ...data, id: editChapter.id } : data);
  };

  const startEdit = (chapter: BookChapter) => {
    setEditChapter(chapter);
    reset({
      title: chapter.title,
      authors: chapter.authors || "",
      publisher: chapter.publisher || "",
      isbn: chapter.isbn || "",
      year: chapter.year,
      slNo: chapter.slNo
    });
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Book Chapters</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{chapters.length} chapters in database</p>
        </div>
        <button
          onClick={() => {
            setEditChapter(null);
            reset({ title: "", authors: "", publisher: "", isbn: "", year: new Date().getFullYear(), slNo: chapters.length + 1 });
            setShowAdd(!showAdd);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Chapter
        </button>
      </div>

      {showAdd && (
        <div className="card-base p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="font-display text-base font-semibold text-[var(--text-primary)] mb-5">
            {editChapter ? "Edit Book Chapter" : "New Book Chapter"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-6 gap-5">
              <FormField label="S.No" required error={errors.slNo as any} className="sm:col-span-1">
                <input type="number" {...register("slNo")} className={inputStyles} disabled={isCreating} />
              </FormField>
              <FormField label="Title" required error={errors.title as any} className="sm:col-span-5">
                <input {...register("title")} placeholder="Chapter title" className={inputStyles} disabled={isCreating} />
              </FormField>
            </div>
            
            <FormField label="Authors" error={errors.authors as any}>
              <input {...register("authors")} placeholder="Author names" className={inputStyles} disabled={isCreating} />
            </FormField>

            <div className="grid sm:grid-cols-3 gap-5">
              <FormField label="Publisher Details" error={errors.publisher as any} className="sm:col-span-1">
                <input {...register("publisher")} placeholder="Publisher name" className={inputStyles} disabled={isCreating} />
              </FormField>
              <FormField label="ISBN" error={errors.isbn as any}>
                <input {...register("isbn")} placeholder="ISBN number" className={inputStyles} disabled={isCreating} />
              </FormField>
              <FormField label="Year" required error={errors.year as any}>
                <input type="number" {...register("year")} className={inputStyles} disabled={isCreating} />
              </FormField>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--border-base)]">
              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
              >
                {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                {editChapter ? "Update Chapter" : "Save Chapter"}
              </button>
              <button
                type="button"
                onClick={() => { setShowAdd(false); setEditChapter(null); reset(); }}
                className="px-5 py-2.5 rounded-xl bg-white border border-[var(--border-base)] hover:bg-[var(--bg-muted)] text-[var(--text-primary)] text-sm font-medium transition-colors shadow-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card-base overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
            <p className="text-sm text-[var(--text-muted)]">Loading chapters...</p>
          </div>
        ) : chapters.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-muted)] flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)]">No chapters found</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Click the Add Chapter button to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-muted)] text-[var(--text-muted)] font-medium">
                <tr>
                  <th className="px-5 py-3 whitespace-nowrap w-16">S.No</th>
                  <th className="px-5 py-3">Title & Authors</th>
                  <th className="px-5 py-3">Publisher Details</th>
                  <th className="px-5 py-3 whitespace-nowrap">Year</th>
                  <th className="px-5 py-3 w-[100px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-base)]">
                {chapters.map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-[var(--bg-muted)]/50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-[var(--text-primary)]">
                      {chapter.slNo}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[var(--text-primary)]">{chapter.title}</p>
                      {chapter.authors && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">{chapter.authors}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] text-[var(--text-secondary)]">{chapter.publisher}</p>
                      {chapter.isbn && <p className="text-[12px] text-[var(--text-muted)]">ISBN: {chapter.isbn}</p>}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-[var(--text-secondary)]">
                      {chapter.year}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(chapter)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(chapter.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteChapter(deleteId)}
        title="Delete Book Chapter"
        description="Are you sure you want to delete this chapter? This action cannot be undone."
        confirmText="Delete Chapter"
        destructive
        loading={isDeleting}
      />
    </div>
  );
}
