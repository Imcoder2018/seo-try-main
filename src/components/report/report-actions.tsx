"use client";

import { useState } from "react";
import { Volume2, Download, Loader2, Play, Pause, Sparkles, Eye } from "lucide-react";
import { PDFPreviewModal } from "./pdf-preview-modal";

interface ReportActionsProps {
  auditData: Record<string, unknown>;
}

export function ReportActions({ auditData }: ReportActionsProps) {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden mb-8 shadow-lg">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5"></div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Export & Share</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Download or share your audit results</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {/* PDF Report - Opens Preview Modal */}
          <button
            onClick={() => setShowPdfModal(true)}
            className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 font-medium"
          >
            <Eye className="h-5 w-5" />
            Generate PDF Report
          </button>

          {/* Voice Summary */}
          {!audioUrl ? (
            <button
              onClick={handleGenerateVoice}
              disabled={voiceLoading}
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 font-medium"
            >
              {voiceLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
              {voiceLoading ? "Generating..." : "AI Voice Summary"}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayPause}
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg font-medium"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
                {isPlaying ? "Pause" : "Play Summary"}
              </button>
              <button
                onClick={downloadAudio}
                className="inline-flex items-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors shadow-lg"
                title="Download Audio"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-5 flex items-center gap-2">
          <span className="text-lg">📄</span>
          Download a branded PDF report or listen to an AI-generated voice summary of your audit results.
        </p>
      </div>

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        auditData={auditData}
      />
    </div>
  );
}
