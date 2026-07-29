"use client";

import { useRef } from "react";
import { toast } from "react-hot-toast";
import { uploadDocument } from "../../actions/uploadDocument";
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  RefreshCcw,
  FileText,
} from "lucide-react";

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

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds the 5 MB limit.");
      return;
    }

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
          text: `Ask me anything about this document.`,
        },
      ]);

      toast.success("Document indexed.");
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
    <section className="flex h-full w-full flex-col rounded-2xl border border-[#262D37] bg-[#151920]">
      <div className="border-b border-[#262D37] px-5 py-4">
        <p className="  uppercase tracking-widest text-[#5B6472]">
          Upload Document
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />

        {!document && (
          <>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#262D37] bg-[#0D1015] p-8 text-center transition hover:border-[#5B8DEF]/50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#262D37] bg-[#151920]">
                {isUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#5B8DEF]" />
                ) : (
                  <UploadCloud className="h-5 w-5 text-[#5B8DEF]" />
                )}
              </div>

              <h3 className="mt-5 text-sm font-medium text-[#E7EAEE]">
                {isUploading ? "Indexing document" : "Drop a PDF to index"}
              </h3>

              <button
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
                className="mt-6 rounded-lg bg-[#5B8DEF] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#4A7CDE] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? "Uploading…" : "Choose PDF"}
              </button>
            </div>

            <div className="mt-4 space-y-1.5 rounded-lg border border-[#262D37] bg-[#0D1015] px-4 py-3">
              {[
                ["format", "PDF"],
                ["max size", "5 MB"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between ">
                  <span className="text-[#5B6472]">{label}</span>
                  <span className="text-[#8992A3]">{value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {document && (
          <div className="flex flex-1 flex-col">
            <div className="flex items-start gap-3 rounded-xl border border-[#262D37] bg-[#0D1015] p-4">
              <div className="rounded-lg border border-[#262D37] bg-[#151920] p-2.5">
                <FileText className="h-5 w-5 text-[#5B8DEF]" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-[#E7EAEE]">
                  {document.name}
                </h3>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Stat label="pages" value={document.pages} />
              <Stat label="chunks" value={document.chunks} />
            </div>

            <button
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
              className="mt-auto flex items-center justify-center gap-2 rounded-lg border border-[#262D37] bg-[#0D1015] px-4 py-2.5 text-xs font-medium text-[#8992A3] transition hover:border-[#5B8DEF]/50 hover:text-[#E7EAEE]"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Replace document
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-[#262D37] bg-[#0D1015] p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#5B6472]">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-xl font-semibold text-[#E7EAEE]">
        {value}
      </p>
    </div>
  );
}
