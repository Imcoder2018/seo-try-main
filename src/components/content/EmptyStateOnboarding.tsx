"use client";

import React, { useState } from "react";
import {
  Globe,
  Sparkles,
  ArrowRight,
  FileText,
  Search,
  Zap,
  Clock,
  TrendingUp,
  Wand2,
  MapPin,
  Target,
  Settings,
  Eye,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Bot,
  Image,
  PenTool,
  Rocket,
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
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onStartAnalysis(url.trim());
    }
  };

  const wizardSteps = [
    {
      id: 'auto-discovery',
      title: 'Auto-Discovery',
      description: 'Analyze your website',
      icon: <Bot className="w-6 h-6" />,
      status: 'active',
      details: 'Automatically discover and categorize all your website content'
    },
    {
      id: 'service-selection',
      title: 'Service Selection',
      description: 'Choose a service to grow',
      icon: <Target className="w-6 h-6" />,
      status: 'upcoming',
      details: 'Select key services you want to focus on'
    },
    {
      id: 'ai-topics',
      title: 'AI Topics',
      description: 'Review AI-generated topics',
      icon: <Wand2 className="w-6 h-6" />,
      status: 'upcoming',
      details: 'Get AI-powered topic suggestions based on your analysis'
    },
    {
      id: 'location-mapping',
      title: 'Location Mapping',
      description: 'Select target locations',
      icon: <MapPin className="w-6 h-6" />,
      status: 'upcoming',
      details: 'Choose geographic areas for local SEO targeting'
    },
    {
      id: 'generation',
      title: 'Generation',
      description: 'Generate content & images',
      icon: <Image className="w-6 h-6" />,
      status: 'upcoming',
      details: 'Create SEO-optimized content with featured images'
    },
    {
      id: 'review-publish',
      title: 'Review & Publish',
      description: 'Review and publish content',
      icon: <Rocket className="w-6 h-6" />,
      status: 'upcoming',
      details: 'Review, edit, and publish your content'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section with Content Wizard */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Content Wizard - 6-step guided content generation • AI-powered • Location-specific
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Transform Your Content with
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            AI-Powered SEO Strategy
          </span>
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
          Generate high-quality content with featured images, optimize for search engines, 
          and dominate your local market with our intelligent content wizard.
        </p>

        {/* Content Wizard Steps */}
        <div className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wizardSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    index === 0
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg transform scale-105'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      index === 0
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {step.description}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {step.details}
                      </p>
                    </div>
                  </div>
                  {index < wizardSteps.length - 1 && (
                    <ChevronRight className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-300 dark:text-slate-600 hidden lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* URL Input Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-1">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Website Auto-Discovery
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Analyzing your website to extract services, locations, and brand context...
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full pl-12 pr-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 text-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!url.trim()}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                >
                  <Search className="w-5 h-5" />
                  Start Analysis
                </button>
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>✅ Using data from your latest Content Analysis</span>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Discovery Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Services Found', value: '9', desc: 'Services identified', icon: <Target className="w-5 h-5" /> },
            { label: 'Locations', value: '10', desc: 'Target areas found', icon: <MapPin className="w-5 h-5" /> },
            { label: 'Existing Pages', value: '0', desc: 'Pages analyzed', icon: <FileText className="w-5 h-5" /> },
            { label: 'Brand Context', value: '✓', desc: 'Analysis complete', icon: <Eye className="w-5 h-5" /> },
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{stat.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium">
            Previous
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2">
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
        {recentAnalyses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-slate-400" />
              Recent Analysis Activity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentAnalyses.slice(0, 3).map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() => onLoadHistory(analysis)}
                  className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    {analysis.healthScore && (
                      <span
                        className={`text-lg font-bold ${
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
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate mb-2">
                    {analysis.url.replace(/^https?:\/\//, "")}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <span>{analysis.pagesAnalyzed} pages</span>
                    <span>•</span>
                    <span>{analysis.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Load this analysis</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => onQuickAction("draft")}
            className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all text-left group"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Draft New Article
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Generate a new SEO-optimized article with AI assistance and featured images
            </p>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <span className="font-medium">Start writing</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onQuickAction("gaps")}
            className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all text-left group"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Check Content Gaps
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Identify missing content opportunities and get AI-powered suggestions
            </p>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <span className="font-medium">Find opportunities</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
          How Our Content Wizard Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: 1,
              title: "Enter URL",
              desc: "Provide your website URL to begin analysis",
              icon: <Globe className="w-6 h-6" />,
              color: "blue"
            },
            {
              step: 2,
              title: "Auto Crawl",
              desc: "AI discovers and categorizes all your pages",
              icon: <Bot className="w-6 h-6" />,
              color: "purple"
            },
            {
              step: 3,
              title: "AI Analysis",
              desc: "Deep analysis of content, tone, and SEO gaps",
              icon: <Wand2 className="w-6 h-6" />,
              color: "indigo"
            },
            {
              step: 4,
              title: "Generate Content",
              desc: "Create SEO-optimized content with images",
              icon: <Image className="w-6 h-6" />,
              color: "green"
            },
          ].map((item, index) => (
            <div key={item.step} className="text-center relative">
              {index < 3 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
              )}
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mx-auto mb-4 border-2 border-slate-200 dark:border-slate-600">
                <span className={`text-lg font-bold bg-gradient-to-r from-${item.color}-600 to-${item.color}-700 bg-clip-text text-transparent`}>
                  {item.icon}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
