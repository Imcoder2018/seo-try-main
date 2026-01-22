import { task } from "@trigger.dev/sdk";
import { calculateGrade } from "../../src/lib/utils";
import { calculateCategoryScore, getCategoryMessage, type CheckResult } from "../../src/lib/scoring";

interface PageSpeedResult {
  lighthouseResult?: {
    categories?: {
      performance?: { score: number };
    };
    audits?: {
      "first-contentful-paint"?: { displayValue: string; numericValue: number };
      "speed-index"?: { displayValue: string; numericValue: number };
      "largest-contentful-paint"?: { displayValue: string; numericValue: number };
      "total-blocking-time"?: { displayValue: string; numericValue: number };
      "cumulative-layout-shift"?: { displayValue: string; numericValue: number };
      interactive?: { displayValue: string; numericValue: number };
    };
  };
}

async function getPageSpeedInsights(url: string, strategy: "mobile" | "desktop"): Promise<PageSpeedResult | null> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  if (!apiKey) return null;

  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export const performanceTask = task({
  id: "performance-analysis",
  retry: { maxAttempts: 2 },
  run: async (payload: { url: string; auditId: string }) => {
    const { url } = payload;
    const checks: CheckResult[] = [];

    const startTime = Date.now();
    let response: Response;
    try {
      response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOAuditBot/1.0)" },
      });
    } catch {
      return {
        score: 0,
        grade: "F",
        checks: [],
        message: "Failed to fetch the page.",
      };
    }
    const loadTime = Date.now() - startTime;

    checks.push({
      id: "serverResponse",
      name: "Server Response Time",
      status: loadTime < 600 ? "pass" : loadTime < 1500 ? "warning" : "fail",
      score: loadTime < 600 ? 100 : loadTime < 1500 ? 70 : 40,
      weight: 15,
      value: { responseTime: loadTime },
      message: `Server response time: ${(loadTime / 1000).toFixed(2)}s`,
      recommendation: loadTime >= 1500 ? "Improve server response time" : undefined,
    });

    const contentLength = parseInt(response.headers.get("content-length") || "0", 10);
    const contentLengthMB = contentLength / (1024 * 1024);
    checks.push({
      id: "pageSize",
      name: "Page Size",
      status: contentLengthMB < 3 ? "pass" : contentLengthMB < 5 ? "warning" : "fail",
      score: contentLengthMB < 3 ? 100 : contentLengthMB < 5 ? 70 : 40,
      weight: 10,
      value: { bytes: contentLength, mb: contentLengthMB.toFixed(2) },
      message: contentLength > 0 ? `Page size: ${contentLengthMB.toFixed(2)}MB` : "Page size not available in headers.",
    });

    const encoding = response.headers.get("content-encoding");
    const isCompressed = encoding === "gzip" || encoding === "br" || encoding === "deflate";
    checks.push({
      id: "compression",
      name: "Compression (Gzip/Brotli)",
      status: isCompressed ? "pass" : "warning",
      score: isCompressed ? 100 : 50,
      weight: 10,
      value: { encoding, isCompressed },
      message: isCompressed
        ? `Compression enabled: ${encoding}`
        : "No compression detected.",
      recommendation: !isCompressed ? "Enable Gzip or Brotli compression" : undefined,
    });

    const http2 = response.headers.get("alt-svc")?.includes("h2") || 
                  response.headers.get("alt-svc")?.includes("h3");
    checks.push({
      id: "httpProtocol",
      name: "HTTP/2+ Protocol",
      status: http2 ? "pass" : "info",
      score: http2 ? 100 : 70,
      weight: 5,
      value: { http2 },
      message: http2
        ? "HTTP/2 or HTTP/3 is enabled."
        : "Consider enabling HTTP/2+ for better performance.",
      recommendation: !http2 ? "Make use of HTTP/2+ Protocol" : undefined,
    });

    const mobileInsights = await getPageSpeedInsights(url, "mobile");
    if (mobileInsights?.lighthouseResult?.categories?.performance) {
      const mobileScore = Math.round((mobileInsights.lighthouseResult.categories.performance.score || 0) * 100);
      checks.push({
        id: "mobilePageInsights",
        name: "Mobile PageSpeed Score",
        status: mobileScore >= 90 ? "pass" : mobileScore >= 50 ? "warning" : "fail",
        score: mobileScore,
        weight: 20,
        value: { 
          score: mobileScore,
          fcp: mobileInsights.lighthouseResult.audits?.["first-contentful-paint"]?.displayValue,
          lcp: mobileInsights.lighthouseResult.audits?.["largest-contentful-paint"]?.displayValue,
          cls: mobileInsights.lighthouseResult.audits?.["cumulative-layout-shift"]?.displayValue,
          tbt: mobileInsights.lighthouseResult.audits?.["total-blocking-time"]?.displayValue,
        },
        message: `Mobile PageSpeed score: ${mobileScore}/100`,
        recommendation: mobileScore < 50 ? "Optimize for Mobile PageSpeed Insights" : undefined,
      });
    }

    const desktopInsights = await getPageSpeedInsights(url, "desktop");
    if (desktopInsights?.lighthouseResult?.categories?.performance) {
      const desktopScore = Math.round((desktopInsights.lighthouseResult.categories.performance.score || 0) * 100);
      checks.push({
        id: "desktopPageInsights",
        name: "Desktop PageSpeed Score",
        status: desktopScore >= 90 ? "pass" : desktopScore >= 50 ? "warning" : "fail",
        score: desktopScore,
        weight: 15,
        value: { 
          score: desktopScore,
          fcp: desktopInsights.lighthouseResult.audits?.["first-contentful-paint"]?.displayValue,
          lcp: desktopInsights.lighthouseResult.audits?.["largest-contentful-paint"]?.displayValue,
          cls: desktopInsights.lighthouseResult.audits?.["cumulative-layout-shift"]?.displayValue,
          tbt: desktopInsights.lighthouseResult.audits?.["total-blocking-time"]?.displayValue,
        },
        message: `Desktop PageSpeed score: ${desktopScore}/100`,
        recommendation: desktopScore < 50 ? "Optimize for Desktop PageSpeed Insights" : undefined,
      });
    }

    const score = calculateCategoryScore(checks);
    const grade = calculateGrade(score);

    return {
      score,
      grade,
      checks,
      message: getCategoryMessage("performance", score),
    };
  },
});
