import { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { UploadBox } from "@/components/UploadBox";
import { AnalysisLoader } from "@/components/AnalysisLoader";
import { ResultCard } from "@/components/ResultCard";
import { RiskMeter } from "@/components/RiskMeter";
import { BehaviorBreakdown } from "@/components/BehaviorBreakdown";
import { ReasonPanel } from "@/components/ReasonPanel";
import { ResponsePanel } from "@/components/ResponsePanel";
import { ArchitectureFlow } from "@/components/ArchitectureFlow";
import { AnalysisResult, AnalysisStatus } from "@/types/analysis";
import { AlertCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type Phase = "idle" | "analyzing" | "result" | "error";
type Section = "home" | "analyze" | "about";

const API_URL = import.meta.env.VITE_ANALYZE_ENDPOINT ?? "http://localhost:5000/analyze";

type BackendAnalysisPayload = {
  status?: string;
  prediction?: string;
  verdict?: string;
  label?: string;
  risk_score?: number;
  riskScore?: number;
  process?: string;
  process_name?: string;
  processName?: string;
  file_changes?: number;
  fileChanges?: number;
  anomaly_score?: number;
  anomalyScore?: number;
  activity_level?: string;
  activityLevel?: string;
  extension_changes?: string;
  extensionChanges?: string;
  process_behavior?: string;
  processBehavior?: string;
  reasons?: string[];
  response_reasons?: string[];
  actions?: string[];
  recommendations?: string[];
  response_actions?: string[];
  data?: BackendAnalysisPayload;
  result?: BackendAnalysisPayload;
};

const toNumber = (value: unknown, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeStatus = (value: unknown): AnalysisStatus => {
  const normalized = String(value ?? "").toUpperCase();
  if (normalized === "MALICIOUS" || normalized === "SUSPICIOUS" || normalized === "SAFE") {
    return normalized;
  }
  if (normalized.includes("MAL")) return "MALICIOUS";
  if (normalized.includes("SUS")) return "SUSPICIOUS";
  return "SAFE";
};

const normalizeActivity = (value: unknown, riskScore: number): "LOW" | "MEDIUM" | "HIGH" => {
  const normalized = String(value ?? "").toUpperCase();
  if (normalized === "LOW" || normalized === "MEDIUM" || normalized === "HIGH") {
    return normalized;
  }
  if (riskScore >= 80) return "HIGH";
  if (riskScore >= 45) return "MEDIUM";
  return "LOW";
};

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
};

const normalizeAnalysisResult = (raw: unknown): AnalysisResult => {
  const payload = (raw ?? {}) as BackendAnalysisPayload;
  const source = payload.result ?? payload.data ?? payload;
  const riskScore = toNumber(source.risk_score ?? source.riskScore);

  const reasons = toStringArray(source.reasons ?? source.response_reasons);
  const actions = toStringArray(
    source.actions ?? source.recommendations ?? source.response_actions,
  );

  return {
    status: normalizeStatus(source.status ?? source.prediction ?? source.verdict ?? source.label),
    risk_score: riskScore,
    process: String(source.process ?? source.process_name ?? source.processName ?? "unknown"),
    file_changes: toNumber(source.file_changes ?? source.fileChanges),
    anomaly_score: toNumber(source.anomaly_score ?? source.anomalyScore),
    activity_level: normalizeActivity(source.activity_level ?? source.activityLevel, riskScore),
    extension_changes: source.extension_changes ?? source.extensionChanges,
    process_behavior:
      String(source.process_behavior ?? source.processBehavior).toLowerCase() === "normal"
        ? "Normal"
        : String(source.process_behavior ?? source.processBehavior).toLowerCase() === "abnormal"
          ? "Abnormal"
          : undefined,
    reasons,
    actions,
  };
};

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Section>("home");
  const analyzeRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: Section) => {
    setActive(id);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (id === "analyze") {
      analyzeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (id === "about") {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    setPhase("analyzing");
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(API_URL, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const rawData = await res.json();
      const data = normalizeAnalysisResult(rawData);
      setResult(data);
      setPhase("result");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.includes("Failed to fetch")
            ? "Could not reach the analysis server at " + API_URL
            : err.message
          : "Unknown error";
      setError(message);
      setPhase("error");
      toast.error("Analysis failed", { description: message });
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setPhase("idle");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header active={active} onNavigate={scrollTo} />

      <main className="flex-1">
        <Hero onCta={() => scrollTo("analyze")} />

        <section ref={analyzeRef} className="container pb-12">
          <div className="max-w-3xl mx-auto">
            {phase === "idle" && (
              <UploadBox
                file={file}
                onFileSelect={setFile}
                onAnalyze={startAnalysis}
                isAnalyzing={false}
              />
            )}

            {phase === "analyzing" && <AnalysisLoader />}

            {phase === "error" && (
              <div className="card-flat p-8 text-center animate-fade-in border border-danger/30">
                <div className="mx-auto h-12 w-12 rounded-full bg-danger-soft flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-danger" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Analysis failed
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  {error}. Make sure the backend is running, then try again.
                </p>
                <button
                  onClick={reset}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-soft transition-colors"
                >
                  <RotateCcw className="h-4 w-4" /> Try again
                </button>
              </div>
            )}
          </div>

          {phase === "result" && result && file && (
            <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
              <div className="grid lg:grid-cols-5 gap-5">
                <div className="lg:col-span-3">
                  <ResultCard
                    fileName={file.name}
                    status={result.status}
                    process={result.process}
                  />
                </div>
                <div className="lg:col-span-2">
                  <RiskMeter score={result.risk_score} />
                </div>
              </div>

              <BehaviorBreakdown
                filesModified={result.file_changes}
                activityLevel={result.activity_level}
                extensionChanges={result.extension_changes ?? "none"}
                anomalyScore={result.anomaly_score}
                processBehavior={
                  result.process_behavior ?? (result.status === "SAFE" ? "Normal" : "Abnormal")
                }
              />

              <div className="grid lg:grid-cols-2 gap-5">
                <ReasonPanel reasons={result.reasons} />
                <ResponsePanel actions={result.actions} />
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Analyze another file
                </button>
              </div>
            </div>
          )}
        </section>

        <ArchitectureFlow />
      </main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-primary">RansomFree</span> · Behavioral Detection
            Platform
          </p>
          <p className="text-xs">Powered by sandbox AI · v3.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
