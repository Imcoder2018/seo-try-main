"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle,
  FileText,
  Globe,
  Target,
  Users,
  Copy,
  Download,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Clock,
} from "lucide-react";

interface ContentGeneratorPanelProps {
  topic: string;
  keywords?: string[];
  targetAudience?: string;
  tone?: string;
  brandContext?: {
    businessName?: string;
    businessType?: string;
    services?: string[];
    location?: string;
  };
  onContentGenerated?: (content: GeneratedContent) => void;
  onClose?: () => void;
}

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  wordCount: number;
  keywords: string[];
  status: "completed" | "failed";
}

interface GenerationStatus {
  status: "idle" | "triggering" | "running" | "polling" | "completed" | "failed";
  progress: number;
  message: string;
  runId?: string;
}

export default function ContentGeneratorPanel({
  topic,
  keywords = [],
  targetAudience = "General audience",
  tone = "professional",
  brandContext,
  onContentGenerated,
  onClose,
}: ContentGeneratorPanelProps) {
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    status: "idle",
    progress: 0,
    message: "Ready to generate content",
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generateImage, setGenerateImage] = useState(true);
  const [customTopic, setCustomTopic] = useState(topic);
  const [customKeywords, setCustomKeywords] = useState(keywords.join(", "));
  const [contentType, setContentType] = useState<"blog post" | "landing page">("blog post");
  const [wordCount, setWordCount] = useState(1500);

  useEffect(() => {
    setCustomTopic(topic);
  }, [topic]);

  const handleGenerate = async () => {
    setGenerationStatus({
      status: "triggering",
      progress: 10,
      message: "Initiating content generation...",
    });

    try {
      // Trigger the content generation task
      const response = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_full_content",
          keyword: customTopic,
          keywords: customKeywords.split(",").map(k => k.trim()).filter(Boolean),
          businessType: brandContext?.businessType || "Business",
          businessName: brandContext?.businessName || "Our Company",
          services: brandContext?.services || [],
          location: brandContext?.location || "",
          tone: tone,
          targetWordCount: wordCount,
          contentType: contentType,
          generateImage: generateImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate content");
      }

      setGenerationStatus({
        status: "running",
        progress: 30,
        message: "AI is writing your content...",
      });

      const data = await response.json();

      if (data.success && data.data) {
        setGenerationStatus({
          status: "completed",
          progress: 100,
          message: "Content generated successfully!",
        });

        const content: GeneratedContent = {
          id: `content_${Date.now()}`,
          title: data.data.title || customTopic,
          content: data.data.content || "",
          wordCount: data.data.wordCount || 0,
          keywords: data.data.secondaryKeywords || customKeywords.split(",").map(k => k.trim()),
          status: "completed",
        };

        setGeneratedContent(content);
        onContentGenerated?.(content);
      } else {
        throw new Error(data.error || "No content generated");
      }
    } catch (error) {
      console.error("Content generation error:", error);
      setGenerationStatus({
        status: "failed",
        progress: 0,
        message: error instanceof Error ? error.message : "Failed to generate content",
      });
    }
  };

  const handleCopyContent = () => {
    if (generatedContent?.content) {
      navigator.clipboard.writeText(generatedContent.content);
    }
  };

  const handleReset = () => {
    setGenerationStatus({
      status: "idle",
      progress: 0,
      message: "Ready to generate content",
    });
    setGeneratedContent(null);
  };

  const getStatusColor = () => {
    switch (generationStatus.status) {
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "running":
      case "polling":
      case "triggering":
        return "text-blue-600";
      default:
        return "text-slate-600";
    }
  };

  const getStatusIcon = () => {
    switch (generationStatus.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "running":
      case "polling":
      case "triggering":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Sparkles className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">AI Content Generator</h2>
              <p className="text-blue-100 text-sm">Powered by Trigger.dev + OpenAI</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Topic Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Content Topic
          </label>
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            disabled={generationStatus.status === "running"}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            placeholder="Enter your content topic..."
          />
        </div>

        {/* Keywords Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Target Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={customKeywords}
            onChange={(e) => setCustomKeywords(e.target.value)}
            disabled={generationStatus.status === "running"}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            placeholder="keyword1, keyword2, keyword3..."
          />
        </div>

        {/* Advanced Options Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4"
        >
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Advanced Options
        </button>

        {showAdvanced && (
          <div className="space-y-4 mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="blog post">Blog Post</option>
                  <option value="landing page">Landing Page</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Target Word Count
                </label>
                <select
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value={800}>800 words (Short)</option>
                  <option value={1200}>1200 words (Medium)</option>
                  <option value={1500}>1500 words (Standard)</option>
                  <option value={2000}>2000 words (Long)</option>
                  <option value={3000}>3000 words (Comprehensive)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="generateImage"
                checked={generateImage}
                onChange={(e) => setGenerateImage(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="generateImage" className="text-sm text-slate-700 dark:text-slate-300">
                Generate featured image with DALL-E
              </label>
            </div>
          </div>
        )}

        {/* Generation Status */}
        {generationStatus.status !== "idle" && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {generationStatus.message}
              </span>
            </div>
            {(generationStatus.status === "running" || generationStatus.status === "polling" || generationStatus.status === "triggering") && (
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${generationStatus.progress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Generated Content Preview */}
        {generatedContent && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Generated Content
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyContent}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
              <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                {generatedContent.title}
              </h4>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                <span>{generatedContent.wordCount} words</span>
                <span>•</span>
                <span>{generatedContent.keywords.length} keywords</span>
              </div>
              <div
                className="prose prose-sm dark:prose-invert max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: generatedContent.content.substring(0, 2000) + "..." }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {generationStatus.status === "idle" || generationStatus.status === "failed" ? (
            <button
              onClick={handleGenerate}
              disabled={!customTopic.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              Generate Content
            </button>
          ) : generationStatus.status === "completed" ? (
            <>
              <button
                onClick={handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Generate Another
              </button>
              <button
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                Done
              </button>
            </>
          ) : (
            <button
              disabled
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium rounded-lg cursor-not-allowed"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
