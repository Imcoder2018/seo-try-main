"use client";

import { Check, X, AlertTriangle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
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

  // Check if this item has expandable content
  const hasExpandableContent: boolean = 
    id === "searchPreview" || 
    id === "keywordConsistency" || 
    id === "headingStructure" ||
    id === "localKeywords" ||
    id === "serviceAreas" ||
    id === "localBusinessSchema";

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
        return null;
    }
  };

  return (
    <div
      id={id}
      className="border-b last:border-b-0"
    >
      <div 
        className={cn(
          "flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors",
          hasExpandableContent && "cursor-pointer bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-l-blue-400"
        )}
        onClick={() => hasExpandableContent && setExpanded(!expanded)}
      >
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            config.bg
          )}
        >
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-1">{name}</h4>
          <p className="text-sm text-muted-foreground">{message}</p>
          {sourcePages && sourcePages.length > 0 && hasIssue && (
            <p className="text-xs text-gray-500 mt-1">
              Found on: {sourcePages.slice(0, 3).map(url => {
                try { return new URL(url).pathname || '/'; } catch { return url; }
              }).join(', ')}{sourcePages.length > 3 ? ` +${sourcePages.length - 3} more` : ''}
            </p>
          )}
        </div>
        {hasExpandableContent && (
          <div className="flex-shrink-0 text-muted-foreground">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        )}
      </div>
      
      {expanded && hasExpandableContent && (
        <div className="px-4 pb-4 pt-0 ml-12">
          {renderExpandedContent()}
        </div>
      )}
    </div>
  );
}
