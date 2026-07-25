import { UploadCloud } from "lucide-react";

export default function UploadPanel() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-base font-semibold text-slate-900">Upload PDF</p>
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
        <p className="mt-6 text-sm text-slate-500">PDF · Max 5 MB</p>
      </div>
    </section>
  );
}
