import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory storage for historical data (for serverless deployment)
// In production, this would use a database
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

// Simple storage - in production use database
const historyStorage = new Map<string, HistoryEntry[]>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const limit = parseInt(searchParams.get("limit") || "30");

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    // Get history from storage
    const history = historyStorage.get(domain) || [];
    
    // Sort by date descending and limit
    const sortedHistory = history
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);

    // Calculate trends
    const trends = calculateTrends(sortedHistory);

    return NextResponse.json({
      domain,
      history: sortedHistory,
      trends,
      totalAudits: history.length,
    });
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { error: "Failed to get history", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, auditData } = body;

    if (!domain || !auditData) {
      return NextResponse.json({ error: "Domain and audit data are required" }, { status: 400 });
    }

    const entry: HistoryEntry = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      domain,
      date: new Date().toISOString(),
      overallScore: auditData.overallScore,
      seoScore: auditData.seoScore,
      linksScore: auditData.linksScore,
      usabilityScore: auditData.usabilityScore,
      performanceScore: auditData.performanceScore,
      socialScore: auditData.socialScore,
      contentScore: auditData.contentScore,
      eeatScore: auditData.eeatScore,
    };

    // Get existing history for domain
    const existing = historyStorage.get(domain) || [];
    existing.push(entry);
    
    // Keep only last 100 entries per domain
    if (existing.length > 100) {
      existing.shift();
    }
    
    historyStorage.set(domain, existing);

    return NextResponse.json({
      success: true,
      entry,
    });
  } catch (error) {
    console.error("History save error:", error);
    return NextResponse.json(
      { error: "Failed to save history", details: String(error) },
      { status: 500 }
    );
  }
}

function calculateTrends(history: HistoryEntry[]): Record<string, { change: number; trend: string }> {
  if (history.length < 2) {
    return {
      overall: { change: 0, trend: "stable" },
      seo: { change: 0, trend: "stable" },
      performance: { change: 0, trend: "stable" },
    };
  }

  const latest = history[0];
  const previous = history[1];

  const calculateChange = (current: number, prev: number) => {
    const change = current - prev;
    const trend = change > 0 ? "up" : change < 0 ? "down" : "stable";
    return { change, trend };
  };

  return {
    overall: calculateChange(latest.overallScore, previous.overallScore),
    seo: calculateChange(latest.seoScore, previous.seoScore),
    links: calculateChange(latest.linksScore, previous.linksScore),
    usability: calculateChange(latest.usabilityScore, previous.usabilityScore),
    performance: calculateChange(latest.performanceScore, previous.performanceScore),
    social: calculateChange(latest.socialScore, previous.socialScore),
    ...(latest.contentScore !== undefined && previous.contentScore !== undefined
      ? { content: calculateChange(latest.contentScore, previous.contentScore) }
      : {}),
    ...(latest.eeatScore !== undefined && previous.eeatScore !== undefined
      ? { eeat: calculateChange(latest.eeatScore, previous.eeatScore) }
      : {}),
  };
}
