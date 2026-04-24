export type AnalysisStatus = "SAFE" | "SUSPICIOUS" | "MALICIOUS";

export interface AnalysisResult {
  status: AnalysisStatus;
  risk_score: number;
  process: string;
  file_changes: number;
  anomaly_score: number;
  activity_level: "LOW" | "MEDIUM" | "HIGH";
  extension_changes?: string;
  process_behavior?: "Normal" | "Abnormal";
  reasons: string[];
  actions: string[];
}
