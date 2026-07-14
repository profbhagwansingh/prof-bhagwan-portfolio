"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface MediaUploaderProps {
  /** Current image URL (for edit mode) */
  value?: string;
  /** Called with the uploaded image URL */
  onChange: (url: string) => void;
  /** API endpoint for upload. Default: /api/media/upload */
  uploadEndpoint?: string;
  /** Accepted file types. Default: image/* */
  accept?: string;
  /** Max file size in MB. Default: 5 */
  maxSizeMB?: number;
  /** Aspect ratio hint text */
  aspectRatio?: string;
  /** CSS class for the wrapper */
  className?: string;
  /** Label text */
  label?: string;
  /** Whether component is disabled */
  disabled?: boolean;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export function MediaUploader({
  value,
  onChange,
  uploadEndpoint = "/api/media/upload",
  accept = "image/*",
  maxSizeMB = 5,
  aspectRatio,
  className,
  label = "Upload Image",
  disabled = false,
}: MediaUploaderProps) {
  const [state, setState] = useState<UploadState>(value ? "success" : "idle");
  const [preview, setPreview] = useState<string>(value || "");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      // Validate type
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        setState("error");
        return;
      }

      // Validate size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File must be under ${maxSizeMB}MB`);
        setState("error");
        return;
      }

      // Show preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setState("uploading");
      setError("");
      setProgress(0);

      // Upload
      try {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await api.post(uploadEndpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          },
        });

        const url = data.url || data.path || data.filename;
        setPreview(url);
        onChange(url);
        setState("success");
      } catch (err: any) {
        setError(err?.response?.data?.message || "Upload failed");
        setState("error");
        URL.revokeObjectURL(objectUrl);
      }
    },
    [maxSizeMB, onChange, uploadEndpoint]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    setState("idle");
    setError("");
  };

  const stateColors = {
    idle: "border-[var(--border)]",
    uploading: "border-blue-500/50",
    success: "border-emerald-500/50",
    error: "border-red-500/50",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-soft)]">
          {label}
        </label>
      )}

      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden",
          stateColors[state],
          dragOver && "border-primary-500 bg-primary-500/5 scale-[1.01]",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer hover:border-primary-500/40"
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
        />

        {preview ? (
          /* Preview mode */
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
              >
                <Upload className="w-4 h-4 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="w-10 h-10 rounded-full bg-red-500/90 flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Upload progress bar */}
            {state === "uploading" && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Status badge */}
            {state === "uploading" && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-blue-500/90 text-white text-xs font-medium flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                {progress}%
              </div>
            )}
            {state === "success" && (
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center mb-3">
              <ImageIcon className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-soft)] mb-1">
              {dragOver ? "Drop file here" : "Click to upload or drag & drop"}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Max {maxSizeMB}MB • PNG, JPG, WebP
              {aspectRatio && ` • ${aspectRatio}`}
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
