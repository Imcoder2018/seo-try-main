"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, BarChart3, Loader2 } from "lucide-react";

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
    // Save current audit to history
    if (currentAudit && currentAudit.overallScore !== undefined) {
      fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, auditData: currentAudit }),
      }).catch(console.error);
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
    <div className="bg-card border rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Historical Tracking
        </h3>
        <span className="text-sm text-muted-foreground">
          {data.totalAudits} audit{data.totalAudits !== 1 ? "s" : ""} recorded
        </span>
      </div>

      {/* Score Trend Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Score Trend</span>
          {trends.overall && (
            <TrendBadge change={trends.overall.change} trend={trends.overall.trend} />
          )}
        </div>
        <Sparkline scores={overallScores} color="bg-blue-500" />
      </div>

      {/* Category Trends */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { key: "seo", label: "SEO", scores: history.map(h => h.seoScore) },
          { key: "links", label: "Links", scores: history.map(h => h.linksScore) },
          { key: "usability", label: "Usability", scores: history.map(h => h.usabilityScore) },
          { key: "performance", label: "Performance", scores: history.map(h => h.performanceScore) },
          { key: "social", label: "Social", scores: history.map(h => h.socialScore) },
          ...(history[0]?.contentScore !== undefined ? [{ key: "content", label: "Content", scores: history.map(h => h.contentScore || 0) }] : []),
        ].map(({ key, label, scores }) => (
          <div key={key} className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
              {trends[key] && (
                <TrendBadge change={trends[key].change} trend={trends[key].trend} />
              )}
            </div>
            <Sparkline scores={scores} color="bg-gray-400" />
          </div>
        ))}
      </div>

      {/* Recent History Table */}
      {history.length > 1 && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-medium mb-3">Recent Audits</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-center">Overall</th>
                  <th className="pb-2 text-center">SEO</th>
                  <th className="pb-2 text-center">Perf</th>
                  <th className="pb-2 text-center">Links</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 5).map((entry) => (
                  <tr key={entry.id} className="border-b border-muted/50">
                    <td className="py-2">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="py-2 text-center font-medium">{entry.overallScore}</td>
                    <td className="py-2 text-center">{entry.seoScore}</td>
                    <td className="py-2 text-center">{entry.performanceScore}</td>
                    <td className="py-2 text-center">{entry.linksScore}</td>
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
