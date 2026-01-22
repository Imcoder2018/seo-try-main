"use client";

import { useState } from "react";
import { FileText, Volume2, Download, Loader2, Play, Pause, Sparkles } from "lucide-react";

interface ReportActionsProps {
  auditData: Record<string, unknown>;
}

export function ReportActions({ auditData }: ReportActionsProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const response = await fetch("/api/report/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditData }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `seo-audit-${(auditData as { domain?: string }).domain || "report"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleGenerateVoice = async () => {
    setVoiceLoading(true);
    try {
      const response = await fetch("/api/report/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditData, voice: "nova" }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate voice summary");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      // Create and play audio
      const audio = new Audio(url);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Voice generation error:", error);
      alert("Failed to generate voice summary. Please ensure OpenAI API key is configured.");
    } finally {
      setVoiceLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `seo-audit-summary-${(auditData as { domain?: string }).domain || "report"}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-card border rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        Export & Share
      </h3>
      
      <div className="flex flex-wrap gap-4">
        {/* PDF Download */}
        <button
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {pdfLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {pdfLoading ? "Generating..." : "Download PDF Report"}
        </button>

        {/* Voice Summary */}
        {!audioUrl ? (
          <button
            onClick={handleGenerateVoice}
            disabled={voiceLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {voiceLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
            {voiceLoading ? "Generating..." : "AI Voice Summary"}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={downloadAudio}
              className="inline-flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Download Audio"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        Download a branded PDF report or listen to an AI-generated voice summary of your audit results.
      </p>
    </div>
  );
}
