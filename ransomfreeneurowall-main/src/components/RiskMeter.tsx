import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RiskMeterProps {
  score: number;
}

const interpret = (score: number) => {
  if (score < 30) return { label: "Normal", color: "text-safe", bar: "bg-safe" };
  if (score < 70) return { label: "Suspicious", color: "text-warning", bar: "bg-warning" };
  return { label: "High Risk", color: "text-danger", bar: "bg-danger" };
};

export const RiskMeter = ({ score }: RiskMeterProps) => {
  const [animated, setAnimated] = useState(0);
  const i = interpret(score);

  useEffect(() => {
    const id = setTimeout(() => setAnimated(score), 150);
    return () => clearTimeout(id);
  }, [score]);

  return (
    <div className="card-flat p-6 animate-scale-in h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Risk Score
        </h3>
        <span className={cn("font-display text-3xl font-extrabold tabular-nums", i.color)}>
          {Math.round(animated)}
          <span className="text-base text-muted-foreground font-medium ml-1">/100</span>
        </span>
      </div>

      <div className="relative h-2.5 rounded-full overflow-hidden bg-muted">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out", i.bar)}
          style={{ width: `${animated}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 text-[11px] font-medium">
        <span className="text-safe">0–30 Normal</span>
        <span className="text-warning text-center">30–70 Suspicious</span>
        <span className="text-danger text-right">70–100 High</span>
      </div>

      <div className="mt-auto pt-5 flex items-center justify-between border-t border-border mt-5">
        <span className="text-sm text-muted-foreground">Interpretation</span>
        <span className={cn("text-sm font-bold", i.color)}>{i.label}</span>
      </div>
    </div>
  );
};
