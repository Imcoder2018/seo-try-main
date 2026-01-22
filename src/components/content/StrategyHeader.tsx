"use client";

import React from "react";
import {
  RefreshCw,
  Download,
  Share2,
  History,
  Plus,
  Globe,
  Clock,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";

interface StrategyHeaderProps {
  domain: string;
  lastAnalyzed?: Date | string;
  healthScore?: number;
  onNewStrategy: () => void;
  onReAnalyze: () => void;
  onExportPDF?: () => void;
  onShare?: () => void;
  onViewHistory: () => void;
  isReAnalyzing?: boolean;
}

export default function StrategyHeader({
  domain,
  lastAnalyzed,
  healthScore,
  onNewStrategy,
  onReAnalyze,
  onExportPDF,
  onShare,
  onViewHistory,
  isReAnalyzing = false,
}: StrategyHeaderProps) {
  const formatLastAnalyzed = (date: Date | string | undefined) => {
    if (!date) return "Never";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return d.toLocaleDateString();
  };

  const getHealthScoreColor = (score: number | undefined) => {
    if (!score) return "text-slate-400";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    onShare?.();
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Section - Title & Domain */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Strategy: {domain}
              </h1>
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Last analyzed: {formatLastAnalyzed(lastAnalyzed)}</span>
                </div>
                {healthScore !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">•</span>
                    <span className={`font-medium ${getHealthScoreColor(healthScore)}`}>
                      Health: {healthScore}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* History Button */}
            <button
              onClick={onViewHistory}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>

            {/* Re-Analyze Button */}
            <button
              onClick={onReAnalyze}
              disabled={isReAnalyzing}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isReAnalyzing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{isReAnalyzing ? "Analyzing..." : "Re-Analyze"}</span>
            </button>

            {/* Export PDF Button */}
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            {/* Share Button */}
            <button
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* New Strategy Button - Primary CTA */}
            <button
              onClick={onNewStrategy}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Strategy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
