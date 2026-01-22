"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  FileSearch,
  Brain,
  Target,
  CheckCircle2,
  Loader2,
  Lightbulb,
} from "lucide-react";

interface Step {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const crawlSteps: Step[] = [
  { id: "discover", label: "Discovering Sitemap", description: "Finding all pages on your website", icon: Globe },
  { id: "extract", label: "Extracting Content", description: "Reading page content and structure", icon: FileSearch },
  { id: "categorize", label: "Categorizing Pages", description: "Identifying page types (blog, service, etc.)", icon: Target },
];

const analyzeSteps: Step[] = [
  { id: "extract", label: "Extracting Content", description: "Processing selected pages", icon: FileSearch },
  { id: "analyze", label: "Analyzing Tone", description: "Understanding your brand voice", icon: Brain },
  { id: "gaps", label: "Identifying Gaps", description: "Finding content opportunities", icon: Target },
  { id: "suggest", label: "Generating Suggestions", description: "Creating AI-powered recommendations", icon: Lightbulb },
];

const seoTips = [
  "Long-form content (2000+ words) typically ranks higher in search results.",
  "Internal linking helps distribute page authority across your site.",
  "Featured snippets capture about 8% of all clicks for a search query.",
  "Mobile-first indexing means Google primarily uses mobile content for ranking.",
  "Page speed is a direct ranking factor for both desktop and mobile searches.",
  "Content freshness signals can boost rankings for time-sensitive queries.",
  "Schema markup helps search engines understand your content better.",
  "User engagement metrics like dwell time influence your rankings.",
  "Keyword clustering helps you target multiple related terms with one piece of content.",
  "Content gaps represent untapped opportunities to capture new traffic.",
];

interface ProgressStepperProps {
  mode: "crawl" | "analyze";
  progress?: number;
  currentStep?: number;
}

export default function ProgressStepper({ mode, progress = 0, currentStep = 0 }: ProgressStepperProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const steps = mode === "crawl" ? crawlSteps : analyzeSteps;

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % seoTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="w-full p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {mode === "crawl" ? "Crawling Website" : "Analyzing Content"}
          </span>
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(index);

          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                status === "active"
                  ? "bg-white dark:bg-slate-800 shadow-sm border border-blue-200 dark:border-blue-700"
                  : status === "completed"
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "opacity-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  status === "completed"
                    ? "bg-green-100 dark:bg-green-900/50"
                    : status === "active"
                    ? "bg-blue-100 dark:bg-blue-900/50"
                    : "bg-slate-100 dark:bg-slate-700"
                }`}
              >
                {status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : status === "active" ? (
                  <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    status === "completed"
                      ? "text-green-900 dark:text-green-100"
                      : status === "active"
                      ? "text-blue-900 dark:text-blue-100"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`text-sm ${
                    status === "completed"
                      ? "text-green-700 dark:text-green-300"
                      : status === "active"
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* SEO Tips */}
      <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
              Did you know?
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 transition-opacity duration-300">
              {seoTips[tipIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
