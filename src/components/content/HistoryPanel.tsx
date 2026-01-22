"use client";

import { useState, useEffect } from "react";
import { 
  History, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ExternalLink,
  Calendar,
  Globe,
  FileText,
  Search,
  Bug,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface CrawlHistoryItem {
  id: string;
  domain: string;
  url: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  pagesFound?: number;
  maxPages: number;
  createdAt: string;
  completedAt?: string;
  triggerRunId?: string;
  crawlData?: any;
  pagesData?: any;
}

interface AnalysisHistoryItem {
  id: string;
  domain: string;
  url: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  pagesAnalyzed?: number;
  createdAt: string;
  completedAt?: string;
  crawlRequestId?: string;
  analysisOutput?: any;
}

interface HistoryPanelProps {
  onSelectCrawlHistory?: (item: CrawlHistoryItem) => void;
  onSelectAnalysisHistory?: (item: AnalysisHistoryItem) => void;
  currentDomain?: string;
}

export default function HistoryPanel({ onSelectCrawlHistory, onSelectAnalysisHistory, currentDomain }: HistoryPanelProps) {
  const [crawlHistory, setCrawlHistory] = useState<CrawlHistoryItem[]>([]);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'crawls' | 'analyses'>('crawls');
  const [expandedCrawl, setExpandedCrawl] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load both crawl and analysis history
      const [crawlResponse, analysisResponse] = await Promise.all([
        fetch('/api/history/crawl'),
        fetch('/api/content/history')
      ]);

      if (!crawlResponse.ok || !analysisResponse.ok) {
        throw new Error('Failed to load history');
      }

      const crawlData = await crawlResponse.json();
      const analysisData = await analysisResponse.json();

      // Transform crawl data
      const transformedCrawlHistory: CrawlHistoryItem[] = crawlData.crawlHistory.map((item: any) => ({
        id: item.id,
        domain: item.domain,
        url: item.url,
        status: item.status,
        pagesFound: item.pagesFound,
        maxPages: item.maxPages,
        createdAt: item.createdAt,
        completedAt: item.completedAt,
        triggerRunId: item.triggerRunId,
        crawlData: item.crawlData,
        pagesData: item.pagesData,
      }));

      // Transform analysis data
      const transformedAnalysisHistory: AnalysisHistoryItem[] = analysisData.analyses.map((item: any) => ({
        id: item.id,
        domain: item.domain,
        url: item.baseUrl,
        status: item.status,
        pagesAnalyzed: item.pagesAnalyzed,
        createdAt: item.createdAt,
        completedAt: item.completedAt,
        crawlRequestId: item.crawlRequestId,
        analysisOutput: item.analysisOutput,
      }));

      setCrawlHistory(transformedCrawlHistory);
      setAnalysisHistory(transformedAnalysisHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "FAILED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "RUNNING":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-900/20";
      case "FAILED":
        return "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-900/20";
      case "RUNNING":
        return "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/20";
      default:
        return "text-gray-700 bg-gray-50 dark:text-gray-300 dark:bg-gray-900/20";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCrawlClick = (item: CrawlHistoryItem) => {
    if (item.status === "COMPLETED" && item.pagesData) {
      onSelectCrawlHistory?.(item);
    }
  };

  const handleAnalysisClick = (item: AnalysisHistoryItem) => {
    console.log("[HistoryPanel] Analysis clicked:", item);
    if (item.status === "COMPLETED" && item.analysisOutput) {
      console.log("[HistoryPanel] Loading analysis output");
      onSelectAnalysisHistory?.(item);
    } else {
      console.log("[HistoryPanel] Analysis not completed or no output:", {
        status: item.status,
        hasOutput: !!item.analysisOutput,
        outputKeys: item.analysisOutput ? Object.keys(item.analysisOutput) : null
      });
    }
  };

  const toggleCrawlExpansion = (crawlId: string) => {
    setExpandedCrawl(expandedCrawl === crawlId ? null : crawlId);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            History
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-slate-600 dark:text-slate-400">Loading history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            History
          </h3>
        </div>
        <div className="text-center py-8">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadHistory}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            History
          </h3>
        </div>
        <button
          onClick={loadHistory}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab('crawls')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'crawls'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Crawls ({crawlHistory.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('analyses')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'analyses'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Analyses ({analysisHistory.length})
          </div>
        </button>
      </div>

      {/* Crawl History */}
      {activeTab === 'crawls' && (
        <div className="space-y-3">
          {crawlHistory.length === 0 ? (
            <div className="text-center py-8">
              <Bug className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No crawl history found</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                Start your first crawl to see it here
              </p>
            </div>
          ) : (
            crawlHistory.map((item) => (
              <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg">
                <div
                  className={`p-4 ${item.status === "COMPLETED" && item.pagesData ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''} transition-colors`}
                  onClick={() => item.status === "COMPLETED" && item.pagesData && handleCrawlClick(item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {item.domain}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        {item.status === "COMPLETED" && item.pagesData && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            Click to load pages
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.createdAt)}
                        </div>
                        {item.pagesFound && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {item.pagesFound}/{item.maxPages} pages
                          </div>
                        )}
                        {item.triggerRunId && (
                          <div className="flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            <span className="text-xs">ID: {item.triggerRunId.slice(0, 8)}...</span>
                          </div>
                        )}
                      </div>

                      {item.completedAt && (
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                          Completed: {formatDate(item.completedAt)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center ml-4">
                      {getStatusIcon(item.status)}
                      {item.pagesData && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCrawlExpansion(item.id);
                          }}
                          className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {expandedCrawl === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedCrawl === item.id && item.pagesData && (
                  <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="pt-3">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Crawled Pages ({item.pagesData?.length || 0})
                      </p>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {item.pagesData?.slice(0, 10).map((page: any, index: number) => (
                          <div key={index} className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            • {page.url || page}
                          </div>
                        ))}
                        {item.pagesData?.length > 10 && (
                          <div className="text-xs text-slate-500 dark:text-slate-500">
                            ... and {item.pagesData.length - 10} more pages
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Analysis History */}
      {activeTab === 'analyses' && (
        <div className="space-y-3">
          {analysisHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No analysis history found</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                Start your first analysis to see it here
              </p>
            </div>
          ) : (
            analysisHistory.map((item) => (
              <div
                key={item.id}
                className={`p-4 border border-slate-200 dark:border-slate-700 rounded-lg transition-all ${item.status === "COMPLETED" && item.analysisOutput ? 'hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {item.domain}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </div>
                      {item.pagesAnalyzed && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {item.pagesAnalyzed} pages analyzed
                        </div>
                      )}
                    </div>

                    {item.completedAt && (
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                        Completed: {formatDate(item.completedAt)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {getStatusIcon(item.status)}
                    {item.status === "COMPLETED" && item.analysisOutput && (
                      <button
                        onClick={() => handleAnalysisClick(item)}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Load Strategy
                      </button>
                    )}
                    {item.status === "COMPLETED" && !item.analysisOutput && (
                      <span className="text-xs text-slate-500 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                        Processing...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Summary */}
      {(crawlHistory.length > 0 || analysisHistory.length > 0) && (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing {crawlHistory.length} crawls and {analysisHistory.length} analyses
          </p>
        </div>
      )}
    </div>
  );
}
