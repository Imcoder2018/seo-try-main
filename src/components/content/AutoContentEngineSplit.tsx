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
  Image as ImageIcon,
  Calendar,
  User,
  Tag,
  ExternalLink,
  X,
  Check,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import SearchResultPreview from "./SearchResultPreview";

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
  featuredImage?: string;
  imageUrl?: string;
  imagePrompt?: string;
  metadata?: {
    keywords: string[];
    targetLocation: string;
    tone: string;
    contentType: string;
  };
}

export default function AutoContentEngineSplit() {
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedTone, setSelectedTone] = useState<string>("professional");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState<string>("");
  const [customKeywords, setCustomKeywords] = useState<string>("");
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);
  const [selectedGeneratedKeywords, setSelectedGeneratedKeywords] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"skeleton" | "outline" | "content">("skeleton");
  const [useBackendGeneration, setUseBackendGeneration] = useState(false);

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

  const handleGenerateKeywords = async () => {
    if (!customTopic && !selectedService) {
      setError("Please enter a topic or select a service first");
      return;
    }

    setIsGeneratingKeywords(true);
    setError(null);

    try {
      const response = await fetch("/api/content/ai-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedService: customTopic || selectedService,
          locations: selectedLocations.length > 0 ? selectedLocations : [discoveryData?.locations?.[0] || "Pakistan"],
          brandTone: selectedTone,
          targetAudience: discoveryData?.targetAudience || "Business professionals",
          aboutSummary: discoveryData?.aboutSummary || "Professional services",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate keywords");
      }

      const result = await response.json();
      
      if (result.success && result.topics && result.topics.length > 0) {
        const keywords = result.topics.flatMap((topic: any) => [
          ...topic.primaryKeywords,
          ...topic.secondaryKeywords,
        ]).filter((k: string, i: number, a: string[]) => a.indexOf(k) === i).slice(0, 10);
        
        setGeneratedKeywords(keywords);
        setSelectedGeneratedKeywords(keywords); // Auto-select all
        setCustomKeywords(keywords.join(", "));
      } else {
        throw new Error(result.error || "No keywords generated");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate keywords");
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const handleToggleKeyword = (keyword: string) => {
    setSelectedGeneratedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
    setCustomKeywords(
      selectedGeneratedKeywords.includes(keyword)
        ? selectedGeneratedKeywords.filter(k => k !== keyword).join(", ")
        : [...selectedGeneratedKeywords, keyword].join(", ")
    );
  };

  const handleSelectAllKeywords = () => {
    setSelectedGeneratedKeywords(generatedKeywords);
    setCustomKeywords(generatedKeywords.join(", "));
  };

  const handleDeselectAllKeywords = () => {
    setSelectedGeneratedKeywords([]);
    setCustomKeywords("");
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
      if (useBackendGeneration) {
        // Use Trigger.dev backend generation
        await handleBackendGenerate();
      } else {
        // Use frontend generation
        await handleFrontendGenerate();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate content");
      setPreviewMode("skeleton");
      setGeneratedContent(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFrontendGenerate = async () => {
    setPreviewMode("content");
    setGeneratedContent({
      id: `content_${Date.now()}`,
      title: customTopic || `${selectedService} Services`,
      content: "Generating content...",
      wordCount: 0,
      status: "generating",
      featuredImage: undefined,
      imageUrl: undefined,
      imagePrompt: undefined,
      metadata: {
        keywords: customKeywords.split(",").map(k => k.trim()).filter(Boolean),
        targetLocation: selectedLocations[0] || discoveryData?.locations?.[0] || "Australia",
        tone: selectedTone,
        contentType: "blog post"
      }
    });

    const response = await fetch("/api/content/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate_full_content",
        keyword: customTopic || selectedService,
        businessType: discoveryData?.services?.[0] || "Technology Consulting",
        businessName: "DataTech Consultants",
        services: discoveryData?.services || [selectedService],
        location: selectedLocations[0] || "Australia",
        tone: selectedTone,
        targetWordCount: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to start content generation");
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      setGeneratedContent({
        id: `content_${Date.now()}`,
        title: result.data.title || customTopic || `${selectedService} Services`,
        content: result.data.content || "Content generated successfully",
        wordCount: result.data.wordCount || 0,
        status: "completed",
        featuredImage: result.data.featuredImage || result.data.imageUrl || `https://picsum.photos/1200/600?random=${Math.random()}`,
        imageUrl: result.data.imageUrl || `https://picsum.photos/800/600?random=${Math.random()}`,
        imagePrompt: result.data.imagePrompt || `AI-generated image for ${result.data.title}`,
        metadata: {
          keywords: result.data.keywords || customKeywords.split(",").map(k => k.trim()).filter(Boolean),
          targetLocation: selectedLocations[0] || discoveryData?.locations?.[0] || "Australia",
          tone: selectedTone,
          contentType: result.data.contentType || "blog post"
        }
      });
    } else {
      throw new Error(result.error || "Failed to generate content");
    }
  };

  const handleBackendGenerate = async () => {
    setPreviewMode("content");
    setGeneratedContent({
      id: `content_${Date.now()}`,
      title: customTopic || `${selectedService} Services`,
      content: "Generating content via Trigger.dev...",
      wordCount: 0,
      status: "generating",
      featuredImage: undefined,
      imageUrl: undefined,
      imagePrompt: undefined,
      metadata: {
        keywords: customKeywords.split(",").map(k => k.trim()).filter(Boolean),
        targetLocation: selectedLocations[0] || discoveryData?.locations?.[0] || "Australia",
        tone: selectedTone,
        contentType: "blog post"
      }
    });

    const response = await fetch("/api/content/bulk-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selectedTopics: [{
          title: customTopic || selectedService,
          primaryKeywords: customKeywords.split(",").map(k => k.trim()).filter(Boolean),
          secondaryKeywords: [],
          contentType: "blog post",
          description: customTopic || `Content about ${selectedService}`,
          searchIntent: "informational",
        }],
        selectedLocations: selectedLocations.length > 0 ? selectedLocations : [discoveryData?.locations?.[0] || "Pakistan"],
        service: selectedService || customTopic,
        brandTone: selectedTone,
        targetAudience: discoveryData?.targetAudience || "Business professionals",
        aboutSummary: discoveryData?.aboutSummary || "Professional services",
        generateImages: true,
        singlePage: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to start content generation");
    }

    const result = await response.json();
    const taskId = result.taskId;

    // Poll for task completion
    await pollForTaskCompletion(taskId);
  };

  const pollForTaskCompletion = async (taskId: string) => {
    const maxAttempts = 60;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
      
      try {
        const response = await fetch(`/api/content/bulk-generate?taskId=${taskId}`);
        const data = await response.json();
        
        if (data.success && data.results && data.results.length > 0) {
          const content = data.results[0];
          setGeneratedContent({
            id: content.id,
            title: content.title,
            content: content.content,
            wordCount: content.wordCount || 0,
            status: "completed",
            featuredImage: content.imageUrl,
            imageUrl: content.imageUrl,
            imagePrompt: undefined,
            metadata: {
              keywords: content.keywords || customKeywords.split(",").map(k => k.trim()).filter(Boolean),
              targetLocation: content.location || selectedLocations[0] || discoveryData?.locations?.[0] || "Australia",
              tone: selectedTone,
              contentType: content.contentType || "blog post"
            }
          });
          return;
        } else if (data.status === "FAILED" || data.status === "CRASHED") {
          throw new Error(data.error || "Content generation failed");
        }
      } catch (error) {
        if (attempts === maxAttempts) {
          throw new Error("Content generation timed out");
        }
      }
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
    setPublishStatus(null);
  };

  const handlePublishToWordPress = async () => {
    if (!generatedContent) {
      setError("No content to publish");
      return;
    }

    setIsPublishing(true);
    setPublishStatus(null);

    try {
      const response = await fetch("/api/wordpress/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedContent.title,
          content: generatedContent.content,
          location: generatedContent.metadata?.targetLocation || "Pakistan",
          contentType: generatedContent.metadata?.contentType || "blog post",
          imageUrl: generatedContent.imageUrl || generatedContent.featuredImage,
          primaryKeywords: generatedContent.metadata?.keywords || [],
          status: "draft",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to publish to WordPress");
      }

      const result = await response.json();
      setPublishStatus(result.message || "Content published successfully!");
    } catch (err) {
      setPublishStatus(err instanceof Error ? err.message : "Failed to publish to WordPress");
    } finally {
      setIsPublishing(false);
    }
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Target Keywords (comma separated)
                  </label>
                  <button
                    onClick={handleGenerateKeywords}
                    disabled={isGeneratingKeywords || (!customTopic && !selectedService)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGeneratingKeywords ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3 h-3" />
                        Generate AI Keywords
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  placeholder="e.g., SEO, digital marketing, content strategy"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                />
                
                {/* Generated Keywords Selection */}
                {generatedKeywords.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSelectAllKeywords}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <button
                        onClick={handleDeselectAllKeywords}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Deselect All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {generatedKeywords.map((keyword) => (
                        <button
                          key={keyword}
                          onClick={() => handleToggleKeyword(keyword)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedGeneratedKeywords.includes(keyword)
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                          }`}
                        >
                          {selectedGeneratedKeywords.includes(keyword) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3 opacity-0" />
                          )}
                          {keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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

              {/* Generation Method Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Generation Method
                  </span>
                </div>
                <button
                  onClick={() => setUseBackendGeneration(!useBackendGeneration)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {useBackendGeneration ? (
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <ToggleRight className="w-5 h-5" />
                      <span>Backend (Trigger.dev)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <ToggleLeft className="w-5 h-5" />
                      <span>Frontend</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {useBackendGeneration ? "Generating via Trigger.dev..." : "Generating Content..."}
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    {useBackendGeneration ? "Generate via Backend" : "Generate Content"}
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
                  onClick={handlePublishToWordPress}
                  disabled={isPublishing}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  title="Publish to WordPress"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Publish to WordPress
                    </>
                  )}
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

          {/* Publish Status */}
          {publishStatus && (
            <div className={`mb-4 p-3 rounded-lg border ${
              publishStatus.includes("successfully") 
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
            }`}>
              <p className="text-sm">{publishStatus}</p>
            </div>
          )}

          {/* Skeleton State with Search Result Preview */}
          {previewMode === "skeleton" && !isGenerating && (
            <div className="space-y-6">
              {/* Live Search Result Preview */}
              <SearchResultPreview
                title={customTopic}
                url={discoveryData?.existingPages?.[0]?.url || "https://example.com"}
                keywords={customKeywords.split(",").map((k) => k.trim()).filter(Boolean)}
              />

              {/* Placeholder skeleton */}
              {!customTopic && (
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-full animate-pulse" />
                    <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-4/6 animate-pulse" />
                  </div>
                  <div className="text-center py-6">
                    <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Enter a topic to see your search preview
                    </p>
                  </div>
                </div>
              )}
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
            <div className="space-y-6">
              {/* Content Header with Featured Image */}
              <div className="relative">
                {generatedContent.featuredImage || generatedContent.imageUrl ? (
                  <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                    <img 
                      src={generatedContent.featuredImage || generatedContent.imageUrl} 
                      alt={generatedContent.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a reliable placeholder image
                        e.currentTarget.src = `https://picsum.photos/1200/600?random=${Date.now()}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h1 className="text-2xl font-bold text-white mb-2">
                        {generatedContent.title}
                      </h1>
                      <div className="flex items-center gap-3 text-white/90 text-sm">
                        {generatedContent.metadata?.targetLocation && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {generatedContent.metadata.targetLocation}
                          </div>
                        )}
                        {generatedContent.metadata?.contentType && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {generatedContent.metadata.contentType}
                          </div>
                        )}
                        {generatedContent.wordCount > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {generatedContent.wordCount.toLocaleString()} words
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {generatedContent.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      {generatedContent.metadata?.targetLocation && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {generatedContent.metadata.targetLocation}
                        </div>
                      )}
                      {generatedContent.metadata?.contentType && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {generatedContent.metadata.contentType}
                        </div>
                      )}
                      {generatedContent.wordCount > 0 && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {generatedContent.wordCount.toLocaleString()} words
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Content Metadata */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {generatedContent.metadata?.keywords?.slice(0, 5).map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Content Stats */}
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Content generated successfully</span>
                  </div>
                  {generatedContent.metadata?.tone && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>Tone: {generatedContent.metadata.tone}</span>
                    </div>
                  )}
                  {generatedContent.imagePrompt && (
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      <span>AI Image Generated</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-6">
                  <ReactMarkdown>{generatedContent.content}</ReactMarkdown>
                </div>
              </div>

              {/* Image Prompt Display */}
              {generatedContent.imagePrompt && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h4 className="font-medium text-amber-900 dark:text-amber-100">AI Image Prompt</h4>
                  </div>
                  <p className="text-sm text-amber-800 dark:text-amber-200 italic">
                    "{generatedContent.imagePrompt}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
