import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Scanning file",
  "Running sandbox",
  "Detecting behavior",
  "Evaluating risk",
];

export const AnalysisLoader = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="card-flat p-8 md:p-12 animate-fade-in text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-primary-tint flex items-center justify-center mb-5">
        <Loader2 className="h-7 w-7 text-primary animate-spin" />
      </div>
      <h3 className="font-display text-2xl font-bold text-foreground">Analyzing file…</h3>
      <p className="mt-2 text-muted-foreground">
        Awaiting response from the sandbox engine. This usually takes a few seconds.
      </p>

      <ol className="mt-8 max-w-sm mx-auto space-y-3 text-left">
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <li
              key={step}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-colors",
                done && "border-safe/30 bg-safe-soft",
                active && "border-primary/40 bg-primary-tint",
                !done && !active && "border-border bg-card opacity-60"
              )}
            >
              <span
                className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold",
                  done && "bg-safe text-safe-foreground",
                  active && "bg-primary text-primary-foreground",
                  !done && !active && "bg-muted text-muted-foreground"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  done ? "text-foreground" : active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
              {active && (
                <Loader2 className="h-3.5 w-3.5 text-primary animate-spin ml-auto" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
