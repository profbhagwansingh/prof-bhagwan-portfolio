"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when the dialog should close */
  onClose: () => void;
  /** Called when the user confirms */
  onConfirm: () => void;
  /** Dialog title */
  title: string;
  /** Description text */
  description?: string;
  /** Confirm button text. Default: "Delete" */
  confirmText?: string;
  /** Whether the confirm action is destructive (red button). Default: true */
  destructive?: boolean;
  /** Whether the confirm button should show loading */
  loading?: boolean;
}

/**
 * Accessible confirm dialog with backdrop blur and keyboard support.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  destructive = true,
  loading = false,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      // Focus confirm button when dialog opens
      setTimeout(() => confirmRef.current?.focus(), 100);

      // Close on Escape
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border)] w-full max-w-md p-6 animate-in zoom-in-95 fade-in duration-200">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
            destructive
              ? "bg-red-500/10 text-red-500"
              : "bg-amber-500/10 text-amber-500"
          )}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-[var(--text-primary)] font-display mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
            {description}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-soft)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center gap-2",
              destructive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary-500 hover:bg-primary-600"
            )}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
