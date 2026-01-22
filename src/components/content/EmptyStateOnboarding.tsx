"use client";

import React from "react";
import {
  Globe,
  Sparkles,
  ArrowRight,
  FileText,
  Search,
  Zap,
  Clock,
  TrendingUp,
} from "lucide-react";

interface RecentAnalysis {
  id: string;
  url: string;
  date: string;
  pagesAnalyzed: number;
  healthScore?: number;
}

interface EmptyStateOnboardingProps {
  recentAnalyses?: RecentAnalysis[];
  onStartAnalysis: (url: string) => void;
  onLoadHistory: (analysis: RecentAnalysis) => void;
  onQuickAction: (action: "draft" | "gaps") => void;
}

export default function EmptyStateOnboarding({
  recentAnalyses = [],
  onStartAnalysis,
  onLoadHistory,
  onQuickAction,
}: EmptyStateOnboardingProps) {
  const [url, setUrl] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onStartAnalysis(url.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            AI-Powered SEO Analysis
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Enter your domain to generate
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            your SEO Roadmap
          </span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Discover content gaps, analyze your brand voice, and get AI-powered content
          suggestions tailored to your business.
        </p>

        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full pl-12 pr-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-slate-100 text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={!url.trim()}
              className="inline-flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Search className="w-5 h-5" />
              Analyze
            </button>
          </div>
        </form>
      </div>

      {/* Recent Activity */}
      {recentAnalyses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAnalyses.slice(0, 3).map((analysis) => (
              <button
                key={analysis.id}
                onClick={() => onLoadHistory(analysis)}
                className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  {analysis.healthScore && (
                    <span
                      className={`text-sm font-bold ${
                        analysis.healthScore >= 70
                          ? "text-green-600"
                          : analysis.healthScore >= 50
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {analysis.healthScore}%
                    </span>
                  )}
                </div>
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate mb-1">
                  {analysis.url.replace(/^https?:\/\//, "")}
                </p>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span>{analysis.pagesAnalyzed} pages</span>
                  <span>•</span>
                  <span>{analysis.date}</span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Load analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onQuickAction("draft")}
            className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Draft New Article
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Generate a new SEO-optimized article with AI assistance
            </p>
            <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
              <span>Start writing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onQuickAction("gaps")}
            className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Check Content Gaps
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Identify missing content opportunities on your website
            </p>
            <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
              <span>Find opportunities</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: 1,
              title: "Enter URL",
              desc: "Provide your website URL to begin",
            },
            {
              step: 2,
              title: "Auto Crawl",
              desc: "We discover and categorize all your pages",
            },
            {
              step: 3,
              title: "AI Analysis",
              desc: "Deep analysis of content, tone, and gaps",
            },
            {
              step: 4,
              title: "Get Roadmap",
              desc: "Actionable recommendations to improve SEO",
            },
          ].map((item, index) => (
            <div key={item.step} className="text-center relative">
              {index < 3 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-slate-200 dark:bg-slate-700" />
              )}
              <div className="relative z-10 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {item.step}
                </span>
              </div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
