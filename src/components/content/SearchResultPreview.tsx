"use client";

import React, { useMemo } from "react";
import { Globe, ArrowUpRight, Eye } from "lucide-react";

interface SearchResultPreviewProps {
  title?: string;
  url?: string;
  description?: string;
  keywords?: string[];
}

export default function SearchResultPreview({
  title = "",
  url = "https://example.com/your-article",
  description = "",
  keywords = [],
}: SearchResultPreviewProps) {
  const generateMetaDescription = useMemo(() => {
    if (description) return description;
    if (!title) return "Your meta description will appear here as you type your topic...";
    
    const keywordText = keywords.length > 0 
      ? ` Learn about ${keywords.slice(0, 2).join(", ")} and more.`
      : "";
    
    return `Discover everything you need to know about ${title.toLowerCase()}.${keywordText} Read our comprehensive guide for actionable insights and expert tips.`;
  }, [title, description, keywords]);

  const truncatedTitle = title.length > 60 
    ? title.substring(0, 57) + "..." 
    : title || "Your Article Title";

  const truncatedDescription = generateMetaDescription.length > 160
    ? generateMetaDescription.substring(0, 157) + "..."
    : generateMetaDescription;

  const formatUrl = (urlStr: string, titleStr: string) => {
    if (!titleStr) return urlStr;
    const slug = titleStr
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);
    const baseUrl = urlStr.split("/").slice(0, 3).join("/");
    return `${baseUrl}/${slug}`;
  };

  const displayUrl = formatUrl(url, title);

  const highlightKeywords = (text: string) => {
    if (keywords.length === 0) return text;
    
    let result = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, "gi");
      result = result.replace(regex, `<strong class="font-semibold">$1</strong>`);
    });
    return result;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Eye className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Search Result Preview
        </h3>
      </div>

      {/* Google-style Search Result */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        {/* URL Breadcrumb */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Globe className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {displayUrl.split("/").slice(0, 3).join("/").replace("https://", "")}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-500 truncate max-w-[300px]">
              {displayUrl}
            </span>
          </div>
        </div>

        {/* Title */}
        <a 
          href="#" 
          className="block text-xl text-blue-600 dark:text-blue-400 hover:underline mb-1 leading-tight"
          onClick={(e) => e.preventDefault()}
        >
          {truncatedTitle || "Enter a topic to see preview"}
        </a>

        {/* Meta Description */}
        <p 
          className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlightKeywords(truncatedDescription) }}
        />

        {/* Rich Snippets Preview */}
        {keywords.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {keywords.slice(0, 4).map((keyword, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SEO Indicators */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-lg border ${
          title.length >= 30 && title.length <= 60
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : title.length > 0
            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        }`}>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Title Length</p>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${
              title.length >= 30 && title.length <= 60
                ? "text-green-600 dark:text-green-400"
                : title.length > 0
                ? "text-amber-600 dark:text-amber-400"
                : "text-slate-400"
            }`}>
              {title.length}/60
            </span>
            {title.length >= 30 && title.length <= 60 && (
              <span className="text-xs text-green-600 dark:text-green-400">Optimal</span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${
          generateMetaDescription.length >= 120 && generateMetaDescription.length <= 160
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : generateMetaDescription.length > 50
            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        }`}>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description</p>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${
              generateMetaDescription.length >= 120 && generateMetaDescription.length <= 160
                ? "text-green-600 dark:text-green-400"
                : generateMetaDescription.length > 50
                ? "text-amber-600 dark:text-amber-400"
                : "text-slate-400"
            }`}>
              {generateMetaDescription.length}/160
            </span>
            {generateMetaDescription.length >= 120 && generateMetaDescription.length <= 160 && (
              <span className="text-xs text-green-600 dark:text-green-400">Optimal</span>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
        <p className="font-medium mb-1">SEO Tips:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Keep titles between 30-60 characters for best display</li>
          <li>Include your primary keyword in the title</li>
          <li>Meta descriptions should be 120-160 characters</li>
        </ul>
      </div>
    </div>
  );
}
