import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, Play, X, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadBoxProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const UploadBox = ({ file, onFileSelect, onAnalyze, isAnalyzing }: UploadBoxProps) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFileSelect(f);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFileSelect(f);
  };

  return (
    <div className="card-soft p-6 md:p-10 animate-fade-in">
      <div className="text-center mb-6 max-w-2xl mx-auto">
        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Analyze a file
        </h3>
        <p className="mt-2 text-muted-foreground">
          Upload a file to analyze ransomware behavior in a secure sandbox environment.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={cn(
          "relative rounded-xl border-2 border-dashed bg-card transition-colors p-8 md:p-12 text-center",
          !file && "cursor-pointer hover:border-primary hover:bg-primary-tint/40",
          dragOver ? "border-primary bg-primary-tint/60" : "border-border",
          file && "border-primary/50 bg-primary-tint/30"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          aria-label="Upload suspicious file"
        />

        {file ? (
          <div className="flex items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB · ready to analyze
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              className="p-2 rounded-md text-muted-foreground hover:text-danger hover:bg-danger-soft transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary-tint flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-base font-medium text-foreground">
              Drag & drop your file here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse — executables, scripts, archives, documents
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors"
        >
          <Upload className="h-4 w-4" />
          Choose File
        </button>
        <button
          onClick={onAnalyze}
          disabled={!file || isAnalyzing}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-colors shadow-card",
            "hover:bg-primary-soft",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
          )}
        >
          <Play className="h-4 w-4 fill-current" />
          {isAnalyzing ? "Analyzing…" : "Analyze"}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        <span>File runs in a secure isolated sandbox — never on your device.</span>
      </div>
    </div>
  );
};
