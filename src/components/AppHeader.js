export default function AppHeader() {
  return (
    <header className="border-b border-[#262D37] bg-[#0D1015]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#262D37] bg-[#151920]">
            <span className="font-mono text-xs font-semibold text-[#5B8DEF]">
              R/
            </span>
          </div>

          <div className="leading-tight">
            <p className="font-mono text-sm font-medium tracking-tight text-[#E7EAEE]">
              retrieval<span className="text-[#5B8DEF]">.console</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#5B6472]">
              document-grounded Q&amp;A
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
