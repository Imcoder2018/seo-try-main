"use client";

import { useState, useEffect } from "react";
import { Loader2, Globe, CheckCircle, XCircle, FileSearch, Link2 } from "lucide-react";

interface CrawlProgressProps {
  taskId: string;
  onComplete: (result: CrawlResult) => void;
  onError: (error: string) => void;
}

interface CrawlResult {
  baseUrl: string;
  pagesFound: number;
  pages: Array<{
    url: string;
    status: number;
    title?: string;
    links: string[];
    error?: string;
  }>;
  sitemapUrls: string[];
  errors: string[];
}

interface TaskStatus {
  taskId: string;
  status: string;
  output?: CrawlResult;
  metadata?: {
    status?: {
      progress: number;
      label: string;
      pagesFound: number;
    };
  };
}

export function CrawlProgress({ taskId, onComplete, onError }: CrawlProgressProps) {
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentLabel, setCurrentLabel] = useState("Starting crawl...");
  const [pagesFound, setPagesFound] = useState(0);

  useEffect(() => {
    if (!taskId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/crawl/status?taskId=${taskId}`);
        if (!response.ok) throw new Error("Failed to fetch status");
        
        const data: TaskStatus = await response.json();
        setStatus(data);

        // Update progress from metadata
        if (data.metadata?.status) {
          setProgress(data.metadata.status.progress);
          setCurrentLabel(data.metadata.status.label);
          setPagesFound(data.metadata.status.pagesFound);
        }

        // Check if completed
        if (data.status === "COMPLETED" && data.output) {
          clearInterval(pollInterval);
          onComplete(data.output);
        } else if (data.status === "FAILED" || data.status === "CRASHED") {
          clearInterval(pollInterval);
          onError("Crawl failed. Please try again.");
        }
      } catch (err) {
        console.error("Poll error:", err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [taskId, onComplete, onError]);

  return (
    <div className="bg-white rounded-xl border shadow-lg p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-10 h-10 text-blue-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Crawling Website</h2>
        <p className="text-gray-500 mt-2">Discovering and analyzing pages...</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-gray-700">{currentLabel}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <FileSearch className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-700">{pagesFound}</p>
          <p className="text-sm text-blue-600">Pages Found</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Link2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-700">
            {status?.status === "EXECUTING" ? "Active" : status?.status || "Starting"}
          </p>
          <p className="text-sm text-purple-600">Status</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        This may take 1-2 minutes depending on the size of your website.
      </p>
    </div>
  );
}

// Crawl Results Display Component
export function CrawlResults({ result }: { result: CrawlResult }) {
  const successPages = result.pages.filter(p => p.status >= 200 && p.status < 400);
  const errorPages = result.pages.filter(p => p.status >= 400 || p.error);

  return (
    <div className="bg-white rounded-xl border shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-green-600" />
        Crawl Complete
      </h3>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-700">{result.pagesFound}</p>
          <p className="text-sm text-green-600">Total Pages</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-blue-700">{successPages.length}</p>
          <p className="text-sm text-blue-600">Successful</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-red-700">{errorPages.length}</p>
          <p className="text-sm text-red-600">Errors</p>
        </div>
      </div>

      {/* Pages List */}
      <div className="max-h-80 overflow-y-auto">
        <h4 className="font-medium mb-2">Discovered Pages</h4>
        <div className="space-y-2">
          {result.pages.slice(0, 20).map((page, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {page.status >= 200 && page.status < 400 ? (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
                <span className="truncate">{page.title || page.url}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${
                page.status >= 200 && page.status < 400 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {page.status || "Error"}
              </span>
            </div>
          ))}
          {result.pages.length > 20 && (
            <p className="text-gray-400 text-center text-sm py-2">
              + {result.pages.length - 20} more pages
            </p>
          )}
        </div>
      </div>

      {/* Sitemap URLs */}
      {result.sitemapUrls.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Sitemap URLs Found: {result.sitemapUrls.length}</h4>
        </div>
      )}
    </div>
  );
}
