import { CheckCircle2, AlertTriangle, Clock3, FileText } from "lucide-react";

const statusMeta = {
  Ready: {
    label: "Ready",
    classes: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  Processing: {
    label: "Processing",
    classes: "bg-amber-100 text-amber-700",
    icon: Clock3,
  },
  Failed: {
    label: "Failed",
    classes: "bg-rose-100 text-rose-700",
    icon: AlertTriangle,
  },
};

export default function DocumentCard({ title, size, date, status }) {
  const StatusIcon = statusMeta[status]?.icon || FileText;
  const statusInfo = statusMeta[status] || statusMeta.Ready;

  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-600">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-xs text-slate-500">
            {size} • {date}
          </p>
        </div>
      </div>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.classes}`}
      >
        <StatusIcon className="h-3.5 w-3.5" />
        {statusInfo.label}
      </span>
    </div>
  );
}
