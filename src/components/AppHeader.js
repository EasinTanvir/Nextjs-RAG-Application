import { FileText, Settings } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">PaperLens</p>
            <p className="text-sm text-slate-500">Document workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <Settings className="h-5 w-5" />
          </button>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <span className="text-sm font-semibold">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
