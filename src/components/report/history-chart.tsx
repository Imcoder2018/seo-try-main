"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, BarChart3, Loader2, Clock, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";

interface HistoryEntry {
  id: string;
  domain: string;
  date: string;
  overallScore: number;
  seoScore: number;
  linksScore: number;
  usabilityScore: number;
  performanceScore: number;
  socialScore: number;
  contentScore?: number;
  eeatScore?: number;
  auditId?: string;
}

interface HistoryData {
  domain: string;
  history: HistoryEntry[];
  trends: Record<string, { change: number; trend: string }>;
  totalAudits: number;
}

interface HistoryChartProps {
  domain: string;
  currentAudit?: Record<string, unknown>;
}

export function HistoryChart({ domain, currentAudit }: HistoryChartProps) {
  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/history?domain=${encodeURIComponent(domain)}`);
        if (!response.ok) throw new Error("Failed to fetch history");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [domain]);

  useEffect(() => {
    // Save current audit to history - only once per unique audit
    if (currentAudit && currentAudit.overallScore !== undefined) {
      const auditId = (currentAudit as { id?: string }).id;
      if (!auditId) return;
      
      // Use multiple checks to prevent duplicate saves
      const saveKey = `saved_audit_${domain}_${auditId}`;
      const globalSaveKey = `saved_audit_global_${auditId}`;
      
      // Check both session and local storage for duplicates
      if (sessionStorage.getItem(saveKey) || localStorage.getItem(globalSaveKey)) {
        return;
      }
      
      // Mark as saved immediately before API call
      sessionStorage.setItem(saveKey, 'true');
      localStorage.setItem(globalSaveKey, Date.now().toString());
      
      fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, auditData: currentAudit, auditId }),
      }).catch((err) => {
        console.error("Failed to save history:", err);
        // On error, remove the markers so it can retry
        sessionStorage.removeItem(saveKey);
        localStorage.removeItem(globalSaveKey);
      });
    }
  }, [domain, currentAudit]);

  if (loading) {
    return (
      <div className="bg-card border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const history = data.history;
  const trends = data.trends;

  if (history.length === 0) {
    return (
      <div className="bg-card border rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Historical Tracking
        </h3>
        <p className="text-muted-foreground text-center py-4">
          This is your first audit for {domain}. Future audits will show trends here.
        </p>
      </div>
    );
  }

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const TrendBadge = ({ change, trend }: { change: number; trend: string }) => (
    <span className={`inline-flex items-center gap-1 text-sm ${
      trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
    }`}>
      <TrendIcon trend={trend} />
      {change > 0 ? "+" : ""}{change}
    </span>
  );

  // Simple sparkline visualization using div bars
  const Sparkline = ({ scores, color }: { scores: number[]; color: string }) => {
    const max = Math.max(...scores, 100);
    const min = Math.min(...scores, 0);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end gap-0.5 h-8">
        {scores.slice(-10).map((score, i) => (
          <div
            key={i}
            className={`w-2 rounded-sm ${color}`}
            style={{ height: `${((score - min) / range) * 100}%`, minHeight: "4px" }}
          />
        ))}
      </div>
    );
  };

  const overallScores = history.map(h => h.overallScore);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          Historical Tracking
        </h3>
        <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
          {data.totalAudits} audit{data.totalAudits !== 1 ? "s" : ""} recorded
        </span>
      </div>

      {/* Score Trend Chart */}
      <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Overall Score Trend</span>
          {trends.overall && (
            <TrendBadge change={trends.overall.change} trend={trends.overall.trend} />
          )}
        </div>
        <Sparkline scores={overallScores} color="bg-gradient-to-r from-blue-500 to-indigo-500" />
      </div>

      {/* Category Trends */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { key: "seo", label: "SEO", scores: history.map(h => h.seoScore), gradient: "from-blue-400 to-cyan-400" },
          { key: "links", label: "Links", scores: history.map(h => h.linksScore), gradient: "from-green-400 to-emerald-400" },
          { key: "usability", label: "Usability", scores: history.map(h => h.usabilityScore), gradient: "from-amber-400 to-orange-400" },
          { key: "performance", label: "Performance", scores: history.map(h => h.performanceScore), gradient: "from-yellow-400 to-amber-400" },
          { key: "social", label: "Social", scores: history.map(h => h.socialScore), gradient: "from-pink-400 to-rose-400" },
          ...(history[0]?.contentScore !== undefined ? [{ key: "content", label: "Content", scores: history.map(h => h.contentScore || 0), gradient: "from-indigo-400 to-purple-400" }] : []),
        ].map(({ key, label, scores, gradient }) => (
          <div key={key} className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</span>
              {trends[key] && (
                <TrendBadge change={trends[key].change} trend={trends[key].trend} />
              )}
            </div>
            <Sparkline scores={scores} color={`bg-gradient-to-r ${gradient}`} />
          </div>
        ))}
      </div>

      {/* Recent History Table */}
      {history.length > 1 && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="h-4 w-4 text-slate-500" />
              Recent Audits
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Click to load past audit</span>
          </div>
          <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 text-center font-semibold">Overall</th>
                  <th className="px-4 py-3 text-center font-semibold">SEO</th>
                  <th className="px-4 py-3 text-center font-semibold">Perf</th>
                  <th className="px-4 py-3 text-center font-semibold">Links</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 5).map((entry, index) => (
                  <tr 
                    key={entry.id} 
                    className={`border-b border-slate-50 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${index === 0 ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                            Current
                          </span>
                        )}
                        <span className="text-slate-700 dark:text-slate-300">{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-6 rounded-full font-bold text-xs ${
                        entry.overallScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        entry.overallScore >= 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {entry.overallScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{entry.seoScore}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{entry.performanceScore}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{entry.linksScore}</td>
                    <td className="px-4 py-3 text-right">
                      {entry.auditId && index !== 0 && (
                        <Link
                          href={`/${domain}?id=${entry.auditId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          View <ChevronRight className="h-3 w-3" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
