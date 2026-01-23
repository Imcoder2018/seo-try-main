"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { Eye, Code } from "lucide-react";

type ViewMode = "simple" | "advanced";

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType>({
  viewMode: "simple",
  setViewMode: () => {},
});

export function useViewMode() {
  return useContext(ViewModeContext);
}

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("simple");

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function ViewModeToggle() {
  const { viewMode, setViewMode } = useViewMode();

  return (
    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
      <button
        onClick={() => setViewMode("simple")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === "simple"
            ? "bg-white dark:bg-gray-800 shadow-sm text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Eye className="w-4 h-4" />
        Standard
      </button>
      <button
        onClick={() => setViewMode("advanced")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === "advanced"
            ? "bg-white dark:bg-gray-800 shadow-sm text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Code className="w-4 h-4" />
        Advanced
      </button>
    </div>
  );
}

// Define which checks are "simple" (important for non-technical users)
export const SIMPLE_CHECKS: Record<string, string[]> = {
  seo: [
    "title",
    "metaDescription", 
    "h1Tag",
    "imageAlt",
    "searchPreview",
    "keywordConsistency",
    "schemaMarkup",
    "hasAnalytics",
  ],
  links: [
    "internalLinks",
    "externalLinks",
    "brokenLinks",
    "robotsTxt",
    "xmlSitemap",
    "httpsRedirect",
  ],
  usability: [
    "mobileViewport",
    "favicon",
    "sslCertificate",
    "pageSize",
    "textHtmlRatio",
  ],
  performance: [
    "serverResponseTime",
    "compression",
    "pageSize",
    "lcp",
    "cls",
    "fcp",
    "performanceScore",
  ],
  social: [
    "ogTitle",
    "ogDescription",
    "ogImage",
    "twitterCard",
    "facebookPage",
    "twitterProfile",
    "instagramProfile",
    "linkedinProfile",
  ],
  technology: [
    "cms",
    "cdn",
    "securityHeaders",
    "localBusinessSchema",
  ],
};

// Checks that are purely technical and can be hidden in simple mode
export const TECHNICAL_CHECKS = [
  "langAttribute",
  "canonical",
  "noindex",
  "noindexHeader",
  "metaKeywords",
  "openGraph",
  "hreflang",
  "headingStructure",
  "keywordsUrl",
  "inlineStyles",
  "deprecatedHtml",
  "http2",
  "htmlMinification",
  "resourceHints",
  "renderBlocking",
  "jsFileCount",
  "cssFileCount",
  "modernImageFormats",
  "imageLazyLoading",
  "caching",
  "spfRecord",
  "dmarcRecord",
  "llmsTxt",
  "jsFramework",
  "webServer",
  "ariaFeatures",
  "hsts",
];
