"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContentStrategy } from "@/contexts/ContentStrategyContext";
import SidebarLayout from "@/components/layout/SidebarLayout";

interface Audit {
  id: string;
  domain: string;
  url: string;
  status: string;
  overallScore: number | null;
  overallGrade: string | null;
  createdAt: string;
  completedAt: string | null;
}

interface ContentAnalysis {
  id: string;
  baseUrl: string;
  domain: string;
  status: string;
  pagesAnalyzed: number;
  createdAt: string;
  completedAt: string | null;
}

export default function HistoryPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const { loadFromHistory, resetStrategy } = useContentStrategy();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [contentAnalyses, setContentAnalyses] = useState<ContentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAnalysisId, setLoadingAnalysisId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "audits" | "content">("all");

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [auditsRes, contentRes] = await Promise.all([
          fetch("/api/audit/history"),
          fetch("/api/content/history"),
        ]);

        if (auditsRes.ok) {
          const auditsData = await auditsRes.json();
          setAudits(auditsData.audits || []);
        }

        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setContentAnalyses(contentData.analyses || []);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const filteredAudits = audits.filter(audit =>
    audit.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContent = contentAnalyses.filter(analysis =>
    analysis.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    analysis.baseUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allItems = filterType === "all" 
    ? [...filteredAudits, ...filteredContent]
    : filterType === "audits" 
    ? filteredAudits 
    : filteredContent;

  const completedAudits = audits.filter(a => a.status === "COMPLETED").length;
  const runningAudits = audits.filter(a => a.status === "RUNNING").length;
  const completedContent = contentAnalyses.filter(a => a.status === "COMPLETED").length;
  const runningContent = contentAnalyses.filter(a => a.status === "RUNNING").length;

  const handleLoadAnalysis = async (analysisId: string) => {
    setLoadingAnalysisId(analysisId);
    try {
      const response = await fetch(`/api/content/history/${analysisId}`);
      if (response.ok) {
        const data = await response.json();
        loadFromHistory({
          analysisData: data.contentContext || {
            dominantKeywords: [],
            contentGaps: [],
            audiencePersona: '',
            tone: '',
          },
          aiSuggestions: data.aiSuggestions || [],
          events: data.events || [],
          domain: data.domain,
          runId: analysisId,
        });
        router.push('/content-strategy?view=dashboard');
      }
    } catch (error) {
      console.error('Error loading analysis:', error);
    } finally {
      setLoadingAnalysisId(null);
    }
  };

  const handleNewStrategy = () => {
    resetStrategy();
    router.push('/content-strategy?view=analysis');
  };

  if (loading) {
    return (
      <SidebarLayout onNewStrategy={handleNewStrategy}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Loading history...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout onNewStrategy={handleNewStrategy}>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Your History
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              View all your SEO audits and content strategy analyses
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Audits</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{audits.length}</p>
                </div>
                <FileText className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Content Analyses</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{contentAnalyses.length}</p>
                </div>
                <BarChart3 className="w-10 h-10 text-purple-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{completedAudits + completedContent}</p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">In Progress</p>
                  <p className="text-3xl font-bold text-amber-600">{runningAudits + runningContent}</p>
                </div>
                <Clock className="w-10 h-10 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by domain or URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("audits")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === "audits"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  Audits
                </button>
                <button
                  onClick={() => setFilterType("content")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === "content"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  Content
                </button>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {filterType === "all" || filterType === "audits" ? (
              <>
                {filteredAudits.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                      SEO Audits
                    </h2>
                    <div className="space-y-3">
                      {filteredAudits.map((audit) => (
                        <Link
                          key={audit.id}
                          href={`/${audit.domain}?id=${audit.id}`}
                          className="block bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                  {audit.domain}
                                </h3>
                                {audit.overallGrade && (
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      audit.overallGrade === "A"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                        : audit.overallGrade === "B"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                        : audit.overallGrade === "C"
                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                    }`}
                                  >
                                    Grade: {audit.overallGrade}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{audit.url}</p>
                              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(audit.createdAt).toLocaleDateString()}
                                </div>
                                {audit.completedAt && (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    Completed
                                  </div>
                                )}
                                {audit.status === "RUNNING" && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    In Progress
                                  </div>
                                )}
                              </div>
                            </div>
                            <ExternalLink className="w-5 h-5 text-slate-400" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}

            {filterType === "all" || filterType === "content" ? (
              <>
                {filteredContent.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                      Content Strategy Analyses
                    </h2>
                    <div className="space-y-3">
                      {filteredContent.map((analysis) => (
                        <div
                          key={analysis.id}
                          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <BarChart3 className="w-5 h-5 text-purple-500" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                  {analysis.domain}
                                </h3>
                                {analysis.status === "COMPLETED" && (
                                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                                    Ready to Load
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{analysis.baseUrl}</p>
                              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Activity className="w-4 h-4" />
                                  {analysis.pagesAnalyzed} pages analyzed
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(analysis.createdAt).toLocaleDateString()}
                                </div>
                                {analysis.completedAt && (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    Completed
                                  </div>
                                )}
                                {analysis.status === "RUNNING" && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    In Progress
                                  </div>
                                )}
                              </div>
                            </div>
                            {analysis.status === "COMPLETED" && (
                              <button
                                onClick={() => handleLoadAnalysis(analysis.id)}
                                disabled={loadingAnalysisId === analysis.id}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                              >
                                {loadingAnalysisId === analysis.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Loading...
                                  </>
                                ) : (
                                  'Load Strategy'
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}

            {allItems.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No history found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Start running audits or content analyses to see them here
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start New Audit
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
