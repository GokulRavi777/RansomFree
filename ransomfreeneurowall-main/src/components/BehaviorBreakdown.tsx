import { FileEdit, Activity, FileType2, BarChart3, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface BehaviorBreakdownProps {
  filesModified: number;
  activityLevel: "LOW" | "MEDIUM" | "HIGH";
  extensionChanges: string;
  anomalyScore: number;
  processBehavior: "Normal" | "Abnormal";
}

const tone = (kind: "safe" | "warning" | "danger") =>
  kind === "danger" ? "text-danger" : kind === "warning" ? "text-warning" : "text-safe";

export const BehaviorBreakdown = ({
  filesModified,
  activityLevel,
  extensionChanges,
  anomalyScore,
  processBehavior,
}: BehaviorBreakdownProps) => {
  const metrics = [
    {
      icon: FileEdit,
      label: "Files Modified",
      value: filesModified.toLocaleString(),
      hint: filesModified > 50 ? "Abnormal burst" : "Within normal range",
      tone: tone(filesModified > 50 ? "danger" : "safe"),
    },
    {
      icon: Activity,
      label: "Activity Level",
      value: activityLevel,
      hint: "I/O operations / sec",
      tone: tone(activityLevel === "HIGH" ? "danger" : activityLevel === "MEDIUM" ? "warning" : "safe"),
    },
    {
      icon: FileType2,
      label: "Extension Changes",
      value: extensionChanges,
      hint: extensionChanges.includes(".") ? "Ransom signature found" : "No rewrites",
      tone: tone(extensionChanges.includes(".") ? "danger" : "safe"),
    },
    {
      icon: BarChart3,
      label: "Anomaly Score",
      value: `${anomalyScore.toFixed(2)}σ`,
      hint: "Z-score vs baseline",
      tone: tone(anomalyScore > 2 ? "danger" : anomalyScore > 1 ? "warning" : "safe"),
    },
    {
      icon: Cpu,
      label: "Process Behavior",
      value: processBehavior,
      hint: processBehavior === "Abnormal" ? "Deviates from profile" : "Matches baseline",
      tone: tone(processBehavior === "Abnormal" ? "danger" : "safe"),
    },
  ];

  return (
    <div className="card-flat p-6 animate-fade-in">
      <h3 className="font-display text-lg font-bold text-foreground mb-1">
        Analysis details
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        Behavioral metrics observed during sandbox execution.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl bg-muted/40 border border-border p-4 hover:bg-muted/70 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <m.icon className={cn("h-5 w-5", m.tone)} strokeWidth={2} />
              <span className={cn("h-2 w-2 rounded-full", m.tone === "text-safe" ? "bg-safe" : m.tone === "text-warning" ? "bg-warning" : "bg-danger")} />
            </div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              {m.label}
            </p>
            <p className={cn("font-display text-xl font-bold tabular-nums mt-0.5 break-words", m.tone)}>
              {m.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{m.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
