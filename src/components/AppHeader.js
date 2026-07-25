import { FileText, Settings } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5">
        <div className="flex items-center gap-3">
          <p className="text-lg font-extrabold text-slate-900">PaperLens</p>
        </div>
      </div>
    </header>
  );
}
