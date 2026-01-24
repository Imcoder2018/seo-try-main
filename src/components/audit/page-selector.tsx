"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";

interface PageData {
  url: string;
  status: number;
  title?: string;
  depth: number;
  internalLinkCount: number;
  isNavigation: boolean;
}

interface UrlGroups {
  core: string[];
  blog: string[];
  product: string[];
  service: string[];
  category: string[];
  other: string[];
}

interface TopLinkedPage {
  url: string;
  linkCount: number;
}

interface CrawlResult {
  baseUrl: string;
  pagesFound: number;
  pages: PageData[];
  urlGroups: UrlGroups;
  topLinkedPages: TopLinkedPage[];
}

interface PageSelectorProps {
  crawlResult: CrawlResult;
  onSelectionChange: (selectedUrls: string[]) => void;
  onRunAudit: (useFrontend: boolean) => void;
  isRunningAudit: boolean;
  auditProgress?: number;
  auditStatus?: string;
}

export function PageSelector({ crawlResult, onSelectionChange, onRunAudit, isRunningAudit, auditProgress = 0, auditStatus = "" }: PageSelectorProps) {
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["core", "blog", "product", "category", "top-linked"]));
  const [useFrontendProcessing, setUseFrontendProcessing] = useState(false);
  const initializedRef = useRef(false);
  const onSelectionChangeRef = useRef(onSelectionChange);
  
  // Keep the ref updated
  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  // Auto-select pages based on priority strategy - only run once on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    const autoSelected = new Set<string>();

    // Priority 1: Must-audit core pages
    crawlResult.urlGroups.core.forEach(url => autoSelected.add(url));

    // Priority 2: Template representatives (3-5 from each group) - use stable selection
    const selectRepresentatives = (urls: string[], count: number) => {
      // Sort alphabetically for stable selection instead of random
      const sorted = [...urls].sort();
      sorted.slice(0, count).forEach(url => autoSelected.add(url));
    };

    selectRepresentatives(crawlResult.urlGroups.blog, 3);
    selectRepresentatives(crawlResult.urlGroups.service, 5);
    selectRepresentatives(crawlResult.urlGroups.product, 5);
    selectRepresentatives(crawlResult.urlGroups.category, 3);

    // Priority 3: Top linked pages (navigation links and high internal link count)
    crawlResult.topLinkedPages.slice(0, 5).forEach(page => autoSelected.add(page.url));

    // Also add navigation pages
    crawlResult.pages.filter(p => p.isNavigation).slice(0, 5).forEach(page => autoSelected.add(page.url));

    setSelectedUrls(autoSelected);
    onSelectionChangeRef.current(Array.from(autoSelected));
  }, [crawlResult]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const toggleUrl = (url: string) => {
    setSelectedUrls(prev => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      onSelectionChange(Array.from(newSet));
      return newSet;
    });
  };

  const toggleGroupSelection = (urls: string[]) => {
    const allSelected = urls.every(url => selectedUrls.has(url));
    setSelectedUrls(prev => {
      const newSet = new Set(prev);
      urls.forEach(url => {
        if (allSelected) {
          newSet.delete(url);
        } else {
          newSet.add(url);
        }
      });
      onSelectionChange(Array.from(newSet));
      return newSet;
    });
  };

  const selectAll = () => {
    const allUrls = crawlResult.pages.map(p => p.url);
    setSelectedUrls(new Set(allUrls));
    onSelectionChange(allUrls);
  };

  const clearAll = () => {
    setSelectedUrls(new Set());
    onSelectionChange([]);
  };

  const getPageTitle = (page: PageData) => {
    return page.title || new URL(page.url).pathname;
  };

  const getGroupLabel = (groupName: string) => {
    const labels: Record<string, { label: string; description: string }> = {
      "core": { label: "🏠 Core Pages", description: "Must-audit: Home, Contact, About, Terms" },
      "blog": { label: "📝 Blog Posts", description: "Template representative sample" },
      "service": { label: "⚙️ Service Pages", description: "Money pages: services and solutions" },
      "product": { label: "🛍️ Product Pages", description: "Template representative sample" },
      "category": { label: "📂 Categories", description: "Template representative sample" },
      "other": { label: "📄 Other Pages", description: "Additional pages" },
      "top-linked": { label: "🔗 Top Linked Pages", description: "High authority pages" },
    };
    return labels[groupName] || { label: groupName, description: "" };
  };

  const getGroupUrls = (groupName: string): string[] => {
    if (groupName === "top-linked") {
      return crawlResult.topLinkedPages.map(p => p.url);
    }
    return crawlResult.urlGroups[groupName as keyof UrlGroups] || [];
  };

  const totalSelected = selectedUrls.size;
  const totalPages = crawlResult.pagesFound;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Select Pages to Audit</h2>
            <p className="text-sm text-gray-600 mt-1">
              Found {totalPages} pages. {totalSelected} selected for audit.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Selection Strategy Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-1">Representative Sampling Strategy</h3>
              <p className="text-sm text-blue-800">
                We've auto-selected pages based on SEO best practices. Core pages are always included.
                For template-based pages (blogs, products), we audit a representative sample to identify
                template-level issues that affect all pages.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Groups */}
      <div className="space-y-4">
        {["core", "service", "blog", "product", "category", "top-linked", "other"].map(groupName => {
          const groupUrls = getGroupUrls(groupName);
          if (groupUrls.length === 0) return null;

          const isExpanded = expandedGroups.has(groupName);
          const groupSelectedCount = groupUrls.filter(url => selectedUrls.has(url)).length;
          const { label, description } = getGroupLabel(groupName);

          return (
            <div key={groupName} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Group Header */}
              <div className="w-full px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGroupSelection(groupUrls);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    type="button"
                  >
                    {groupSelectedCount === groupUrls.length ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : groupSelectedCount > 0 ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleGroup(groupName)}
                    className="flex-1 text-left hover:opacity-80 transition-opacity"
                    type="button"
                  >
                    <div className="font-medium text-gray-900">{label}</div>
                    <div className="text-sm text-gray-600">{description}</div>
                  </button>
                </div>
                <button
                  onClick={() => toggleGroup(groupName)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  type="button"
                >
                  <span className="text-sm text-gray-600">
                    {groupSelectedCount}/{groupUrls.length} selected
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Group Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 divide-y divide-gray-100">
                  {groupUrls.map(url => {
                    const page = crawlResult.pages.find(p => p.url === url);
                    const isSelected = selectedUrls.has(url);
                    const topLinkedData = crawlResult.topLinkedPages.find(p => p.url === url);

                    return (
                      <div key={url} className="px-6 py-3 hover:bg-gray-50">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleUrl(url)}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 truncate">
                                {page ? getPageTitle(page) : new URL(url).pathname}
                              </span>
                              {page?.isNavigation && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                                  Nav
                                </span>
                              )}
                              {topLinkedData && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                                  {topLinkedData.linkCount} links
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 truncate mt-1">{url}</div>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Run Audit Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        {/* Processing Mode Toggle */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">Processing Mode</span>
              <p className="text-xs text-gray-500 mt-0.5">
                {useFrontendProcessing 
                  ? "Process in browser (faster, no server queues)" 
                  : "Process via Trigger.dev (default, background processing)"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setUseFrontendProcessing(!useFrontendProcessing)}
              disabled={isRunningAudit}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                useFrontendProcessing ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  useFrontendProcessing ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded ${!useFrontendProcessing ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>
              🔧 Trigger.dev
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${useFrontendProcessing ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>
              🌐 Frontend
            </span>
          </div>
        </div>

        {isRunningAudit && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {useFrontendProcessing ? '🌐 ' : '🔧 '}
                {auditStatus || "Analyzing pages..."}
              </span>
              <span className="text-sm font-medium text-blue-600">{auditProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  useFrontendProcessing 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}
                style={{ width: `${auditProgress}%` }}
              />
            </div>
          </div>
        )}
        <button
          onClick={() => onRunAudit(useFrontendProcessing)}
          disabled={selectedUrls.size === 0 || isRunningAudit}
          className={`w-full px-6 py-3 font-semibold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${
            useFrontendProcessing
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRunningAudit ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {useFrontendProcessing ? '🌐 Frontend' : '🔧 Trigger.dev'} Audit Running on {totalSelected} Pages...
            </span>
          ) : (
            <span>
              {useFrontendProcessing ? '🌐 Run Frontend Audit' : '🔧 Run Trigger.dev Audit'} on {totalSelected} Pages
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
