import { AlertTriangle } from "lucide-react";

export const ReasonPanel = ({ reasons }: { reasons: string[] }) => {
  return (
    <div className="card-flat p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h3 className="font-display text-lg font-bold text-foreground">Detection reasons</h3>
      </div>

      <ul className="space-y-2">
        {reasons.map((r, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm py-2 px-3 rounded-lg bg-muted/40 border border-border"
          >
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-warning flex-shrink-0" />
            <span className="text-foreground">{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
