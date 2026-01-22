"use client";

interface GoogleSearchPreviewProps {
  title: string;
  url: string;
  description: string;
}

export function GoogleSearchPreview({ title, url, description }: GoogleSearchPreviewProps) {
  // Truncate title and description like Google does
  const displayTitle = title.length > 60 ? title.slice(0, 57) + "..." : title;
  const displayDesc = description.length > 160 ? description.slice(0, 157) + "..." : description;
  
  // Parse URL for display
  let displayUrl = url;
  try {
    const parsed = new URL(url);
    displayUrl = parsed.hostname + parsed.pathname;
    if (displayUrl.endsWith("/")) displayUrl = displayUrl.slice(0, -1);
  } catch {}

  return (
    <div className="bg-white dark:bg-gray-900 border rounded-lg p-4 max-w-2xl">
      <div className="text-xs text-muted-foreground mb-1">
        Preview of how your page may appear in Google Search Results
      </div>
      
      {/* Google Search Result Style */}
      <div className="mt-3">
        {/* Site name and URL */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {displayUrl.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{displayUrl.split("/")[0]}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
              {displayUrl}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl text-blue-600 dark:text-blue-400 hover:underline cursor-pointer leading-tight mb-1">
          {displayTitle || "No title set"}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {displayDesc || "No meta description set. Google may generate a description from your page content."}
        </p>
      </div>
    </div>
  );
}
