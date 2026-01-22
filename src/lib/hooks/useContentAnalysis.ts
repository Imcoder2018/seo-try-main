"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CrawledPage {
  url: string;
  type: string;
  title?: string;
  selected?: boolean;
}

interface CrawlResult {
  pages: CrawledPage[];
  urlGroups: Record<string, string[]>;
}

interface AnalysisResult {
  analysisOutput: any;
  extractionStatus: string;
  analysisStatus: string;
}

const STORAGE_KEY_DISCOVERY = "seo_discovery_data";
const STORAGE_KEY_ANALYSIS = "seo_analysis_output";

export function saveToLocalStorage(key: string, data: any) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }
}

export function loadFromLocalStorage<T>(key: string): T | null {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Failed to load from localStorage:", e);
      return null;
    }
  }
  return null;
}

export function useCrawlMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string) => {
      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, maxPages: 50 }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to start crawl");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crawl"] });
    },
  });
}

export function useCrawlStatus(
  runId: string | null,
  publicToken: string | null,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["crawl", runId],
    queryFn: async () => {
      if (!runId || !publicToken) {
        throw new Error("Missing runId or publicToken");
      }

      const response = await fetch(
        `/api/crawl?runId=${runId}&publicToken=${publicToken}`
      );
      const data = await response.json();

      if (data.status === "COMPLETED" && data.output) {
        const urlGroups = data.output.urlGroups || {};
        const allPages = data.output.pages || [];

        const typeMapping: Record<string, string> = {
          core: "other",
          blog: "blog",
          product: "product",
          service: "service",
          category: "other",
          other: "other",
        };

        const pagesWithSelection: CrawledPage[] = [];

        Object.entries(urlGroups).forEach(([groupType, urls]) => {
          const pageType = typeMapping[groupType] || "other";
          const shouldAutoSelect = ["service", "blog"].includes(pageType);

          (urls as string[]).forEach((url: string) => {
            const pageData = allPages.find((p: any) => p.url === url);
            pagesWithSelection.push({
              url,
              type: pageType,
              title: pageData?.title || "",
              selected: shouldAutoSelect,
            });
          });
        });

        saveToLocalStorage(STORAGE_KEY_DISCOVERY, {
          pages: pagesWithSelection,
          urlGroups,
          timestamp: Date.now(),
        });

        return {
          status: "COMPLETED",
          pages: pagesWithSelection,
          urlGroups,
        };
      }

      return data;
    },
    enabled: enabled && !!runId && !!publicToken,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "COMPLETED" || data?.status === "FAILED") {
        return false;
      }
      return 2000;
    },
    staleTime: 0,
  });
}

export function useAnalysisMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      baseUrl,
      pages,
    }: {
      baseUrl: string;
      pages: { url: string; type: string }[];
    }) => {
      const response = await fetch("/api/content/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl,
          pages,
          maxPages: 50,
          targetAudience: "General audience",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to start analysis");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysis"] });
    },
  });
}

export function useAnalysisStatus(
  extractionRunId: string | null,
  analysisRunId: string | null,
  analysisId: string | null,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["analysis", analysisRunId],
    queryFn: async () => {
      if (!extractionRunId || !analysisRunId || !analysisId) {
        throw new Error("Missing analysis IDs");
      }

      const response = await fetch(
        `/api/content/analyze?extractionRunId=${extractionRunId}&analysisRunId=${analysisRunId}&analysisId=${analysisId}`
      );
      const data = await response.json();

      if (data.isComplete && data.analysisOutput) {
        saveToLocalStorage(STORAGE_KEY_ANALYSIS, {
          analysisOutput: data.analysisOutput,
          timestamp: Date.now(),
        });
      }

      return data;
    },
    enabled:
      enabled && !!extractionRunId && !!analysisRunId && !!analysisId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.isComplete || data?.hasFailed) {
        return false;
      }
      return 2000;
    },
    staleTime: 0,
  });
}

export function useRecentAnalyses() {
  return useQuery({
    queryKey: ["recentAnalyses"],
    queryFn: async () => {
      const response = await fetch("/api/content/history?limit=3");
      if (!response.ok) {
        throw new Error("Failed to fetch recent analyses");
      }
      const data = await response.json();
      return data.analyses || [];
    },
    staleTime: 60000,
  });
}

export function useRestoreFromStorage() {
  const discoveryData = loadFromLocalStorage<{
    pages: CrawledPage[];
    urlGroups: Record<string, string[]>;
    timestamp: number;
  }>(STORAGE_KEY_DISCOVERY);

  const analysisData = loadFromLocalStorage<{
    analysisOutput: any;
    timestamp: number;
  }>(STORAGE_KEY_ANALYSIS);

  const isDiscoveryRecent =
    discoveryData && Date.now() - discoveryData.timestamp < 24 * 60 * 60 * 1000;
  const isAnalysisRecent =
    analysisData && Date.now() - analysisData.timestamp < 24 * 60 * 60 * 1000;

  return {
    discoveryData: isDiscoveryRecent ? discoveryData : null,
    analysisData: isAnalysisRecent ? analysisData : null,
  };
}
