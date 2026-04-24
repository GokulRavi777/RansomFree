import { ShieldCheck, ShieldAlert, ShieldX, Cpu, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnalysisStatus } from "@/types/analysis";

interface ResultCardProps {
  fileName: string;
  status: AnalysisStatus;
  process: string;
}

const STATUS_CONFIG = {
  SAFE: {
    label: "SAFE",
    icon: ShieldCheck,
    text: "text-safe",
    bg: "bg-safe-soft",
    border: "border-safe/30",
    desc: "No malicious behavior detected.",
  },
  SUSPICIOUS: {
    label: "SUSPICIOUS",
    icon: ShieldAlert,
    text: "text-warning",
    bg: "bg-warning-soft",
    border: "border-warning/30",
    desc: "Anomalous behavior — review recommended.",
  },
  MALICIOUS: {
    label: "MALICIOUS",
    icon: ShieldX,
    text: "text-danger",
    bg: "bg-danger-soft",
    border: "border-danger/30",
    desc: "Ransomware behavior confirmed.",
  },
};

export const ResultCard = ({ fileName, status, process }: ResultCardProps) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  return (
    <div className={cn("card-flat p-6 animate-scale-in border", cfg.border)}>
      <div className="flex items-start gap-5">
        <div className={cn("h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0", cfg.bg)}>
          <Icon className={cn("h-7 w-7", cfg.text)} strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Detection Result
          </p>
          <p className={cn("font-display text-3xl md:text-4xl font-extrabold mt-1", cfg.text)}>
            {cfg.label}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{cfg.desc}</p>

          <div className="mt-4 grid sm:grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/60 border border-border min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground">File:</span>
              <span className="text-sm font-medium text-foreground truncate">{fileName}</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/60 border border-border min-w-0">
              <Cpu className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground">Process:</span>
              <span className="text-sm font-mono font-semibold text-primary truncate">{process}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
