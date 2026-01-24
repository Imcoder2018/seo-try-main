"use client";

import { Check, X, AlertTriangle, Info, ChevronDown, ChevronUp, ExternalLink, Shield, Zap, Link2, FileText, Globe, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { VerificationModal } from "./verification-modal";
import { GoogleSearchPreview } from "./google-search-preview";
import { KeywordConsistencyTable } from "./keyword-consistency-table";
import { HeaderHierarchy } from "./header-hierarchy";
import { useViewMode, TECHNICAL_CHECKS } from "./view-mode-toggle";

interface CheckItemProps {
  id: string;
  name: string;
  status: "pass" | "warning" | "fail" | "info";
  message: string;
  value?: Record<string, unknown>;
  forceShow?: boolean;
  sourcePages?: string[];
}

export function CheckItem({ id, name, status, message, value, forceShow, sourcePages }: CheckItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { viewMode } = useViewMode();
  
  // Hide technical checks in simple mode (unless they have issues)
  const isTechnical = TECHNICAL_CHECKS.includes(id);
  const hasIssue = status === "fail" || status === "warning";
  
  if (viewMode === "simple" && isTechnical && !hasIssue && !forceShow) {
    return null;
  }
  
  const statusConfig = {
    pass: {
      icon: Check,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    fail: {
      icon: X,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    info: {
      icon: Info,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  // All checks with value data are expandable to show proof of audit
  const hasExpandableContent: boolean = !!(value && Object.keys(value).length > 0);

  const renderExpandedContent = () => {
    if (!value) return null;

    switch (id) {
      case "searchPreview":
        return (
          <GoogleSearchPreview
            title={(value.title as string) || ""}
            url={(value.url as string) || ""}
            description={(value.description as string) || ""}
          />
        );
      
      case "keywordConsistency":
        return (
          <KeywordConsistencyTable
            keywords={(value.keywords as Array<{
              keyword: string;
              frequency: number;
              inTitle: boolean;
              inMeta: boolean;
              inHeaders: boolean;
            }>) || []}
          />
        );
      
      case "headingStructure":
        return (
          <HeaderHierarchy
            h1={value.h1 as number}
            h2={value.h2 as number}
            h3={value.h3 as number}
            h4={value.h4 as number}
            h5={value.h5 as number}
            h6={value.h6 as number}
            skippedLevels={value.skippedLevels as boolean}
            skippedLevelMessage={value.skippedLevelMessage as string}
          />
        );
      
      case "localKeywords":
        return (
          <div className="space-y-3">
            {(value.cities as string[])?.length > 0 && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Cities/Locations:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(value.cities as string[]).map((city, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-full">{city}</span>
                  ))}
                </div>
              </div>
            )}
            {(value.services as string[])?.length > 0 && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Services:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(value.services as string[]).map((service, i) => (
                    <span key={i} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs rounded-full">{service}</span>
                  ))}
                </div>
              </div>
            )}
            {(value.localPhrases as string[])?.length > 0 && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Local Phrases:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(value.localPhrases as string[]).map((phrase, i) => (
                    <span key={i} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs rounded-full">{phrase}</span>
                  ))}
                </div>
              </div>
            )}
            {value.nearMeOptimized === true && (
              <div className="text-xs text-green-600 dark:text-green-400">✓ Optimized for &quot;near me&quot; searches</div>
            )}
          </div>
        );
      
      case "serviceAreas":
        return (
          <div className="space-y-2">
            {(value.serviceAreas as string[])?.length > 0 && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Detected Service Areas:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(value.serviceAreas as string[]).map((area, i) => (
                    <span key={i} className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs rounded-full">{area}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4 text-xs text-muted-foreground mt-2">
              {value.hasServiceAreaPage === true && <span className="text-green-600">✓ Service Area Page</span>}
              {value.hasServiceAreaSchema === true && <span className="text-green-600">✓ Schema</span>}
              {value.hasMultipleLocations === true && <span className="text-blue-600">📍 Multiple Locations</span>}
            </div>
          </div>
        );
      
      case "localBusinessSchema":
        return (
          <div className="space-y-2">
            {typeof value.schemaType === "string" && value.schemaType && (
              <div className="text-xs">
                <span className="font-medium text-muted-foreground">Schema Type:</span>{" "}
                <span className="text-primary">{value.schemaType}</span>
              </div>
            )}
            <div className="text-xs">
              <span className="font-medium text-muted-foreground">Completeness:</span>{" "}
              <span className={cn(
                (value.completeness as number) >= 70 ? "text-green-600" : 
                (value.completeness as number) >= 40 ? "text-yellow-600" : "text-red-600"
              )}>{value.completeness as number}%</span>
            </div>
            {(value.missingFields as string[])?.length > 0 && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Missing Fields:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(value.missingFields as string[]).slice(0, 5).map((field, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs rounded-full">{field}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        // Generic proof of audit display for all other checks
        return (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              Audit Findings & Proof
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(value).map(([key, val]) => {
                // Skip internal or complex nested objects for display
                if (key === 'recommendation' || val === null || val === undefined) return null;
                
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                
                // Handle different value types
                if (typeof val === 'boolean') {
                  return (
                    <div key={key} className="flex items-center gap-2 text-xs p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className={cn("w-5 h-5 rounded-full flex items-center justify-center", val ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
                        {val ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      </span>
                      <span className="font-medium text-slate-600 dark:text-slate-400">{formattedKey}</span>
                    </div>
                  );
                }
                
                if (Array.isArray(val)) {
                  if (val.length === 0) return null;
                  return (
                    <div key={key} className="col-span-full p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{formattedKey}:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {val.slice(0, 10).map((item, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            {typeof item === 'string' ? item : JSON.stringify(item)}
                          </span>
                        ))}
                        {val.length > 10 && <span className="text-xs text-slate-500">+{val.length - 10} more</span>}
                      </div>
                    </div>
                  );
                }
                
                if (typeof val === 'number') {
                  const isPercentage = key.toLowerCase().includes('percent') || key.toLowerCase().includes('ratio') || key.toLowerCase().includes('score');
                  const isCount = key.toLowerCase().includes('count') || key.toLowerCase().includes('total') || key.toLowerCase().includes('length');
                  return (
                    <div key={key} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs">
                      <span className="font-medium text-slate-600 dark:text-slate-400">{formattedKey}</span>
                      <span className={cn(
                        "font-bold px-2 py-0.5 rounded",
                        isPercentage && val >= 80 ? "bg-green-100 text-green-700" :
                        isPercentage && val >= 50 ? "bg-yellow-100 text-yellow-700" :
                        isPercentage && val < 50 ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {isPercentage ? `${val}%` : isCount ? val : val}
                      </span>
                    </div>
                  );
                }
                
                if (typeof val === 'string' && val.length > 0) {
                  const isUrl = val.startsWith('http') || val.startsWith('/');
                  return (
                    <div key={key} className={cn("p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs", val.length > 60 && "col-span-full")}>
                      <span className="font-medium text-slate-600 dark:text-slate-400">{formattedKey}:</span>
                      {isUrl ? (
                        <a href={val} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline flex items-center gap-1 mt-1">
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate max-w-[300px]">{val}</span>
                        </a>
                      ) : (
                        <span className="ml-1 text-slate-800 dark:text-slate-200 break-words">{val.length > 100 ? val.substring(0, 100) + '...' : val}</span>
                      )}
                    </div>
                  );
                }
                
                return null;
              })}
            </div>
            {sourcePages && sourcePages.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Detected on:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {sourcePages.slice(0, 5).map((url, i) => {
                    try {
                      const pathname = new URL(url).pathname || '/';
                      return (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          {pathname}
                        </a>
                      );
                    } catch { return null; }
                  })}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const statusStyles = {
    pass: "border-l-green-400 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-900/10",
    warning: "border-l-amber-400 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-900/10",
    fail: "border-l-red-400 bg-gradient-to-r from-red-50/50 to-transparent dark:from-red-900/10",
    info: "border-l-blue-400 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10",
  };

  return (
    <div
      id={id}
      className="border-b border-slate-100 dark:border-slate-800 last:border-b-0"
    >
      <div 
        className={cn(
          "flex items-start gap-4 p-4 hover:bg-muted/30 transition-all duration-200 border-l-4 rounded-r-lg",
          statusStyles[status],
          hasExpandableContent && "cursor-pointer hover:shadow-md"
        )}
        onClick={() => hasExpandableContent && setExpanded(!expanded)}
      >
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
            config.bg,
            "ring-2 ring-white dark:ring-slate-800"
          )}
        >
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>
        <div className="flex-1 min-w-0 pr-12">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{name}</h4>
            {hasIssue && (
              <span className={cn(
                "px-2 py-0.5 text-xs font-medium rounded-full",
                status === "fail" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              )}>
                {status === "fail" ? "Issue" : "Warning"}
              </span>
            )}
            {status === "pass" && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Passed
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{message}</p>
          {sourcePages && sourcePages.length > 0 && hasIssue && (
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span className="font-medium">Found on:</span>
              {sourcePages.slice(0, 3).map(url => {
                try { return new URL(url).pathname || '/'; } catch { return url; }
              }).join(', ')}{sourcePages.length > 3 ? ` +${sourcePages.length - 3} more` : ''}
            </p>
          )}
        </div>
        {hasExpandableContent && (
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            expanded ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
          )}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        )}
      </div>
      
      {expanded && hasExpandableContent && (
        <div className="px-4 pb-4 pt-2 ml-14 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-lg border-l-4 border-l-blue-200 dark:border-l-blue-800">
          {renderExpandedContent()}
          
          {/* Verification Button */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowVerification(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Eye className="w-4 h-4" />
              View Audit Details
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Click to see detailed findings from this audit check
            </p>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        checkName={name}
        checkStatus={status}
        sourceUrl={sourcePages?.[0]}
        findings={value || {}}
        sourceCode={(value as any)?.sourceCode || (value as any)?.htmlSnippet}
        detectedElements={(
          Object.entries(value || {}).filter(([key, val]) => 
            typeof val === 'string' && (val.includes('<') || val.includes('>'))
          ).map(([key, val]) => ({
            element: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            snippet: String(val).substring(0, 500),
          }))
        )}
      />
    </div>
  );
}
