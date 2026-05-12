import React, { useRef, useState } from "react";
import { Upload, X, Loader2, Link } from "lucide-react";
import { apiUrl } from "@/lib/api";

interface Props {
  value: string;
  onChange: (url: string) => void;
  folderPath: string[];
  label?: string;
  multiple?: boolean;
  placeholder?: string;
}

async function uploadFile(file: File, folderPath: string[]): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", JSON.stringify(folderPath));
  const res = await fetch(apiUrl("/upload"), { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Upload failed");
  }
  const data = await res.json();
  return data.url as string;
}

export default function DriveImageUpload({ value, onChange, folderPath, label, multiple, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);

  const urls = value ? value.split(",").map(u => u.trim()).filter(Boolean) : [];

  async function handleFiles(files: FileList) {
    setError("");
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, folderPath);
        uploaded.push(url);
      }
      if (multiple) {
        const merged = [...urls, ...uploaded].join(",");
        onChange(merged);
      } else {
        onChange(uploaded[0]);
      }
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeUrl(idx: number) {
    const next = urls.filter((_, i) => i !== idx).join(",");
    onChange(next);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}

      <div
        className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-pink-300 hover:bg-pink-50 transition-colors"
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={e => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-1 text-pink-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">Uploading to Cloudinary...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <Upload className="w-6 h-6" />
            <span className="text-sm">Click or drag & drop to upload{multiple ? " (multiple)" : ""}</span>
            <span className="text-xs">JPG, PNG, WEBP up to 10MB</span>
          </div>
        )}
      </div>

      {urls.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {urls.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                className="w-16 h-16 object-cover rounded border border-gray-200"
                onError={e => (e.currentTarget.style.opacity = "0.3")}
              />
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowUrl(v => !v)}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
      >
        <Link className="w-3 h-3" />
        {showUrl ? "Hide" : "Or paste URL directly"}
      </button>

      {showUrl && (
        <input
          type="text"
          className="w-full border rounded-md p-2 text-sm"
          placeholder={placeholder || "https://res.cloudinary.com/... or any image URL"}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
