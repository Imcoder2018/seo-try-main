"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Users, 
  Target, 
  BookOpen, 
  Lightbulb, 
  FileText, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Download,
  RefreshCw,
  Loader2,
  X,
  Copy,
  ChevronDown,
  ChevronUp,
  Globe,
  Calendar as CalendarIcon,
  Zap,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileSearch,
  BarChart3,
  Filter,
  Search,
  Maximize2,
  Info
} from "lucide-react";
import PlannerView from "./PlannerView";

interface Keyword {
  term: string;
  density: "High" | "Medium" | "Low";
  pages: number;
}

interface ContentContext {
  dominantKeywords: Keyword[];
  contentGaps: string[];
  audiencePersona: string;
  tone: string;
}

interface AISuggestion {
  type: "Blog Post" | "Whitepaper" | "Case Study" | "Guide" | "Infographic";
  title: string;
  reason: string;
  targetKeywords: string[];
  relatedServiceUrl?: string;
}

interface AnalysisOutput {
  baseUrl: string;
  contentContext: ContentContext;
  aiSuggestions: AISuggestion[];
  pages: Array<{
    url: string;
    type: string;
    title?: string;
    wordCount: number;
    mainTopic?: string;
    summary?: string;
    keywords?: string[];
    content?: string;
  }>;
  extractionData?: {
    baseUrl: string;
    pagesProcessed: number;
    extractedPages: Array<{
      url: string;
      type: "service" | "blog" | "product" | "other";
      title?: string;
      content: string;
      wordCount: number;
      mainTopic?: string;
      summary?: string;
    }>;
    aggregatedContent: {
      services: string[];
      blogs: string[];
      products: string[];
    };
    totalWordCount: number;
  };
}

interface ContentStrategyDashboardProps {
  analysisOutput: AnalysisOutput | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export default function ContentStrategyDashboard({ 
  analysisOutput, 
  isLoading = false,
  onRefresh 
}: ContentStrategyDashboardProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "gaps" | "pages" | "details" | "suggestions" | "planner">("overview");
  const [selectedGap, setSelectedGap] = useState<string | null>(null);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [draftSuggestion, setDraftSuggestion] = useState<AISuggestion | null>(null);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [draftActionDropdown, setDraftActionDropdown] = useState<string | null>(null);
  
  // Smart Draft modal state
  const [draftStep, setDraftStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<string>("");
  const [customServiceUrl, setCustomServiceUrl] = useState<string>("");
  const [showCustomUrlInput, setShowCustomUrlInput] = useState<boolean>(false);
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [currentKeywordInput, setCurrentKeywordInput] = useState("");
  const [generatedOutline, setGeneratedOutline] = useState("");
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState("");
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string>("professional");

  // Page Analysis state
  const [pageSortField, setPageSortField] = useState<'title' | 'type' | 'wordCount'>('wordCount');
  const [pageSortDirection, setPageSortDirection] = useState<'asc' | 'desc'>('desc');
  const [pageFilterType, setPageFilterType] = useState<'all' | 'service' | 'blog'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "educational", label: "Educational" },
    { value: "conversational", label: "Conversational" },
    { value: "urgent", label: "Urgent" },
    { value: "authoritative", label: "Authoritative" },
    { value: "friendly", label: "Friendly" },
  ];

  // Handle adding custom keywords
  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentKeywordInput.trim()) {
      e.preventDefault();
      if (!customKeywords.includes(currentKeywordInput.trim())) {
        setCustomKeywords([...customKeywords, currentKeywordInput.trim()]);
      }
      setCurrentKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setCustomKeywords(customKeywords.filter(k => k !== keyword));
  };

  // Generate AI outline
  const handleGenerateOutline = async () => {
    if (!draftSuggestion) return;
    
    setIsGeneratingOutline(true);
    try {
      let serviceContext = '';
      const serviceToPromote = customServiceUrl || selectedService;
      
      if (!customServiceUrl && selectedService) {
        const selectedServicePage = servicePages.find(
          p => (p.mainTopic || p.url.split('/').pop() || 'Service') === selectedService
        );
        serviceContext = selectedServicePage?.summary || selectedServicePage?.mainTopic || '';
      } else if (customServiceUrl) {
        serviceContext = customServiceUrl;
      }
      
      const response = await fetch('/api/content/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftSuggestion.title,
          aiKeywords: draftSuggestion.targetKeywords,
          userKeywords: customKeywords,
          promotedService: serviceToPromote,
          serviceContext: serviceContext,
          tone: contentContext.tone
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate outline');
      }

      const data = await response.json();
      setGeneratedOutline(data.outline);
      setDraftStep(2);
    } catch (error) {
      console.error('Error generating outline:', error);
      alert('Failed to generate outline. Please try again.');
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // Reset draft modal state
  const handleOpenDraftModal = (suggestion: AISuggestion) => {
    setDraftSuggestion(suggestion);
    setDraftStep(1);
    setCustomServiceUrl("");
    setShowCustomUrlInput(false);
    setCustomKeywords([]);
    setCurrentKeywordInput("");
    setGeneratedOutline("");
    
    if (suggestion.relatedServiceUrl) {
      const matchingService = servicePages.find(p => p.url === suggestion.relatedServiceUrl);
      if (matchingService) {
        setSelectedService(matchingService.mainTopic || matchingService.url.split('/').pop() || 'Service');
      } else {
        setSelectedService("");
      }
    } else {
      setSelectedService("");
    }
    
    createDraftFromSuggestion(suggestion);
    setDraftModalOpen(true);
  };

  const createDraftFromSuggestion = async (suggestion: AISuggestion) => {
    try {
      const response = await fetch('/api/drafts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: suggestion.title,
          outline: '',
          serviceUrl: suggestion.relatedServiceUrl || '',
          tone: contentContext?.tone || 'professional',
          keywords: suggestion.targetKeywords,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Draft created from suggestion:', data.draft.id);
        return data.draft.id;
      }
    } catch (error) {
      console.error('Error creating draft:', error);
    }
    return null;
  };

  const handleAutoPlanFromStrategy = async () => {
    setActiveTab("planner");
  };

  // Copy outline to clipboard
  const handleCopyOutline = () => {
    const fullOutline = `# ${draftSuggestion?.title}\n\n${generatedOutline}`;
    navigator.clipboard.writeText(fullOutline);
    alert('Outline copied to clipboard!');
  };

  // Generate full article
  const handleGenerateArticle = async () => {
    if (!draftSuggestion || !generatedOutline) return;
    
    setIsGeneratingArticle(true);
    setGeneratedArticle("");
    console.log("[Modal] Creating draft and redirecting to editor...");
    
    try {
      const serviceToPromote = customServiceUrl || selectedService;
      const allKeywords = [...(draftSuggestion.targetKeywords || []), ...customKeywords];
      
      console.log("[Modal] Creating draft with:", {
        title: draftSuggestion.title,
        hasOutline: !!generatedOutline,
        serviceUrl: serviceToPromote,
        tone: selectedTone,
        keywordsCount: allKeywords.length
      });
      
      const response = await fetch('/api/drafts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftSuggestion.title,
          outline: generatedOutline,
          serviceUrl: serviceToPromote,
          tone: selectedTone,
          keywords: allKeywords,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[Modal] Draft creation failed:", errorData);
        throw new Error(errorData.error || 'Failed to create draft');
      }

      const data = await response.json();
      console.log("[Modal] Draft created successfully:", data.draft.id);

      setDraftModalOpen(false);
      window.location.href = `/editor?id=${data.draft.id}`;
    } catch (error) {
      console.error('[Modal] Error creating draft:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create draft';
      alert(`Failed to create draft: ${errorMessage}. Please try again.`);
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  // Toggle page expansion in detailed view
  const togglePageExpansion = (pageUrl: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageUrl)) {
      newExpanded.delete(pageUrl);
    } else {
      newExpanded.add(pageUrl);
    }
    setExpandedPages(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Analyzing Content...
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            AI is extracting insights from your website content
          </p>
        </div>
      </div>
    );
  }

  if (!analysisOutput) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            No Analysis Data
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Start a content analysis to see your content strategy insights
          </p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Start Analysis
            </button>
          )}
        </div>
      </div>
    );
  }

  const { contentContext, aiSuggestions, pages, extractionData } = analysisOutput;

  // Debug data flow
  console.log('All Pages:', pages);
  console.log('Extraction Data:', extractionData);
  console.log('Content Context:', contentContext);

  // Calculate total pages from pages array
  const totalPages = pages?.length || 0;
  const totalWordCount = pages?.reduce((sum, page) => sum + (page.wordCount || 0), 0) || 0;

  // Extract service pages
  const servicePages = pages?.filter(p => {
    const typeLower = p.type?.toLowerCase() || '';
    const urlLower = p.url?.toLowerCase() || '';
    return (
      typeLower === 'service' ||
      typeLower === 'services' ||
      urlLower.includes('/services/') ||
      urlLower.includes('/solutions/') ||
      urlLower.includes('/service/')
    );
  }) || [];

  // Extract service names for dropdown options
  const allServices = servicePages
    .map(p => p.mainTopic || p.url.split('/').pop() || 'Service')
    .filter((value, index, self) => self.indexOf(value) === index);

  // Filter suggestions based on selected gap
  const filteredSuggestions = selectedGap
    ? aiSuggestions.filter(suggestion => 
        suggestion.reason.toLowerCase().includes(selectedGap.toLowerCase()) ||
        suggestion.targetKeywords.some(kw => kw.toLowerCase().includes(selectedGap.toLowerCase()))
      )
    : aiSuggestions;

  // Filter pages based on search and type
  const getFilteredPages = () => {
    let filtered = pages || [];
    
    if (searchQuery) {
      filtered = filtered.filter(page => 
        (page.mainTopic || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.summary || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (pageFilterType !== 'all') {
      filtered = filtered.filter(p => {
        const typeLower = p.type?.toLowerCase() || '';
        const urlLower = p.url?.toLowerCase() || '';
        
        if (pageFilterType === 'service') {
          return typeLower === 'service' || typeLower === 'services' || urlLower.includes('/services/');
        } else if (pageFilterType === 'blog') {
          return typeLower === 'blog' || urlLower.includes('/blog/');
        }
        return false;
      });
    }
    
    return filtered;
  };

  // Sort pages
  const getSortedPages = (pagesToSort: any[]) => {
    return [...pagesToSort].sort((a, b) => {
      let comparison = 0;
      if (pageSortField === 'title') {
        const titleA = a.mainTopic || a.title || a.url.split('/').pop() || '';
        const titleB = b.mainTopic || b.title || b.url.split('/').pop() || '';
        comparison = titleA.localeCompare(titleB);
      } else if (pageSortField === 'type') {
        comparison = (a.type || '').localeCompare(b.type || '');
      } else if (pageSortField === 'wordCount') {
        comparison = (a.wordCount || 0) - (b.wordCount || 0);
      }
      return pageSortDirection === 'asc' ? comparison : -comparison;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Content Strategy Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {analysisOutput.baseUrl} • {totalPages} pages analyzed • {totalWordCount.toLocaleString()} total words
              </p>
            </div>
            <div className="flex items-center gap-3">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              )}
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Users },
              { id: "keywords", label: "Keywords", icon: Target },
              { id: "gaps", label: "Content Gaps", icon: AlertCircle },
              { id: "pages", label: "Pages", icon: Globe },
              { id: "details", label: "Page Details", icon: FileSearch },
              { id: "suggestions", label: "Suggestions", icon: Lightbulb },
              { id: "planner", label: "Planner", icon: CalendarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Persona Card - Sticky */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Target Persona
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Who you're writing for
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Audience
                    </label>
                    <p className="text-sm text-slate-900 dark:text-slate-100 mt-2">
                      {contentContext.audiencePersona}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Tone
                    </label>
                    <p className="text-sm text-slate-900 dark:text-slate-100 mt-2">
                      {contentContext.tone}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Writing Tip
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Use this persona to guide all your content creation. Every piece should speak directly to this audience in this tone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {totalPages}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pages Analyzed</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Keywords</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {contentContext.dominantKeywords.length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Top Keywords</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Gaps</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {contentContext.contentGaps.length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Content Gaps</p>
                </div>
              </div>

              {/* Extraction Stats */}
              {extractionData && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Content Extraction Summary
                      </h2>
                      <p className="text-indigo-100 text-sm">
                        Detailed analysis from Trigger.dev content extraction
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-indigo-200" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-3xl font-bold">{extractionData.pagesProcessed}</p>
                      <p className="text-sm text-indigo-100">Pages Processed</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{extractionData.totalWordCount.toLocaleString()}</p>
                      <p className="text-sm text-indigo-100">Total Words</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{extractionData.aggregatedContent.services.length}</p>
                      <p className="text-sm text-indigo-100">Service Pages</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{extractionData.aggregatedContent.blogs.length}</p>
                      <p className="text-sm text-indigo-100">Blog Posts</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Quick Actions
                    </h2>
                    <p className="text-purple-100 text-sm">
                      Generate content or schedule your calendar
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-purple-200" />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAutoPlanFromStrategy}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    Open Planner
                  </button>
                  <button
                    onClick={handleAutoPlanFromStrategy}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                  >
                    <Zap className="w-4 h-4" />
                    Auto-Plan Month
                  </button>
                </div>
              </div>

              {/* Top Keywords Preview */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Top Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {contentContext.dominantKeywords.slice(0, 8).map((keyword, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                        keyword.density === "High"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          : keyword.density === "Medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      }`}
                    >
                      <span>{keyword.term}</span>
                      <span className="text-xs opacity-75">({keyword.pages})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NEW DETAILED PAGE ANALYSIS TAB */}
        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search pages by title, URL, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={pageFilterType}
                    onChange={(e) => setPageFilterType(e.target.value as 'all' | 'service' | 'blog')}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="service">Services</option>
                    <option value="blog">Blogs</option>
                  </select>
                  <select
                    value={pageSortField}
                    onChange={(e) => setPageSortField(e.target.value as 'title' | 'type' | 'wordCount')}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="wordCount">Sort by Words</option>
                    <option value="title">Sort by Title</option>
                    <option value="type">Sort by Type</option>
                  </select>
                  <button
                    onClick={() => setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    {pageSortDirection === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
              
              {/* Results Summary */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {getSortedPages(getFilteredPages()).length} of {totalPages} pages
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedPages(new Set(getSortedPages(getFilteredPages()).map(p => p.url)))}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Expand All
                  </button>
                  <span className="text-slate-400">•</span>
                  <button
                    onClick={() => setExpandedPages(new Set())}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Collapse All
                  </button>
                </div>
              </div>
            </div>

            {/* Page Cards */}
            <div className="grid grid-cols-1 gap-6">
              {getSortedPages(getFilteredPages()).map((page, index) => {
                const isExpanded = expandedPages.has(page.url);
                const displayTitle = page.mainTopic || page.title || page.url.split('/').pop() || 'Untitled Page';
                
                return (
                  <div key={page.url} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Page Header */}
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {displayTitle}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              page.type === 'service' 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                                : page.type === 'blog'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}>
                              {page.type || 'other'}
                            </span>
                          </div>
                          <a 
                            href={page.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1"
                          >
                            {page.url}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {page.wordCount?.toLocaleString() || 0}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">words</p>
                          </div>
                          <button
                            onClick={() => togglePageExpansion(page.url)}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Page Content */}
                    {isExpanded && (
                      <div className="p-6 bg-slate-50 dark:bg-slate-900/20">
                        {/* Summary */}
                        {page.summary && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Summary</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              {page.summary}
                            </p>
                          </div>
                        )}

                        {/* Full Content */}
                        {page.content && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Full Content</h4>
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                              <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">
                                {page.content}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Keywords */}
                        {page.keywords && page.keywords.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                              {page.keywords.map((keyword: string, kIndex: number) => (
                                <span
                                  key={kIndex}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-700 dark:text-blue-300"
                                >
                                  <Target className="w-2.5 h-2.5" />
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => navigator.clipboard.writeText(page.content || '')}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            Copy Content
                          </button>
                          <button
                            onClick={() => window.open(page.url, '_blank')}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Visit Page
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* No Results */}
            {getFilteredPages().length === 0 && (
              <div className="text-center py-12">
                <FileSearch className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No pages found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )}

        {/* Other tabs remain the same... */}
        {activeTab === "pages" && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Page Analysis
                </h2>
                <select
                  value={pageFilterType}
                  onChange={(e) => setPageFilterType(e.target.value as 'all' | 'service' | 'blog')}
                  className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Pages</option>
                  <option value="service">Services Only</option>
                  <option value="blog">Blogs Only</option>
                </select>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                View keyword analysis for each individual page. See which pages are performing well and identify opportunities for improvement.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" onClick={() => {
                      if (pageSortField === 'title') {
                        setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setPageSortField('title');
                        setPageSortDirection('asc');
                      }
                    }}>
                      Page Title {pageSortField === 'title' && (pageSortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" onClick={() => {
                      if (pageSortField === 'type') {
                        setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setPageSortField('type');
                        setPageSortDirection('asc');
                      }
                    }}>
                      Type {pageSortField === 'type' && (pageSortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" onClick={() => {
                      if (pageSortField === 'wordCount') {
                        setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setPageSortField('wordCount');
                        setPageSortDirection('desc');
                      }
                    }}>
                      Word Count {pageSortField === 'wordCount' && (pageSortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Top Keywords
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {pages && pages.length > 0 ? (() => {
                    let filteredPages = pages;
                    if (pageFilterType === 'service') {
                      filteredPages = pages.filter(p => p.type?.toLowerCase() === 'service' || p.url?.toLowerCase().includes('/services/'));
                    } else if (pageFilterType === 'blog') {
                      filteredPages = pages.filter(p => p.type?.toLowerCase() === 'blog' || p.url?.toLowerCase().includes('/blog/'));
                    }

                    filteredPages = [...filteredPages].sort((a, b) => {
                      let comparison = 0;
                      if (pageSortField === 'title') {
                        const titleA = a.mainTopic || a.url.split('/').pop() || '';
                        const titleB = b.mainTopic || b.url.split('/').pop() || '';
                        comparison = titleA.localeCompare(titleB);
                      } else if (pageSortField === 'type') {
                        comparison = a.type.localeCompare(b.type);
                      } else if (pageSortField === 'wordCount') {
                        comparison = a.wordCount - b.wordCount;
                      }
                      return pageSortDirection === 'asc' ? comparison : -comparison;
                    });

                    return filteredPages.map((page, index) => {
                      const pageKeywords = page.keywords && page.keywords.length > 0
                        ? page.keywords.slice(0, 3)
                        : contentContext.dominantKeywords.slice(0, 3).map(k => k.term);
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {page.mainTopic || page.url.split('/').pop() || 'Untitled Page'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {page.url}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              page.type === 'service' 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                                : page.type === 'blog'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}>
                              {page.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {page.wordCount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {pageKeywords.map((keyword, kIndex) => (
                                <span
                                  key={kIndex}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-300"
                                >
                                  <Target className="w-2.5 h-2.5" />
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })() : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Globe className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            No individual page data available.
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Start a content analysis to see page-by-page insights.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Keywords Tab */}
        {activeTab === "keywords" && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Dominant Keywords
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                These are the most prominent semantic keywords across your content. Use them strategically in new content.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {contentContext.dominantKeywords.map((keyword, index) => {
                const maxPages = Math.max(...contentContext.dominantKeywords.map(k => k.pages));
                const percentage = (keyword.pages / maxPages) * 100;
                
                const getFrequencyLabel = (density: string) => {
                  const pagePercentage = (keyword.pages / totalPages) * 100;
                  if (pagePercentage > 50) return "Dominant";
                  if (pagePercentage > 25) return "Common";
                  return "Niche";
                };
                
                const frequencyLabel = getFrequencyLabel(keyword.density);
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 w-6">
                          #{index + 1}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {keyword.term}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                            frequencyLabel === "Dominant"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : frequencyLabel === "Common"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                        >
                          {frequencyLabel}
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {keyword.pages} pages
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          frequencyLabel === "Dominant"
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : frequencyLabel === "Common"
                            ? "bg-gradient-to-r from-amber-500 to-amber-600"
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Continue with other tabs... */}
      </div>
    </div>
  );
}
