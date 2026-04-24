import { Ban, Lock, Skull, ShieldCheck } from "lucide-react";

const ICON_MAP: Record<string, typeof Ban> = {
  terminat: Skull,
  block: Ban,
  isolat: Lock,
  contain: Lock,
  quarantin: Lock,
};

const pickIcon = (text: string) => {
  const lower = text.toLowerCase();
  for (const key of Object.keys(ICON_MAP)) {
    if (lower.includes(key)) return ICON_MAP[key];
  }
  return ShieldCheck;
};

export const ResponsePanel = ({ actions }: { actions: string[] }) => {
  return (
    <div className="card-flat p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-foreground">Response actions</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-danger-soft text-danger">
          Auto-mitigated
        </span>
      </div>

      <ul className="space-y-2">
        {actions.map((action, i) => {
          const Icon = pickIcon(action);
          return (
            <li
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/40 border border-border"
            >
              <span className="h-8 w-8 rounded-lg bg-danger-soft flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-danger" strokeWidth={2.25} />
              </span>
              <span className="text-sm font-medium text-foreground">{action}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
