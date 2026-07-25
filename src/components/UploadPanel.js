"use client";

import { useRef } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

import { uploadDocument } from "../../actions/uploadDocument";

export default function UploadPanel({
  document,
  setDocument,
  isUploading,
  setIsUploading,
  setMessages,
}) {
  const inputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadDocument(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Save uploaded document info
      setDocument({
        name: file.name,
        ...result.data,
      });

      // Start a fresh conversation
      setMessages([
        {
          role: "assistant",
          text: `✅ "${file.name}" has been uploaded successfully.\n\nThe document contains ${result.data.pages} page(s) and was split into ${result.data.chunks} chunks.\n\nYou can now ask me anything about this document.`,
        },
      ]);

      toast.success("PDF uploaded successfully.");
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Failed to upload PDF.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    await handleUpload(file);

    e.target.value = "";
  };

  const handleDrop = async (e) => {
    e.preventDefault();

    if (isUploading) return;

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

        {document && (
          <p className="mt-2 text-sm text-emerald-600">
            Current document:{" "}
            <span className="font-medium">{document.name}</span>
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".pdf"
        onChange={handleFileChange}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
          {isUploading ? (
            <Loader2 className="h-7 w-7 animate-spin text-slate-700" />
          ) : (
            <UploadCloud className="h-7 w-7 text-slate-700" />
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

        <p className="mt-6 text-sm text-slate-500">PDF • Max 5 MB</p>
      </div>
    </section>
  );
}
