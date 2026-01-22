"use client";

import { useState, useEffect } from "react";
import {
  Wand2,
  Globe,
  MapPin,
  FileText,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Search,
  Target,
  Settings,
  Eye,
  Zap,
  Sparkles,
  RefreshCw,
  Copy,
  Download,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface DiscoveryData {
  services: string[];
  locations: string[];
  aboutSummary: string;
  targetAudience: string;
  brandTone: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  existingPages: Array<{
    url: string;
    type: string;
    title: string;
  }>;
}

interface Topic {
  title: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  targetLocations: string[];
  contentType: "blog post" | "landing page";
  description: string;
  searchIntent: "informational" | "commercial" | "local";
  estimatedWordCount?: number;
  difficulty?: "easy" | "medium" | "hard";
}

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: "generating" | "completed" | "failed";
}

export default function AutoContentEngineSplit() {
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedTone, setSelectedTone] = useState<string>("professional");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState<string>("");
  const [customKeywords, setCustomKeywords] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"skeleton" | "outline" | "content">("skeleton");

  const toneOptions = [
    { value: "professional", label: "Professional", desc: "Formal and business-focused" },
    { value: "conversational", label: "Conversational", desc: "Friendly and approachable" },
    { value: "authoritative", label: "Authoritative", desc: "Expert and confident" },
    { value: "educational", label: "Educational", desc: "Informative and helpful" },
  ];

  useEffect(() => {
    loadDiscoveryData();
  }, []);

  const loadDiscoveryData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/content/auto-discovery?crawlRequestId=latest");
      const data = await response.json();

      if (data.success) {
        setDiscoveryData(data.data);
        if (data.data.brandTone) {
          setSelectedTone(data.data.brandTone.toLowerCase());
        }
      } else {
        throw new Error(data.error || "Failed to load discovery data");
      }
    } catch (error) {
      console.error("Error loading discovery data:", error);
      setError("Failed to load discovery data. Please run a crawl first.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!customTopic && !selectedService) {
      setError("Please enter a topic or select a service");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setPreviewMode("outline");
    setGeneratedContent(null);

    try {
      const response = await fetch("/api/content/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: customTopic || `${selectedService} Services`,
          service: selectedService,
          locations: selectedLocations,
          tone: selectedTone,
          keywords: customKeywords.split(",").map((k) => k.trim()).filter(Boolean),
          brandContext: discoveryData?.aboutSummary,
          targetAudience: discoveryData?.targetAudience,
          stream: true, // Enable streaming
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start content generation");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Streaming not supported");
      }

      const decoder = new TextDecoder();
      let accumulatedContent = "";
      
      setPreviewMode("content");
      setGeneratedContent({
        id: `content_${Date.now()}`,
        title: customTopic || `${selectedService} Services`,
        content: "",
        wordCount: 0,
        status: "generating",
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;
        
        // Update content in real-time
        setGeneratedContent(prev => prev ? {
          ...prev,
          content: accumulatedContent,
          wordCount: accumulatedContent.split(/\s+/).length,
        } : null);
      }

      // Mark as completed
      setGeneratedContent(prev => prev ? {
        ...prev,
        status: "completed",
      } : null);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate content");
      setPreviewMode("skeleton");
      setGeneratedContent(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedContent?.content) {
      navigator.clipboard.writeText(generatedContent.content);
    }
  };

  const handleReset = () => {
    setGeneratedContent(null);
    setPreviewMode("skeleton");
    setCustomTopic("");
    setCustomKeywords("");
  };

  const canGenerate = (customTopic || selectedService) && !isGenerating;

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Side - Configuration */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Content Configuration
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Topic / Title
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g., Ultimate Guide to Digital Marketing"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                />
              </div>

              {/* Service Selection */}
              {discoveryData?.services && discoveryData.services.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Related Service (Optional)
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  >
                    <option value="">Select a service...</option>
                    {discoveryData.services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Writing Tone
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setSelectedTone(tone.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        selectedTone === tone.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                        {tone.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {tone.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Target Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  placeholder="e.g., SEO, digital marketing, content strategy"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                />
              </div>

              {/* Location Selection */}
              {discoveryData?.locations && discoveryData.locations.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Target Locations (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {discoveryData.locations.map((location) => (
                      <button
                        key={location}
                        onClick={() =>
                          setSelectedLocations((prev) =>
                            prev.includes(location)
                              ? prev.filter((l) => l !== location)
                              : [...prev, location]
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          selectedLocations.includes(location)
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Content
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Preview */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Content Preview
              </h2>
            </div>
            {generatedContent && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Copy content"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Reset"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Skeleton State */}
          {previewMode === "skeleton" && !isGenerating && (
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-full animate-pulse" />
                <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-4/6 animate-pulse" />
              </div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2 animate-pulse mt-6" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-full animate-pulse" />
                <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-5/6 animate-pulse" />
              </div>
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">
                  Configure your content and click Generate to see the preview
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <p className="text-slate-700 dark:text-slate-300">
                  Generating your content...
                </p>
              </div>
              <div className="h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-3/4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-blue-50 dark:bg-blue-900/20 rounded w-full animate-pulse" />
                <div className="h-4 bg-blue-50 dark:bg-blue-900/20 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-blue-50 dark:bg-blue-900/20 rounded w-4/6 animate-pulse" />
              </div>
            </div>
          )}

          {/* Content Preview */}
          {previewMode === "content" && generatedContent && (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {generatedContent.wordCount.toLocaleString()} words generated
                </span>
              </div>
              <ReactMarkdown>{generatedContent.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
