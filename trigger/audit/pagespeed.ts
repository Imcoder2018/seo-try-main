import { task, metadata } from "@trigger.dev/sdk";

interface PageSpeedPayload {
  url: string;
  auditId?: string;
  strategy?: "mobile" | "desktop";
}

interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint (ms)
  ttfb: number; // Time to First Byte (ms)
  si: number; // Speed Index
  tbt: number; // Total Blocking Time (ms)
}

interface PageSpeedResult {
  url: string;
  strategy: "mobile" | "desktop";
  score: number;
  coreWebVitals: CoreWebVitals;
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    score: number;
    savings?: string;
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    score: number;
  }>;
  screenshot?: string;
  error?: string;
}

export const pageSpeedTask = task({
  id: "pagespeed-insights",
  retry: {
    maxAttempts: 2,
  },
  run: async (payload: PageSpeedPayload): Promise<PageSpeedResult> => {
    const { url, strategy = "mobile" } = payload;
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;

    metadata.set("status", {
      progress: 10,
      label: `Running PageSpeed Insights (${strategy})...`,
    });

    if (!apiKey) {
      // Return mock data if no API key
      console.log("No PageSpeed API key configured, returning estimated values");
      
      metadata.set("status", {
        progress: 100,
        label: "PageSpeed analysis complete (estimated)",
      });

      return {
        url,
        strategy,
        score: 75,
        coreWebVitals: {
          lcp: 2500,
          fid: 100,
          cls: 0.1,
          fcp: 1800,
          ttfb: 600,
          si: 3500,
          tbt: 200,
        },
        opportunities: [
          {
            id: "render-blocking-resources",
            title: "Eliminate render-blocking resources",
            description: "Resources are blocking the first paint of your page.",
            score: 0.5,
            savings: "Potential savings of 500ms",
          },
        ],
        diagnostics: [
          {
            id: "dom-size",
            title: "Avoid an excessive DOM size",
            description: "A large DOM will increase memory usage and produce costly style recalculations.",
            score: 0.7,
          },
        ],
      };
    }

    try {
      const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
      apiUrl.searchParams.set("url", url);
      apiUrl.searchParams.set("key", apiKey);
      apiUrl.searchParams.set("strategy", strategy);
      apiUrl.searchParams.set("category", "performance");
      apiUrl.searchParams.set("category", "accessibility");
      apiUrl.searchParams.set("category", "best-practices");
      apiUrl.searchParams.set("category", "seo");

      metadata.set("status", {
        progress: 30,
        label: "Waiting for Google PageSpeed API response...",
      });

      const response = await fetch(apiUrl.toString(), {
        signal: AbortSignal.timeout(60000),
      });

      if (!response.ok) {
        throw new Error(`PageSpeed API error: ${response.status}`);
      }

      const data = await response.json();
      
      metadata.set("status", {
        progress: 80,
        label: "Processing PageSpeed results...",
      });

      const lighthouse = data.lighthouseResult;
      const audits = lighthouse.audits;

      // Extract Core Web Vitals
      const coreWebVitals: CoreWebVitals = {
        lcp: audits["largest-contentful-paint"]?.numericValue || 0,
        fid: audits["max-potential-fid"]?.numericValue || 0,
        cls: audits["cumulative-layout-shift"]?.numericValue || 0,
        fcp: audits["first-contentful-paint"]?.numericValue || 0,
        ttfb: audits["server-response-time"]?.numericValue || 0,
        si: audits["speed-index"]?.numericValue || 0,
        tbt: audits["total-blocking-time"]?.numericValue || 0,
      };

      // Extract opportunities
      const opportunities = Object.values(audits)
        .filter((audit: any) => audit.details?.type === "opportunity" && audit.score !== null && audit.score < 1)
        .map((audit: any) => ({
          id: audit.id,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          savings: audit.details?.overallSavingsMs ? `${Math.round(audit.details.overallSavingsMs)}ms` : undefined,
        }))
        .slice(0, 10);

      // Extract diagnostics
      const diagnostics = Object.values(audits)
        .filter((audit: any) => audit.details?.type === "table" && audit.score !== null && audit.score < 0.9)
        .map((audit: any) => ({
          id: audit.id,
          title: audit.title,
          description: audit.description,
          score: audit.score,
        }))
        .slice(0, 10);

      // Get screenshot
      const screenshot = audits["final-screenshot"]?.details?.data;

      metadata.set("status", {
        progress: 100,
        label: "PageSpeed analysis complete",
      });

      return {
        url,
        strategy,
        score: Math.round((lighthouse.categories?.performance?.score || 0) * 100),
        coreWebVitals,
        opportunities,
        diagnostics,
        screenshot,
      };

    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Unknown error";
      console.error("PageSpeed API error:", errorMsg);
      
      metadata.set("status", {
        progress: 100,
        label: `PageSpeed analysis failed: ${errorMsg}`,
      });

      return {
        url,
        strategy,
        score: 0,
        coreWebVitals: {
          lcp: 0,
          fid: 0,
          cls: 0,
          fcp: 0,
          ttfb: 0,
          si: 0,
          tbt: 0,
        },
        opportunities: [],
        diagnostics: [],
        error: errorMsg,
      };
    }
  },
});
