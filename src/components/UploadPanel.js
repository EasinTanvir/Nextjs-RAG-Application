"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { uploadDocument } from "../../actions/uploadDocument";
import toast from "react-hot-toast";

export default function UploadPanel() {
  const inputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file) => {
    if (!file) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      console.log("file", file);

      const result = await uploadDocument(formData);

      console.log("Upload Result:", result);
    } catch (error) {
      console.error("error message", error);
      toast.remove(error.message || "Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    await handleUpload(file);

    // Allow selecting the same file again
    e.target.value = "";
  };

  const handleDrop = async (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    await handleUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-base font-semibold text-slate-900">Upload PDF</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        hidden
        onChange={handleFileChange}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-sm">
          {isUploading ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : (
            <UploadCloud className="h-7 w-7" />
          )}
        </div>

        <p className="mt-6 text-lg font-semibold text-slate-900">
          Drag & Drop PDF
        </p>

        <p className="mt-2 text-sm text-slate-500">
          or browse from your device
        </p>

        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : "Browse files"}
        </button>

        <p className="mt-6 text-sm text-slate-500">PDF · Max 5 MB</p>
      </div>
    </section>
  );
}
