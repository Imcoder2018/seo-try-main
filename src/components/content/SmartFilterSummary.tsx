"use client";

import React from "react";
import { CheckCircle, AlertTriangle, FileText, Hash } from "lucide-react";

interface SmartFilterSummaryProps {
  totalPages: number;
  servicePages: number;
  blogPages: number;
  highTrafficPages: number;
  onQuickSelect: (type: 'all' | 'services' | 'blogs' | 'high-traffic') => void;
}

export default function SmartFilterSummary({
  totalPages,
  servicePages,
  blogPages,
  highTrafficPages,
  onQuickSelect
}: SmartFilterSummaryProps) {
  const recommendations = [
    {
      type: 'services' as const,
      title: 'Service Pages',
      description: `${servicePages} pages found - Core business offerings`,
      icon: FileText,
      color: 'blue',
      recommended: true
    },
    {
      type: 'blogs' as const,
      title: 'Recent Blog Posts',
      description: `${blogPages} articles - Content marketing assets`,
      icon: FileText,
      color: 'green',
      recommended: true
    },
    {
      type: 'high-traffic' as const,
      title: 'High-Traffic Pages',
      description: `${highTrafficPages} pages - Already ranking well`,
      icon: Hash,
      color: 'purple',
      recommended: false
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 mb-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Smart Selection Ready
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            We found {totalPages} pages. Here's our recommendation:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div
              key={rec.type}
              className={`bg-white dark:bg-slate-800 rounded-lg p-4 border-2 ${
                rec.recommended 
                  ? 'border-green-200 dark:border-green-800' 
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-${rec.color}-50 dark:bg-${rec.color}-900/20`}>
                  <Icon className={`w-5 h-5 text-${rec.color}-600`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                    {rec.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {rec.description}
                  </p>
                  {rec.recommended && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span className="text-xs text-amber-600 font-medium">
                        Recommended
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onQuickSelect('services')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Select Service Pages ({servicePages})
        </button>
        <button
          onClick={() => onQuickSelect('blogs')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Select Blog Posts ({blogPages})
        </button>
        <button
          onClick={() => onQuickSelect('all')}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          Select All Pages
        </button>
        <button
          onClick={() => onQuickSelect('high-traffic')}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          High Traffic Only
        </button>
      </div>

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Pro tip:</strong> Analyzing service pages and blog posts together gives the best content gap insights. 
          High-traffic pages are optional but can reveal optimization opportunities.
        </p>
      </div>
    </div>
  );
}
