import { BookMarked } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="border-b border-[#262D37] bg-[#0D1015]">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-[#E7EAEE]">
            RAG Lab
          </h1>
        </div>
      </div>
    </header>
  );
}
