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
  Bot,
  Wand2,
  MapPin,
  Image as ImageIcon,
  Zap,
  Sparkles,
  Rocket,
  FileText,
} from "lucide-react";

interface Step {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const crawlSteps: Step[] = [
  { id: "discover", label: "Website Discovery", description: "Scanning your website structure and sitemap", icon: Globe },
  { id: "extract", label: "Content Extraction", description: "Reading and analyzing page content", icon: FileSearch },
  { id: "categorize", label: "Smart Categorization", description: "AI-powered page type classification", icon: Bot },
];

const analyzeSteps: Step[] = [
  { id: "extract", label: "Content Processing", description: "Extracting key information from pages", icon: FileSearch },
  { id: "analyze", label: "Brand Analysis", description: "Understanding your unique voice and tone", icon: Brain },
  { id: "gaps", label: "Gap Detection", description: "Identifying content opportunities", icon: Target },
  { id: "suggest", label: "AI Recommendations", description: "Generating intelligent suggestions", icon: Wand2 },
];

const seoTips = [
  "🚀 AI-generated content with images can increase engagement by 94%",
  "🎯 Location-specific content drives 3x more local traffic",
  "⚡ Featured images improve click-through rates by 47%",
  "🧠 AI-powered topic suggestions save 10+ hours of research",
  "📊 Content with proper structure ranks 2x higher",
  "🎨 Visual content increases shares by 40%",
  "📍 Local SEO optimization captures 80% of nearby customers",
  "🔍 Semantic keywords improve search visibility by 55%",
  "📱 Mobile-optimized content ranks better in 2024",
  "💡 AI-generated outlines improve content quality by 73%",
];

const discoveryStats = [
  { label: "Pages Found", value: "0", suffix: "pages", icon: <FileText className="w-4 h-4" /> },
  { label: "Services", value: "0", suffix: "identified", icon: <Target className="w-4 h-4" /> },
  { label: "Locations", value: "0", suffix: "found", icon: <MapPin className="w-4 h-4" /> },
  { label: "Images", value: "0", suffix: "analyzed", icon: <ImageIcon className="w-4 h-4" /> },
];

interface ProgressStepperProps {
  mode: "crawl" | "analyze";
  progress?: number;
  currentStep?: number;
}

export default function ProgressStepper({ mode, progress = 0, currentStep = 0 }: ProgressStepperProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(discoveryStats.map(stat => ({ ...stat, currentValue: 0 })));
  const steps = mode === "crawl" ? crawlSteps : analyzeSteps;

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % seoTips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate stats based on progress
    const animationInterval = setInterval(() => {
      setAnimatedStats(prev => prev.map(stat => ({
        ...stat,
        currentValue: Math.min(Math.floor(stat.currentValue + (Math.random() * 3)), Math.floor(progress * 0.5))
      })));
    }, 100);

    return () => clearInterval(animationInterval);
  }, [progress]);

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="w-full p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full mb-4">
          {mode === "crawl" ? (
            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
          ) : (
            <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          )}
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {mode === "crawl" ? "Auto-Discovery in Progress" : "AI Analysis Running"}
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {mode === "crawl" ? "Crawling Your Website" : "Analyzing Your Content"}
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          {mode === "crawl" 
            ? "Our AI is discovering and categorizing all your website content"
            : "Generating intelligent insights and content recommendations"
          }
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-3 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {animatedStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stat.currentValue}
              </div>
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{stat.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500">{stat.suffix}</p>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(index);

          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 transform ${
                status === "active"
                  ? "bg-white dark:bg-slate-800 shadow-lg border-2 border-blue-200 dark:border-blue-700 scale-105"
                  : status === "completed"
                  ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
                  : "opacity-40 scale-95"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  status === "completed"
                    ? "bg-green-100 dark:bg-green-900/50 shadow-lg"
                    : status === "active"
                    ? "bg-blue-100 dark:bg-blue-900/50 shadow-lg animate-pulse"
                    : "bg-slate-100 dark:bg-slate-700"
                }`}
              >
                {status === "completed" ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : status === "active" ? (
                  <div className="relative">
                    <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
                    <Sparkles className="w-3 h-3 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                ) : (
                  <Icon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`font-bold text-lg mb-1 transition-all duration-300 ${
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
                  className={`text-sm transition-all duration-300 ${
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
              {status === "active" && (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SEO Tips */}
      <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-2">
              💡 Pro Tip
            </p>
            <p className="text-slate-700 dark:text-slate-300 transition-opacity duration-500 leading-relaxed">
              {seoTips[tipIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
