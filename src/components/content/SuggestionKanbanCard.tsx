"use client";

import React from "react";
import {
  FileText,
  BookOpen,
  Briefcase,
  TrendingUp,
  Zap,
  Calendar,
  GripVertical,
  Tag,
} from "lucide-react";

interface AISuggestion {
  type: "Blog Post" | "Whitepaper" | "Case Study" | "Guide" | "Infographic";
  title: string;
  reason: string;
  targetKeywords: string[];
  relatedServiceUrl?: string;
  contentOutline?: string[];
  suggestedTone?: string;
  targetLength?: number;
}

interface SuggestionKanbanCardProps {
  suggestion: AISuggestion;
  onGenerate: (suggestion: AISuggestion) => void;
  onSchedule: (suggestion: AISuggestion) => void;
  isDraggable?: boolean;
}

const getIntentColor = (type: string) => {
  const lowercaseType = type.toLowerCase();
  if (lowercaseType.includes("blog") || lowercaseType.includes("guide")) {
    return {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
      label: "Informational",
    };
  }
  if (lowercaseType.includes("case") || lowercaseType.includes("whitepaper")) {
    return {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800",
      label: "Transactional",
    };
  }
  return {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    label: "Commercial",
  };
};

const getTypeIcon = (type: string) => {
  const lowercaseType = type.toLowerCase();
  if (lowercaseType.includes("blog")) return BookOpen;
  if (lowercaseType.includes("case")) return Briefcase;
  if (lowercaseType.includes("guide")) return FileText;
  return TrendingUp;
};

export default function SuggestionKanbanCard({
  suggestion,
  onGenerate,
  onSchedule,
  isDraggable = true,
}: SuggestionKanbanCardProps) {
  const intentConfig = getIntentColor(suggestion.type);
  const TypeIcon = getTypeIcon(suggestion.type);

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl border ${intentConfig.border} shadow-sm hover:shadow-md transition-all group`}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-start gap-3">
          {isDraggable && (
            <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mt-1">
              <GripVertical className="w-4 h-4" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${intentConfig.bg} ${intentConfig.text}`}
              >
                <TypeIcon className="w-3 h-3" />
                {suggestion.type}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${intentConfig.bg} ${intentConfig.text}`}
              >
                {intentConfig.label}
              </span>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
              {suggestion.title}
            </h4>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {suggestion.reason}
        </p>

        {/* Keywords */}
        {suggestion.targetKeywords && suggestion.targetKeywords.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <Tag className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Target Keywords
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestion.targetKeywords.slice(0, 3).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs"
                >
                  {keyword}
                </span>
              ))}
              {suggestion.targetKeywords.length > 3 && (
                <span className="px-2 py-0.5 text-slate-400 text-xs">
                  +{suggestion.targetKeywords.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
          {suggestion.targetLength && (
            <span>{suggestion.targetLength.toLocaleString()} words</span>
          )}
          {suggestion.suggestedTone && <span>{suggestion.suggestedTone}</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onGenerate(suggestion)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Generate
          </button>
          <button
            onClick={() => onSchedule(suggestion)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
