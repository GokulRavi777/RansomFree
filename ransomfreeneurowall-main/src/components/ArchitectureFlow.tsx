import { Upload, Box, Eye, Search, Ban, FileText, ChevronRight } from "lucide-react";

const STEPS = [
  { icon: Upload, label: "Upload" },
  { icon: Box, label: "Sandbox" },
  { icon: Eye, label: "Monitor" },
  { icon: Search, label: "Detect" },
  { icon: Ban, label: "Block" },
  { icon: FileText, label: "Report" },
];

export const ArchitectureFlow = () => {
  return (
    <section id="about" className="container py-14 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
          How it works
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          A six-step pipeline from upload to verdict
        </h2>
        <p className="mt-3 text-muted-foreground">
          Every file passes through the same isolated path so you get consistent, reliable results.
        </p>
      </div>

      <div className="card-flat p-6 md:p-8">
        <div className="flex items-stretch gap-3 md:gap-4 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              <div className="flex flex-col items-center gap-2 min-w-[72px]">
                <div className="h-12 w-12 rounded-xl bg-primary-tint flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary" strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold text-foreground">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
