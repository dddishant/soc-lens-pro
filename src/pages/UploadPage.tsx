import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAnalysis } from "@/context/AnalysisContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const { setData } = useAnalysis();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validTypes = [".log", ".txt", ".gz"];

  const handleFile = useCallback((f: File) => {
    const ext = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();
    if (!validTypes.includes(ext)) {
      toast({ title: "Invalid file type", description: "Please upload .log, .txt, or .gz files", variant: "destructive" });
      return;
    }
    setFile(f);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 300);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);

      if (!res.ok) throw new Error("Upload failed");

      const json = await res.json();
      setProgress(100);
      setData({
        summary: json.summary,
        risk: json.risk,
        alerts: json.alerts,
        analytics: json.analytics,
        events_preview: json.data?.events_preview || [],
      });

      toast({ title: "Upload Complete", description: "Logs analyzed successfully" });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch {
      clearInterval(interval);
      setProgress(0);
      setUploading(false);
      toast({ title: "Upload Failed", description: "Could not connect to the analysis server. Try the demo mode instead.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Logs</h1>
          <p className="text-muted-foreground">Upload network or web access logs for AI-powered analysis</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`glass-card rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-300 ${
              dragOver ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/40"
            }`}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".log,.txt,.gz";
              input.onchange = (e) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (f) handleFile(f);
              };
              input.click();
            }}
          >
            <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-foreground text-lg font-medium mb-2">
              Drag & drop your log file here
            </p>
            <p className="text-muted-foreground text-sm">
              Supports .log, .txt, .gz files
            </p>
          </div>

          {file && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 glass-card rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-foreground font-medium">{file.name}</span>
                <span className="text-muted-foreground text-sm ml-auto">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>

              {uploading && (
                <div className="mb-3">
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      {progress < 100 ? "Analyzing..." : "Complete!"}
                    </span>
                    <span className="text-sm text-primary">{Math.round(progress)}%</span>
                  </div>
                </div>
              )}

              {progress === 100 ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Analysis complete — redirecting...</span>
                </div>
              ) : (
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(185_100%_62%/0.3)] transition-all"
                >
                  {uploading ? "Analyzing..." : "Upload & Analyze"}
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;
