"use client";

import React from "react";
import {
  AlertTriangle,
  Lightbulb,
  Zap,
  ArrowRight,
  TrendingUp,
  Target,
  FileEdit,
  Calendar,
} from "lucide-react";

interface GapAnalysisCardProps {
  gaps: string[];
  onGenerateSolution: (gap: string) => void;
  onPlanForLater: (gap: string) => void;
}

const getPriorityLevel = (index: number): "high" | "medium" | "low" => {
  if (index < 2) return "high";
  if (index < 4) return "medium";
  return "low";
};

const getPriorityConfig = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return {
        label: "High Priority",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        borderColor: "border-red-200 dark:border-red-800",
        textColor: "text-red-700 dark:text-red-300",
        badgeBg: "bg-red-100 dark:bg-red-900/50",
        badgeText: "text-red-600 dark:text-red-400",
      };
    case "medium":
      return {
        label: "Medium Priority",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        borderColor: "border-amber-200 dark:border-amber-800",
        textColor: "text-amber-700 dark:text-amber-300",
        badgeBg: "bg-amber-100 dark:bg-amber-900/50",
        badgeText: "text-amber-600 dark:text-amber-400",
      };
    case "low":
      return {
        label: "Low Priority",
        bgColor: "bg-slate-50 dark:bg-slate-800",
        borderColor: "border-slate-200 dark:border-slate-700",
        textColor: "text-slate-700 dark:text-slate-300",
        badgeBg: "bg-slate-100 dark:bg-slate-700",
        badgeText: "text-slate-600 dark:text-slate-400",
      };
  }
};

export default function GapAnalysisCard({
  gaps,
  onGenerateSolution,
  onPlanForLater,
}: GapAnalysisCardProps) {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto mb-3">
          <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
          No Content Gaps Found
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          Your content strategy looks comprehensive. Keep up the great work!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Content Gaps ({gaps.length})
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <TrendingUp className="w-4 h-4" />
          <span>Opportunities to rank higher</span>
        </div>
      </div>

      {/* 2x2 Priority Matrix (for first 4 gaps) */}
      {gaps.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {gaps.slice(0, 4).map((gap, index) => {
            const priority = getPriorityLevel(index);
            const config = getPriorityConfig(priority);

            return (
              <div
                key={index}
                className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.badgeBg} ${config.badgeText}`}
                  >
                    {config.label}
                  </span>
                  <div className="flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                  </div>
                </div>

                <p className={`text-sm font-medium ${config.textColor} mb-4 line-clamp-2`}>
                  {gap}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onGenerateSolution(gap)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
                  >
                    <FileEdit className="w-4 h-4" />
                    Draft Article
                  </button>
                  <button
                    onClick={() => onPlanForLater(gap)}
                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    title="Add to content calendar"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Additional gaps as a list */}
      {gaps.length > 4 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Additional Opportunities ({gaps.length - 4})
          </p>
          <div className="space-y-2">
            {gaps.slice(4).map((gap, index) => (
              <div
                key={index + 4}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 group"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400 flex-1 mr-4">
                  {gap}
                </p>
                <button
                  onClick={() => onGenerateSolution(gap)}
                  className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                >
                  <FileEdit className="w-3 h-3" />
                  Draft Article
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
