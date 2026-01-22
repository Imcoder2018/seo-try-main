"use client";

import { useState, useEffect } from "react";
import ContentStrategyDashboard from "@/components/content/content-strategy-dashboard";
import HistoryPanel from "@/components/content/HistoryPanel";
import AutoContentEngine from "@/components/content/AutoContentEngine";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronRight,
  Search,
  Filter,
  History,
  ArrowLeft,
  Zap,
  BarChart3
} from "lucide-react";

interface CrawledPage {
  url: string;
  type: string;
  title?: string;
  selected?: boolean;
}

export default function ContentStrategyPage() {
  const [analysisOutput, setAnalysisOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [pages, setPages] = useState<CrawledPage[]>([]);
  const [crawlRunId, setCrawlRunId] = useState<string | null>(null);
  const [crawlPublicToken, setCrawlPublicToken] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['service', 'blog']));
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("analysis");

  const handleCrawl = async () => {
    if (!baseUrl) {
      setError("Please enter a website URL");
      return;
    }

    setIsCrawling(true);
    setError(null);
    setPages([]);

    try {
      // Start crawl
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: baseUrl, maxPages: 50 })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start crawl');
      }

      setCrawlRunId(data.runId);
      setCrawlPublicToken(data.publicToken);

      // Poll for crawl completion
      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const pollResponse = await fetch(
          `/api/crawl?runId=${data.runId}&publicToken=${data.publicToken}`
        );

        const pollData = await pollResponse.json();

        if (pollData.status === 'COMPLETED') {
          // Use urlGroups from crawler output for proper categorization
          const urlGroups = pollData.output?.urlGroups || {};
          const allPages = pollData.output?.pages || [];
          
          // Build pages array with proper types and auto-selection
          const pagesWithSelection: CrawledPage[] = [];
          
          // Map urlGroups to individual pages with types
          const typeMapping: Record<string, string> = {
            core: 'other',
            blog: 'blog',
            product: 'product',
            service: 'service',
            category: 'other',
            other: 'other'
          };
          
          // Process each group
          Object.entries(urlGroups).forEach(([groupType, urls]) => {
            const pageType = typeMapping[groupType] || 'other';
            const shouldAutoSelect = ['service', 'blog'].includes(pageType);
            
            (urls as string[]).forEach((url: string) => {
              const pageData = allPages.find((p: any) => p.url === url);
              pagesWithSelection.push({
                url,
                type: pageType,
                title: pageData?.title || '',
                selected: shouldAutoSelect
              });
            });
          });
          
          setPages(pagesWithSelection);
          setIsCrawling(false);
          return;
        } else if (pollData.status === 'FAILED' || pollData.status === 'CANCELED') {
          throw new Error(`Crawl failed with status: ${pollData.status}`);
        }

        attempts++;
      }

      throw new Error('Crawl timed out');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during crawl');
      setIsCrawling(false);
    }
  };

  const handleAnalysis = async () => {
    const selectedPages = pages.filter(p => p.selected);

    if (selectedPages.length === 0) {
      setError("Please select at least one page to analyze");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting analysis with', selectedPages.length, 'pages');
      
      // Start analysis
      const response = await fetch('/api/content/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl,
          pages: selectedPages.map(p => ({ url: p.url, type: p.type })),
          maxPages: 50,
          targetAudience: "General audience"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to start analysis';
        const details = data.details ? `\n\nDetails: ${data.details}` : '';
        throw new Error(errorMsg + details);
      }

      console.log('Analysis started:', data);

      // Poll for results
      let attempts = 0;
      const maxAttempts = 90; // Increased timeout to 3 minutes

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const pollResponse = await fetch(
          `/api/content/analyze?extractionRunId=${data.extractionRunId}&analysisRunId=${data.analysisRunId}&analysisId=${data.analysisId}`
        );

        const pollData = await pollResponse.json();

        console.log('Poll attempt', attempts + 1, ':', {
          extractionStatus: pollData.extractionStatus,
          analysisStatus: pollData.analysisStatus,
          isComplete: pollData.isComplete,
          hasFailed: pollData.hasFailed
        });

        // Check for failures
        if (pollData.hasFailed) {
          const errorMsg = pollData.extractionError || pollData.analysisError || 'Analysis failed';
          throw new Error(errorMsg);
        }

        // Check for completion
        if (pollData.isComplete && pollData.analysisOutput) {
          console.log('Analysis complete!');
          setAnalysisOutput(pollData.analysisOutput);
          setIsLoading(false);
          return;
        }

        attempts++;
      }

      throw new Error('Analysis timed out after 3 minutes. Please try again.');

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const handleCrawlHistorySelect = (crawlItem: any) => {
    // Load pages from crawl history
    if (crawlItem.pagesData) {
      const transformedPages = crawlItem.pagesData.map((page: any) => ({
        url: page.url || page,
        type: page.type || 'unknown',
        title: page.title || '',
        selected: true, // Default to selected for convenience
      }));
      
      setPages(transformedPages);
      setBaseUrl(crawlItem.url);
      setShowHistory(false);
      setIsCrawling(false);
    }
  };

  const handleAnalysisHistorySelect = (analysisItem: any) => {
    // Load analysis output from history
    console.log("[ContentStrategy] Loading analysis from history:", analysisItem);
    if (analysisItem.analysisOutput) {
      console.log("[ContentStrategy] Setting analysis output");
      setAnalysisOutput(analysisItem.analysisOutput);
      setShowHistory(false);
      setIsLoading(false);
    } else {
      console.log("[ContentStrategy] No analysis output found in item");
    }
  };

  const handleHistorySelect = (historyItem: any) => {
    // Legacy handler - determine type based on available data
    if (historyItem.pagesData) {
      handleCrawlHistorySelect(historyItem);
    } else if (historyItem.analysisOutput) {
      handleAnalysisHistorySelect(historyItem);
    } else {
      // Fallback to URL loading
      setBaseUrl(historyItem.url);
      setShowHistory(false);
    }
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

  const selectAllInGroup = (type: string, selected: boolean) => {
    const newPages = pages.map(p => 
      p.type === type ? { ...p, selected } : p
    );
    setPages(newPages);
  };

  const getFilteredPages = () => {
    let filtered = pages;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.url.toLowerCase().includes(query) ||
        (p.title && p.title.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType);
    }

    return filtered;
  };

  const getPagesByType = () => {
    const filtered = getFilteredPages();
    const grouped: Record<string, CrawledPage[]> = {};

    filtered.forEach(page => {
      if (!grouped[page.type]) {
        grouped[page.type] = [];
      }
      grouped[page.type].push(page);
    });

    return grouped;
  };

  const pagesByType = getPagesByType();
  const selectedCount = pages.filter(p => p.selected).length;
  const filteredPages = getFilteredPages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Navigation */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Content Strategy Hub
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Comprehensive content analysis and AI-powered content generation tools
          </p>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("analysis")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "analysis"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Content Analysis
            </button>
            <button
              onClick={() => setActiveTab("auto-content")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "auto-content"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Auto-Content Engine
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="ml-auto px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
            >
              <History className="w-4 h-4 inline mr-2" />
              History
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "analysis" && (
          !analysisOutput ? (
            <div className="max-w-6xl mx-auto px-4 py-12">
              {showHistory ? (
                <div className="mb-6">
                  <button
                    onClick={() => setShowHistory(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Analysis
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      Content Strategy Analysis
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                      Analyze your website content to identify gaps, keywords, and AI-powered content suggestions
                    </p>
                  </div>
                  <button
                    onClick={() => setShowHistory(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                  >
                    <History className="w-4 h-4" />
                    History
                  </button>
                </div>
              )}

              {showHistory ? (
                <HistoryPanel 
                  onSelectCrawlHistory={handleCrawlHistorySelect}
                  onSelectAnalysisHistory={handleAnalysisHistorySelect}
                />
              ) : (
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
                          className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                          onClick={handleCrawl}
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

                    {/* Crawl Progress */}
                    {isCrawling && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              Crawling website...
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              Discovering and categorizing pages. This may take 30-60 seconds.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pages Selection */}
                    {pages.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Pages to Analyze
                            </label>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {selectedCount} of {pages.length} pages selected
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search pages..."
                              className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                            />
                            <select
                              value={filterType}
                              onChange={(e) => setFilterType(e.target.value)}
                              className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                            >
                              <option value="all">All Types</option>
                              <option value="service">Services</option>
                              <option value="blog">Blogs</option>
                              <option value="product">Products</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

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
                                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    type === 'service' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                    type === 'blog' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                    type === 'product' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                    'bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-300'
                                  }`}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                  </span>
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {typePages.length} pages
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); selectAllInGroup(type, true); }}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                  >
                                    Select All
                                  </button>
                                  <span className="text-slate-400 dark:text-slate-600">|</span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); selectAllInGroup(type, false); }}
                                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                  >
                                    Deselect All
                                  </button>
                                </div>
                              </div>

                              {expandedGroups.has(type) && (
                                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                  {typePages.map((page, index) => {
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
                                              ? 'bg-blue-600 border-blue-600'
                                              : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
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
                      </div>
                    )}

                    {error && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">Error</p>
                            <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleAnalysis}
                      disabled={isLoading || pages.length === 0 || selectedCount === 0}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Start Analysis ({selectedCount} pages)
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                      Quick Start Guide
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-2 text-sm">
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong>Step 1:</strong> Enter your website URL (e.g., https://datatechconsultants.com.au)
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong>Step 2:</strong> Click "Auto Crawl" to discover all pages automatically
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong>Step 3:</strong> Review auto-selected pages (services and blogs are pre-selected)
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong>Step 4:</strong> Modify selection if needed (add/remove pages)
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong>Step 5:</strong> Click "Start Analysis" and wait 30-120 seconds
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong>Step 6:</strong> View your content strategy dashboard with AI insights
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <ContentStrategyDashboard
              analysisOutput={analysisOutput}
              isLoading={isLoading}
              onRefresh={handleAnalysis}
            />
          )
        )}

        {activeTab === "auto-content" && (
          <AutoContentEngine />
        )}

        {/* History Modal */}
        {showHistory && activeTab === "analysis" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Analysis History
                  </h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <HistoryPanel 
                  onSelectCrawlHistory={handleCrawlHistorySelect}
                  onSelectAnalysisHistory={handleAnalysisHistorySelect}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
