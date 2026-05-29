"use client";

import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import type { FieldError } from "react-hook-form";

interface FormFieldProps {
  /** Label text */
  label: string;
  /** Error from react-hook-form */
  error?: FieldError;
  /** Optional helper text below the input */
  helperText?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Child input element */
  children: React.ReactNode;
  /** CSS class for wrapper */
  className?: string;
}

/**
 * Styled form field wrapper for react-hook-form.
 * Renders label, child input, error message, and helper text.
 */
export function FormField({
  label,
  error,
  helperText,
  required = false,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-sm font-medium text-[var(--text-soft)]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 text-sm text-red-500 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error.message}
        </div>
      )}
      {helperText && !error && (
        <p className="text-xs text-[var(--text-muted)] mt-1">{helperText}</p>
      )}
    </div>
  );
}

/**
 * Styled input element matching the admin design system.
 * Use with React.forwardRef for react-hook-form's register().
 */
export const inputStyles = cn(
  "w-full px-3.5 py-2.5 rounded-xl text-sm",
  "bg-[var(--bg-secondary)] border border-[var(--border)]",
  "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
  "focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500",
  "transition-all duration-150",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

export const selectStyles = cn(inputStyles, "appearance-none cursor-pointer");

export const textareaStyles = cn(inputStyles, "resize-y min-h-[100px]");
