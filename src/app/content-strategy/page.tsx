"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import SidebarLayout from "@/components/layout/SidebarLayout";
import ContentStrategyDashboard from "@/components/content/content-strategy-dashboard";
import HistoryPanel from "@/components/content/HistoryPanel";
import AutoContentEngineSplit from "@/components/content/AutoContentEngineSplit";
import PlannerView from "@/components/content/PlannerView";
import ProgressStepper from "@/components/content/ProgressStepper";
import SmartSelectSummary from "@/components/content/SmartSelectSummary";
import EmptyStateOnboarding from "@/components/content/EmptyStateOnboarding";
import SEOHealthScore from "@/components/content/SEOHealthScore";
import PersonaCard from "@/components/content/PersonaCard";
import GapAnalysisCard from "@/components/content/GapAnalysisCard";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  Search,
  History,
  ArrowLeft,
} from "lucide-react";

interface CrawledPage {
  url: string;
  type: string;
  title?: string;
  selected?: boolean;
}

interface RecentAnalysis {
  id: string;
  url: string;
  date: string;
  pagesAnalyzed: number;
  healthScore?: number;
}

const STORAGE_KEY_DISCOVERY = "seo_discovery_data";
const STORAGE_KEY_ANALYSIS = "seo_analysis_output";

export default function ContentStrategyPage() {
  const searchParams = useSearchParams();
  const initialView = searchParams.get("view") || "analysis";

  const [activeView, setActiveView] = useState(initialView);
  const [analysisOutput, setAnalysisOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [crawlStep, setCrawlStep] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [pages, setPages] = useState<CrawledPage[]>([]);
  const [crawlRunId, setCrawlRunId] = useState<string | null>(null);
  const [crawlPublicToken, setCrawlPublicToken] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["service", "blog"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftGapTopic, setDraftGapTopic] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_ANALYSIS);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.analysisOutput && Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          setAnalysisOutput(data.analysisOutput);
        }
      } catch (e) {
        console.error("Failed to restore analysis:", e);
      }
    }

    const storedDiscovery = localStorage.getItem(STORAGE_KEY_DISCOVERY);
    if (storedDiscovery) {
      try {
        const data = JSON.parse(storedDiscovery);
        if (data.pages && Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          setPages(data.pages);
          if (data.baseUrl) setBaseUrl(data.baseUrl);
        }
      } catch (e) {
        console.error("Failed to restore discovery:", e);
      }
    }

    loadRecentAnalyses();
  }, []);

  const loadRecentAnalyses = async () => {
    try {
      const response = await fetch("/api/content/history?limit=3");
      if (response.ok) {
        const data = await response.json();
        setRecentAnalyses(
          (data.analyses || []).map((a: any) => ({
            id: a.id,
            url: a.baseUrl || a.url,
            date: new Date(a.createdAt).toLocaleDateString(),
            pagesAnalyzed: a.pagesAnalyzed || 0,
            healthScore: a.healthScore,
          }))
        );
      }
    } catch (e) {
      console.error("Failed to load recent analyses:", e);
    }
  };

  const handleCrawl = async (url?: string) => {
    const targetUrl = url || baseUrl;
    if (!targetUrl) {
      setError("Please enter a website URL");
      return;
    }

    setBaseUrl(targetUrl);
    setIsCrawling(true);
    setCrawlProgress(0);
    setCrawlStep(0);
    setError(null);
    setPages([]);

    try {
      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, maxPages: 50 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start crawl");
      }

      setCrawlRunId(data.runId);
      setCrawlPublicToken(data.publicToken);

      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const progress = Math.min(95, (attempts / maxAttempts) * 100);
        setCrawlProgress(progress);
        setCrawlStep(Math.min(2, Math.floor(attempts / 10)));

        const pollResponse = await fetch(
          `/api/crawl?runId=${data.runId}&publicToken=${data.publicToken}`
        );

        const pollData = await pollResponse.json();

        if (pollData.status === "COMPLETED") {
          setCrawlProgress(100);
          setCrawlStep(2);

          const urlGroups = pollData.output?.urlGroups || {};
          const allPages = pollData.output?.pages || [];

          const typeMapping: Record<string, string> = {
            core: "other",
            blog: "blog",
            product: "product",
            service: "service",
            category: "other",
            other: "other",
          };

          const pagesWithSelection: CrawledPage[] = [];

          Object.entries(urlGroups).forEach(([groupType, urls]) => {
            const pageType = typeMapping[groupType] || "other";
            const shouldAutoSelect = ["service", "blog"].includes(pageType);

            (urls as string[]).forEach((url: string) => {
              const pageData = allPages.find((p: any) => p.url === url);
              pagesWithSelection.push({
                url,
                type: pageType,
                title: pageData?.title || "",
                selected: shouldAutoSelect,
              });
            });
          });

          setPages(pagesWithSelection);
          localStorage.setItem(
            STORAGE_KEY_DISCOVERY,
            JSON.stringify({
              pages: pagesWithSelection,
              urlGroups,
              baseUrl: targetUrl,
              timestamp: Date.now(),
            })
          );
          setIsCrawling(false);
          return;
        } else if (pollData.status === "FAILED" || pollData.status === "CANCELED") {
          throw new Error(`Crawl failed with status: ${pollData.status}`);
        }

        attempts++;
      }

      throw new Error("Crawl timed out");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during crawl");
      setIsCrawling(false);
    }
  };

  const handleAnalysis = async () => {
    const selectedPages = pages.filter((p) => p.selected);

    if (selectedPages.length === 0) {
      setError("Please select at least one page to analyze");
      return;
    }

    setIsLoading(true);
    setAnalysisProgress(0);
    setAnalysisStep(0);
    setError(null);

    try {
      const response = await fetch("/api/content/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl,
          pages: selectedPages.map((p) => ({ url: p.url, type: p.type })),
          maxPages: 50,
          targetAudience: "General audience",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start analysis");
      }

      let attempts = 0;
      const maxAttempts = 90;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const progress = Math.min(95, (attempts / maxAttempts) * 100);
        setAnalysisProgress(progress);
        setAnalysisStep(Math.min(3, Math.floor(attempts / 15)));

        const pollResponse = await fetch(
          `/api/content/analyze?extractionRunId=${data.extractionRunId}&analysisRunId=${data.analysisRunId}&analysisId=${data.analysisId}`
        );

        const pollData = await pollResponse.json();

        if (pollData.hasFailed) {
          throw new Error(pollData.extractionError || pollData.analysisError || "Analysis failed");
        }

        if (pollData.isComplete && pollData.analysisOutput) {
          setAnalysisProgress(100);
          setAnalysisStep(3);
          setAnalysisOutput(pollData.analysisOutput);
          localStorage.setItem(
            STORAGE_KEY_ANALYSIS,
            JSON.stringify({
              analysisOutput: pollData.analysisOutput,
              timestamp: Date.now(),
            })
          );
          setIsLoading(false);
          loadRecentAnalyses();
          return;
        }

        attempts++;
      }

      throw new Error("Analysis timed out after 3 minutes. Please try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const handleCrawlHistorySelect = (crawlItem: any) => {
    if (crawlItem.pagesData) {
      const transformedPages = crawlItem.pagesData.map((page: any) => ({
        url: page.url || page,
        type: page.type || "unknown",
        title: page.title || "",
        selected: true,
      }));

      setPages(transformedPages);
      setBaseUrl(crawlItem.url);
      setIsCrawling(false);
    }
  };

  const handleAnalysisHistorySelect = (analysisItem: any) => {
    if (analysisItem.analysisOutput) {
      setAnalysisOutput(analysisItem.analysisOutput);
      setIsLoading(false);
    }
  };

  const handleSelectType = (type: string, select: boolean) => {
    setPages(pages.map((p) => (p.type === type ? { ...p, selected: select } : p)));
  };

  const handleSelectRecommended = () => {
    setPages(
      pages.map((p) => ({
        ...p,
        selected: ["service", "blog"].includes(p.type),
      }))
    );
  };

  const handleSelectAll = () => {
    setPages(pages.map((p) => ({ ...p, selected: true })));
  };

  const handleDeselectAll = () => {
    setPages(pages.map((p) => ({ ...p, selected: false })));
  };

  const togglePageSelection = (index: number) => {
    const newPages = [...pages];
    newPages[index].selected = !newPages[index].selected;
    setPages(newPages);
  };

  const toggleGroup = (type: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedGroups(newExpanded);
  };

  const getFilteredPages = () => {
    let filtered = pages;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.url.toLowerCase().includes(query) ||
          (p.title && p.title.toLowerCase().includes(query))
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((p) => p.type === filterType);
    }

    return filtered;
  };

  const getPagesByType = () => {
    const filtered = getFilteredPages();
    const grouped: Record<string, CrawledPage[]> = {};

    filtered.forEach((page) => {
      if (!grouped[page.type]) {
        grouped[page.type] = [];
      }
      grouped[page.type].push(page);
    });

    return grouped;
  };

  const handleGenerateFromGap = (gap: string) => {
    setDraftGapTopic(gap);
    setActiveView("production");
  };

  const handlePlanGap = (gap: string) => {
    setActiveView("planner");
  };

  const handleQuickAction = (action: "draft" | "gaps") => {
    if (action === "draft") {
      setActiveView("production");
    } else {
      if (!analysisOutput) {
        setError("Please run an analysis first to identify content gaps.");
      }
    }
  };

  const handleLoadHistory = (analysis: RecentAnalysis) => {
    setActiveView("analysis");
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const pagesByType = getPagesByType();
  const selectedCount = pages.filter((p) => p.selected).length;

  const renderAnalysisView = () => {
    if (analysisOutput) {
      return (
        <ContentStrategyDashboard
          analysisOutput={analysisOutput}
          isLoading={isLoading}
          onRefresh={handleAnalysis}
        />
      );
    }

    if (pages.length === 0 && !isCrawling && !isLoading) {
      return (
        <div className="py-8">
          <EmptyStateOnboarding
            recentAnalyses={recentAnalyses}
            onStartAnalysis={handleCrawl}
            onLoadHistory={handleLoadHistory}
            onQuickAction={handleQuickAction}
          />
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Website URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://example.com"
                  disabled={isCrawling}
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:opacity-50"
                />
                <button
                  onClick={() => handleCrawl()}
                  disabled={isCrawling || !baseUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isCrawling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Crawling...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Auto Crawl
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Progress Stepper */}
            {isCrawling && (
              <ProgressStepper mode="crawl" progress={crawlProgress} currentStep={crawlStep} />
            )}

            {isLoading && !isCrawling && (
              <ProgressStepper mode="analyze" progress={analysisProgress} currentStep={analysisStep} />
            )}

            {/* Smart Select Summary */}
            {pages.length > 0 && !isCrawling && !isLoading && (
              <>
                <SmartSelectSummary
                  pages={pages}
                  onSelectType={handleSelectType}
                  onSelectRecommended={handleSelectRecommended}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                />

                {/* Detailed Page List */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
                  {Object.entries(pagesByType).map(([type, typePages]) => (
                    <div key={type}>
                      <div
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                        onClick={() => toggleGroup(type)}
                      >
                        <div className="flex items-center gap-3">
                          {expandedGroups.has(type) ? (
                            <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          )}
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              type === "service"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : type === "blog"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : type === "product"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {typePages.length} pages
                          </span>
                        </div>
                      </div>

                      {expandedGroups.has(type) && (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                          {typePages.map((page) => {
                            const globalIndex = pages.indexOf(page);
                            return (
                              <div
                                key={page.url}
                                className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                              >
                                <button
                                  onClick={() => togglePageSelection(globalIndex)}
                                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    page.selected
                                      ? "bg-blue-600 border-blue-600"
                                      : "border-slate-300 dark:border-slate-600 hover:border-blue-400"
                                  }`}
                                >
                                  {page.selected && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                    {page.title || page.url}
                                  </p>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                    {page.url}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">Error</p>
                    <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {pages.length > 0 && !isCrawling && !isLoading && (
              <button
                onClick={handleAnalysis}
                disabled={isLoading || selectedCount === 0}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Start Analysis ({selectedCount} pages)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDashboardView = () => {
    if (!analysisOutput) {
      return (
        <div className="py-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No analysis data available. Please run an analysis first.
          </p>
          <button
            onClick={() => setActiveView("analysis")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Strategy Analysis
          </button>
        </div>
      );
    }

    const contentContext = analysisOutput.contentContext || {};
    const pagesData = analysisOutput.pages || [];
    const totalWordCount = pagesData.reduce((sum: number, p: any) => sum + (p.wordCount || 0), 0);
    const avgWordCount = pagesData.length > 0 ? Math.round(totalWordCount / pagesData.length) : 0;

    return (
      <div className="py-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          SEO Dashboard
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Score */}
          <SEOHealthScore
            totalPages={pagesData.length}
            avgWordCount={avgWordCount}
            contentGapsCount={contentContext.contentGaps?.length || 0}
            keywordsCount={contentContext.dominantKeywords?.length || 0}
          />

          {/* Persona Card */}
          <PersonaCard
            audiencePersona={contentContext.audiencePersona}
            tone={contentContext.tone}
            writingStyle={contentContext.overallWritingStyle}
          />

          {/* Gap Analysis */}
          <div className="lg:col-span-1">
            <GapAnalysisCard
              gaps={contentContext.contentGaps || []}
              onGenerateSolution={handleGenerateFromGap}
              onPlanForLater={handlePlanGap}
            />
          </div>
        </div>

        {/* Full Dashboard */}
        <ContentStrategyDashboard
          analysisOutput={analysisOutput}
          isLoading={isLoading}
          onRefresh={handleAnalysis}
        />
      </div>
    );
  };

  const renderProductionView = () => {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Content Production
        </h2>
        <AutoContentEngineSplit />
      </div>
    );
  };

  const renderPlannerView = () => {
    const contentContext = analysisOutput?.contentContext || {};
    return (
      <PlannerView
        contentGaps={contentContext.contentGaps || []}
        aiSuggestions={analysisOutput?.aiSuggestions || []}
        contentContext={contentContext}
      />
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboardView();
      case "analysis":
        return renderAnalysisView();
      case "production":
        return renderProductionView();
      case "planner":
        return renderPlannerView();
      default:
        return renderAnalysisView();
    }
  };

  return (
    <SidebarLayout activeView={activeView} onViewChange={handleViewChange}>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">{renderContent()}</div>
      </div>
    </SidebarLayout>
  );
}
