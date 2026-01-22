"use client";

import React, { useState } from "react";
import {
  Zap,
  Target,
  TrendingUp,
  Clock,
  ArrowRight,
  Lightbulb,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ContentGap {
  topic: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  keywords?: string[];
  searchVolume?: number;
}

interface PriorityMatrixProps {
  gaps: string[] | ContentGap[];
  onGenerateSolution: (gap: string) => void;
  onPlanForLater: (gap: string) => void;
}

const categorizeGap = (gap: string | ContentGap, index: number): ContentGap => {
  if (typeof gap === "object") return gap;
  
  // Simple heuristic: first gaps are high impact, lower effort
  const impactLevels: ("high" | "medium" | "low")[] = ["high", "high", "medium", "medium", "low"];
  const effortLevels: ("high" | "medium" | "low")[] = ["low", "medium", "low", "high", "medium"];
  
  return {
    topic: gap,
    impact: impactLevels[index % 5] || "medium",
    effort: effortLevels[index % 5] || "medium",
  };
};

const getQuadrant = (gap: ContentGap): "quick-wins" | "big-bets" | "fill-ins" | "time-sinks" => {
  if (gap.impact === "high" && gap.effort === "low") return "quick-wins";
  if (gap.impact === "high" && gap.effort !== "low") return "big-bets";
  if (gap.impact !== "high" && gap.effort === "low") return "fill-ins";
  return "time-sinks";
};

const quadrantConfig = {
  "quick-wins": {
    title: "Quick Wins",
    subtitle: "High Impact, Low Effort",
    icon: Zap,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    headerBg: "bg-green-100 dark:bg-green-900/40",
    textColor: "text-green-700 dark:text-green-300",
    iconColor: "text-green-600 dark:text-green-400",
  },
  "big-bets": {
    title: "Big Bets",
    subtitle: "High Impact, High Effort",
    icon: Target,
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    headerBg: "bg-blue-100 dark:bg-blue-900/40",
    textColor: "text-blue-700 dark:text-blue-300",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  "fill-ins": {
    title: "Fill-Ins",
    subtitle: "Low Impact, Low Effort",
    icon: Clock,
    bgColor: "bg-slate-50 dark:bg-slate-800/50",
    borderColor: "border-slate-200 dark:border-slate-700",
    headerBg: "bg-slate-100 dark:bg-slate-700/50",
    textColor: "text-slate-700 dark:text-slate-300",
    iconColor: "text-slate-500 dark:text-slate-400",
  },
  "time-sinks": {
    title: "Consider Later",
    subtitle: "Low Impact, High Effort",
    icon: TrendingUp,
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    headerBg: "bg-amber-100 dark:bg-amber-900/40",
    textColor: "text-amber-700 dark:text-amber-300",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
};

export default function PriorityMatrix({
  gaps,
  onGenerateSolution,
  onPlanForLater,
}: PriorityMatrixProps) {
  const [expandedQuadrant, setExpandedQuadrant] = useState<string | null>("quick-wins");

  const categorizedGaps = gaps.map((gap, index) => categorizeGap(gap, index));
  
  const groupedGaps = {
    "quick-wins": categorizedGaps.filter((g) => getQuadrant(g) === "quick-wins"),
    "big-bets": categorizedGaps.filter((g) => getQuadrant(g) === "big-bets"),
    "fill-ins": categorizedGaps.filter((g) => getQuadrant(g) === "fill-ins"),
    "time-sinks": categorizedGaps.filter((g) => getQuadrant(g) === "time-sinks"),
  };

  if (gaps.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
          No Content Gaps Found
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          Your content strategy is comprehensive. Great work!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Priority Matrix
          </h3>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {gaps.length} opportunities identified
        </span>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(["quick-wins", "big-bets", "fill-ins", "time-sinks"] as const).map((quadrantKey) => {
          const config = quadrantConfig[quadrantKey];
          const Icon = config.icon;
          const quadrantGaps = groupedGaps[quadrantKey];
          const isExpanded = expandedQuadrant === quadrantKey;

          return (
            <div
              key={quadrantKey}
              className={`${config.bgColor} ${config.borderColor} border rounded-xl overflow-hidden transition-all duration-200`}
            >
              {/* Quadrant Header */}
              <button
                onClick={() => setExpandedQuadrant(isExpanded ? null : quadrantKey)}
                className={`w-full ${config.headerBg} px-4 py-3 flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  <div className="text-left">
                    <h4 className={`font-semibold ${config.textColor}`}>{config.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{config.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${config.textColor}`}>
                    {quadrantGaps.length}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Quadrant Content */}
              {isExpanded && quadrantGaps.length > 0 && (
                <div className="p-3 space-y-2">
                  {quadrantGaps.map((gap, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 group"
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3 line-clamp-2">
                        {gap.topic}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onGenerateSolution(gap.topic)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          Draft Solution
                        </button>
                        <button
                          onClick={() => onPlanForLater(gap.topic)}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Plan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isExpanded && quadrantGaps.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No items in this quadrant
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 Start with Quick Wins for immediate impact
        </p>
        <button
          onClick={() => {
            const firstQuickWin = groupedGaps["quick-wins"][0];
            if (firstQuickWin) onGenerateSolution(firstQuickWin.topic);
          }}
          disabled={groupedGaps["quick-wins"].length === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          <Zap className="w-4 h-4" />
          Start First Quick Win
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
