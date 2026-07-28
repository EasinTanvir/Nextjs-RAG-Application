import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// sources: [{ source, page, distance? }]
// threshold: number used for the filter, shown when nothing matched
export default function RetrievalReadout({ sources = [], threshold = 0.5 }) {
  const [expanded, setExpanded] = useState(false);

  if (!sources.length) {
    return (
      <div className="mt-1 flex items-center gap-2 rounded-lg border border-[#262D37] bg-[#0D1015] px-3 py-2">
        <div className="h-1 flex-1 rounded-full bg-[#1B2129]" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B6472]">
          no chunk above {threshold.toFixed(2)}
        </span>
      </div>
    );
  }

  // relevance = 1 - distance, clamped, so higher bar = closer match
  const withRelevance = sources.map((s) => ({
    ...s,
    relevance:
      typeof s.distance === "number"
        ? Math.max(0, Math.min(1, 1 - s.distance))
        : null,
  }));

  return (
    <div className="mt-1 rounded-lg border border-[#262D37] bg-[#0D1015]">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-3 py-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B6472]">
          retrieved
        </span>

        <div className="flex flex-1 items-end gap-[3px]">
          {withRelevance.map((s, i) => (
            <div
              key={i}
              className="w-2 rounded-sm bg-[#E8A33D] transition-all"
              style={{
                height: `${6 + (s.relevance ?? 0.4) * 14}px`,
                opacity: 0.5 + (s.relevance ?? 0.4) * 0.5,
              }}
              title={s.source}
            />
          ))}
        </div>

        <span className="font-mono text-[10px] text-[#5B6472]">
          {sources.length} chunk{sources.length > 1 ? "s" : ""}
        </span>

        {expanded ? (
          <ChevronUp className="h-3 w-3 text-[#5B6472]" />
        ) : (
          <ChevronDown className="h-3 w-3 text-[#5B6472]" />
        )}
      </button>

      {expanded && (
        <div className="space-y-1.5 border-t border-[#262D37] px-3 py-2">
          {withRelevance.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 font-mono text-[11px]"
            >
              <span className="truncate text-[#8992A3]">
                {s.source ?? "unknown"}
                {s.page ? ` · p.${s.page}` : ""}
              </span>
              {s.relevance !== null && (
                <span className="shrink-0 text-[#E8A33D]">
                  {(s.relevance * 100).toFixed(0)}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
