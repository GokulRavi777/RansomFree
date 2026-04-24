import { ShieldCheck } from "lucide-react";

interface HeaderProps {
  active: "home" | "analyze" | "about";
  onNavigate: (id: "home" | "analyze" | "about") => void;
}

const NAV: { id: "home" | "analyze" | "about"; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "analyze", label: "Analyze File" },
  { id: "about", label: "About" },
];

export const Header = ({ active, onNavigate }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
      <div className="container flex items-center justify-between h-16">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 group"
          aria-label="RansomFree home"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-card">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
            <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent border-2 border-card" />
          </span>
          <span className="font-display font-bold text-lg text-primary tracking-tight">
            RansomFree
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                active === item.id
                  ? "text-primary bg-primary-tint"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => onNavigate("analyze")}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-semibold hover:brightness-95 transition-all shadow-card"
        >
          Get Started
        </button>
      </div>
    </header>
  );
};
