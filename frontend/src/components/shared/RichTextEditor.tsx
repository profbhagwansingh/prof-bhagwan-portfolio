"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-48 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-[var(--text-muted)]" />
    </div>
  ),
});

// Import styles
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
  /** Current HTML value */
  value: string;
  /** Called with the new HTML value */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** CSS class for wrapper */
  className?: string;
  /** Label text */
  label?: string;
  /** Min height in pixels. Default: 200 */
  minHeight?: number;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Error message */
  error?: string;
}

/**
 * Rich text editor component wrapping React Quill.
 * Styled to match the admin dashboard design system.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...",
  className,
  label,
  minHeight = 200,
  disabled = false,
  error,
}: RichTextEditorProps) {
  const [focused, setFocused] = useState(false);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "link"],
        [{ align: [] }],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "link",
    "align",
  ];

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-soft)]">
          {label}
        </label>
      )}

      <div
        className={cn(
          "rich-text-editor-wrapper rounded-xl border transition-colors overflow-hidden",
          focused ? "border-primary-500" : "border-[var(--border)]",
          error && "border-red-500",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ minHeight }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Custom CSS to style Quill to match our design system */}
      <style jsx global>{`
        .rich-text-editor-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid var(--border) !important;
          background: var(--bg-secondary);
          padding: 8px 12px !important;
        }
        .rich-text-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: var(--text-muted);
        }
        .rich-text-editor-wrapper .ql-toolbar .ql-fill {
          fill: var(--text-muted);
        }
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label {
          color: var(--text-muted);
        }
        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: var(--primary-500, #7c5cfc);
        }
        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-fill,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: var(--primary-500, #7c5cfc);
        }
        .rich-text-editor-wrapper .ql-container {
          border: none !important;
          font-family: inherit;
          font-size: 0.875rem;
        }
        .rich-text-editor-wrapper .ql-editor {
          color: var(--text-primary);
          min-height: ${minHeight}px;
          padding: 12px 16px;
          line-height: 1.7;
        }
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: var(--text-muted);
          font-style: normal;
        }
        .rich-text-editor-wrapper .ql-editor a {
          color: var(--primary-500, #7c5cfc);
        }
        .rich-text-editor-wrapper .ql-editor blockquote {
          border-left: 3px solid var(--primary-500, #7c5cfc);
          padding-left: 12px;
          color: var(--text-soft);
        }
        .rich-text-editor-wrapper .ql-snow .ql-picker-options {
          background: var(--bg-card);
          border-color: var(--border);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .rich-text-editor-wrapper .ql-snow .ql-picker-item {
          color: var(--text-soft);
        }
        .rich-text-editor-wrapper .ql-snow .ql-picker-item:hover {
          color: var(--primary-500, #7c5cfc);
        }
      `}</style>
    </div>
  );
}
