import { UploadCloud } from "lucide-react";
import DocumentCard from "./DocumentCard";

const documents = [
  {
    title: "Q2 product roadmap.pdf",
    size: "1.2 MB",
    date: "Apr 16, 2026",
    status: "Ready",
  },
  {
    title: "Investor deck.pdf",
    size: "2.8 MB",
    date: "Apr 13, 2026",
    status: "Processing",
  },
  {
    title: "Compliance summary.pdf",
    size: "920 KB",
    date: "Apr 10, 2026",
    status: "Failed",
  },
];

export default function UploadPanel() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-base font-semibold text-slate-900">Upload PDF</p>
        <p className="mt-2 text-sm text-slate-500">
          Add a document to begin extracting insights and reviewing content from
          your files.
        </p>
      </div>

      <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-sm">
          <UploadCloud className="h-7 w-7" />
        </div>
        <p className="mt-6 text-lg font-semibold text-slate-900">
          Drag &amp; Drop PDF
        </p>
        <p className="mt-2 text-sm text-slate-500">
          or browse from your device
        </p>
        <button
          type="button"
          className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
        >
          Browse files
        </button>
        <p className="mt-6 text-sm text-slate-500">PDF · Max 25 MB</p>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">
            Recent documents
          </p>
          <p className="text-sm text-slate-500">Latest uploads</p>
        </div>
        <div className="space-y-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.title} {...doc} />
          ))}
        </div>
      </div>
    </section>
  );
}
