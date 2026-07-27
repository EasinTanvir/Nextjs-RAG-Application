"use client";

import { useRef } from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  RefreshCcw,
  UploadCloud,
} from "lucide-react";
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

      setDocument({
        name: file.name,
        uploadedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        ...result.data,
      });

      setMessages([
        {
          role: "assistant",
          text: `Your document has been indexed successfully.\n\nYou can now ask questions, request summaries, or search for specific information.`,
        },
      ]);

      toast.success("Document indexed successfully.");
    } catch (error) {
      toast.error(error.message || "Upload failed.");
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

  return (
    <section className="flex w-full h-full flex-col rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">Knowledge Base</h2>

        <p className="mt-1 text-sm text-slate-500">
          Upload one PDF and chat with its contents.
        </p>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />

        {/* ================= Empty State ================= */}
        {!document && (
          <>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-slate-400 hover:bg-slate-100"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                ) : (
                  <UploadCloud className="h-8 w-8 text-slate-700" />
                )}
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                {isUploading
                  ? "Indexing your document..."
                  : "Drop your PDF here"}
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                Upload a PDF and start asking questions about its contents in
                seconds.
              </p>

              <button
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
                className="mt-8 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Choose PDF"}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Supported</p>

              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li>• PDF documents</li>
                <li>• Maximum 5 MB</li>
                <li>• Automatic indexing</li>
                <li>• AI-powered semantic search</li>
              </ul>
            </div>
          </>
        )}

        {/* ================= Uploaded State ================= */}

        {document && (
          <div className="flex flex-1 flex-col">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  <FileText className="h-7 w-7 text-slate-700" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {document.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Ready for chat</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Pages
                  </p>

                  <p className="mt-2 text-2xl font-bold">{document.pages}</p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Chunks
                  </p>

                  <p className="mt-2 text-2xl font-bold">{document.chunks}</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Uploaded
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  {document.uploadedAt}
                </p>
              </div>
            </div>

            <button
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium transition hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Replace Document
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
