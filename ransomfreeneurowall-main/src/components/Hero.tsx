import { ArrowRight, Lock } from "lucide-react";

interface HeroProps {
  onCta: () => void;
}

export const Hero = ({ onCta }: HeroProps) => {
  return (
    <section className="container pt-12 pb-10 md:pt-16 md:pb-14">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left: geometric blue panel */}
        <div className="relative order-2 lg:order-1">
          <div className="hero-panel clip-hex aspect-[5/4] w-full rounded-2xl p-8 md:p-12 flex flex-col justify-end text-primary-foreground overflow-hidden relative">
            {/* decorative hex outlines */}
            <div className="absolute top-8 right-8 h-32 w-32 border-2 border-primary-foreground/15 clip-hex" />
            <div className="absolute top-20 right-20 h-20 w-20 border-2 border-accent/40 clip-hex" />
            <div className="absolute bottom-1/3 left-10 h-3 w-3 rounded-full bg-accent" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-xs font-medium mb-4">
                <Lock className="h-3 w-3" />
                Secure Sandbox · Behavioral AI
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
                Ransom<span className="text-accent">Free</span>
              </h1>
              <p className="mt-2 text-lg md:text-xl text-primary-foreground/80 font-medium">
                Ransomware Detection Platform
              </p>
            </div>
          </div>
        </div>

        {/* Right: copy */}
        <div className="order-1 lg:order-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-soft mb-4">
            Stop ransomware before it spreads
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
            Detect malicious behavior in <span className="text-primary">isolated sandboxes</span>.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-lg">
            Upload any suspicious file. RansomFree executes it safely, monitors application
            behavior, and reports real-time risk using behavioral AI.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={onCta}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-soft transition-colors shadow-card"
            >
              Analyze a file
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
            >
              How it works
            </a>
          </div>

          <dl className="mt-9 grid grid-cols-3 gap-4 max-w-md">
            {[
              { k: "98%", v: "Detection rate" },
              { k: "<3s", v: "Avg response" },
              { k: "0", v: "Host impact" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl font-bold text-primary">{s.k}</dt>
                <dd className="text-xs text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
