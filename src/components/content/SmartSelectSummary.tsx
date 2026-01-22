"use client";

import React from "react";
import {
  FileText,
  BookOpen,
  ShoppingBag,
  Globe,
  CheckCircle2,
  Zap,
  Filter,
} from "lucide-react";

interface CrawledPage {
  url: string;
  type: string;
  title?: string;
  selected?: boolean;
}

interface PageGroup {
  type: string;
  count: number;
  selected: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  recommended: boolean;
}

interface SmartSelectSummaryProps {
  pages: CrawledPage[];
  onSelectType: (type: string, select: boolean) => void;
  onSelectRecommended: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export default function SmartSelectSummary({
  pages,
  onSelectType,
  onSelectRecommended,
  onSelectAll,
  onDeselectAll,
}: SmartSelectSummaryProps) {
  const getPageGroups = (): PageGroup[] => {
    const groups: Record<string, { count: number; selected: number }> = {};
    
    pages.forEach((page) => {
      if (!groups[page.type]) {
        groups[page.type] = { count: 0, selected: 0 };
      }
      groups[page.type].count++;
      if (page.selected) {
        groups[page.type].selected++;
      }
    });

    const typeConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; recommended: boolean }> = {
      service: { icon: FileText, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30", recommended: true },
      blog: { icon: BookOpen, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30", recommended: true },
      product: { icon: ShoppingBag, color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30", recommended: false },
      other: { icon: Globe, color: "text-slate-600", bgColor: "bg-slate-100 dark:bg-slate-700", recommended: false },
    };

    return Object.entries(groups).map(([type, data]) => ({
      type,
      count: data.count,
      selected: data.selected,
      icon: typeConfig[type]?.icon || Globe,
      color: typeConfig[type]?.color || "text-slate-600",
      bgColor: typeConfig[type]?.bgColor || "bg-slate-100 dark:bg-slate-700",
      recommended: typeConfig[type]?.recommended || false,
    }));
  };

  const pageGroups = getPageGroups();
  const totalPages = pages.length;
  const selectedCount = pages.filter((p) => p.selected).length;
  const recommendedCount = pageGroups.filter((g) => g.recommended).reduce((sum, g) => sum + g.count, 0);
  const servicePages = pageGroups.find((g) => g.type === "service");
  const blogPages = pageGroups.find((g) => g.type === "blog");

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Smart Page Selection
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              We found <span className="font-bold text-blue-600">{totalPages} pages</span>. 
              We recommend analyzing the{" "}
              <span className="font-bold text-blue-600">{servicePages?.count || 0} Service Pages</span> and{" "}
              <span className="font-bold text-green-600">{blogPages?.count || 0} Blog Posts</span>.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              {selectedCount} of {totalPages} selected
            </span>
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={onSelectRecommended}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Zap className="w-4 h-4" />
            Select Recommended ({recommendedCount})
          </button>
          <button
            onClick={() => onSelectType("service", true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            Select All Service Pages
          </button>
          <button
            onClick={() => onSelectType("blog", true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors text-sm font-medium"
          >
            <BookOpen className="w-4 h-4" />
            Select All Blog Posts
          </button>
          <button
            onClick={onDeselectAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            Deselect All
          </button>
        </div>

        {/* Page Type Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pageGroups.map((group) => {
            const Icon = group.icon;
            const isFullySelected = group.selected === group.count;
            const isPartiallySelected = group.selected > 0 && group.selected < group.count;

            return (
              <button
                key={group.type}
                onClick={() => onSelectType(group.type, !isFullySelected)}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isFullySelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : isPartiallySelected
                    ? "border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                {group.recommended && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
                    Recommended
                  </span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${group.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${group.color}`} />
                  </div>
                  {isFullySelected && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto" />
                  )}
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                  {group.type}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {group.selected}/{group.count} selected
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">Pro Tip</p>
          <p className="text-amber-700 dark:text-amber-300">
            Service pages and blogs typically contain the most valuable content for SEO analysis. 
            Legal pages, contact forms, and utility pages can usually be skipped.
          </p>
        </div>
      </div>
    </div>
  );
}
