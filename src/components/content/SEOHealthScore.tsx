"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface SEOHealthScoreProps {
  score?: number;
  totalPages?: number;
  avgWordCount?: number;
  contentGapsCount?: number;
  keywordsCount?: number;
}

export default function SEOHealthScore({
  score,
  totalPages = 0,
  avgWordCount = 0,
  contentGapsCount = 0,
  keywordsCount = 0,
}: SEOHealthScoreProps) {
  const calculatedScore = score ?? calculateScore(avgWordCount, contentGapsCount, keywordsCount, totalPages);

  function calculateScore(
    avgWords: number,
    gaps: number,
    keywords: number,
    pages: number
  ): number {
    let baseScore = 50;
    
    if (avgWords >= 1500) baseScore += 20;
    else if (avgWords >= 800) baseScore += 10;
    else if (avgWords < 300) baseScore -= 10;
    
    if (gaps === 0) baseScore += 15;
    else if (gaps <= 3) baseScore += 5;
    else if (gaps > 5) baseScore -= 10;
    
    if (keywords >= 10) baseScore += 15;
    else if (keywords >= 5) baseScore += 8;
    
    if (pages >= 10) baseScore += 5;
    
    return Math.max(0, Math.min(100, baseScore));
  }

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green-600 dark:text-green-400";
    if (s >= 60) return "text-blue-600 dark:text-blue-400";
    if (s >= 40) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreGradient = (s: number) => {
    if (s >= 80) return "from-green-500 to-emerald-500";
    if (s >= 60) return "from-blue-500 to-cyan-500";
    if (s >= 40) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Needs Work";
    return "Poor";
  };

  const getScoreIcon = (s: number) => {
    if (s >= 80) return CheckCircle2;
    if (s >= 60) return TrendingUp;
    if (s >= 40) return AlertTriangle;
    return XCircle;
  };

  const ScoreIcon = getScoreIcon(calculatedScore);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (calculatedScore / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          SEO Health Score
        </h3>
        <div className={`flex items-center gap-1 ${getScoreColor(calculatedScore)}`}>
          <ScoreIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{getScoreLabel(calculatedScore)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        {/* Speedometer-style Score Display */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-200 dark:text-slate-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={`bg-gradient-to-r ${getScoreGradient(calculatedScore)}`}
              style={{
                stroke: `url(#gradient-${calculatedScore >= 60 ? 'good' : 'bad'})`,
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                transition: "stroke-dashoffset 1s ease-out",
              }}
            />
            <defs>
              <linearGradient id="gradient-good" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="gradient-bad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(calculatedScore)}`}>
              {calculatedScore}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ 100</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pages Analyzed</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{totalPages}</p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Word Count</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {avgWordCount.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Content Gaps</p>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{contentGapsCount}</p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Keywords Found</p>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{keywordsCount}</p>
        </div>
      </div>
    </div>
  );
}
