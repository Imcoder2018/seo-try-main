"use client";

import { ScoreRing } from "./score-ring";
import { CheckItem } from "./check-item";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";

interface Check {
  id: string;
  name: string;
  status: string;
  score: number;
  message: string;
  value?: unknown;
  recommendation?: string;
  sourcePages?: string[];
}

interface CategoryData {
  score: number;
  grade: string;
  message?: string;
  checks: Array<Record<string, unknown>>;
  sourcePages?: string[];
}

interface CategorySectionProps {
  id: string;
  title: string;
  data: CategoryData;
  pageTypeInfo?: string;
  sampleSizeExplanation?: string;
}

export function CategorySection({ id, title, data, pageTypeInfo, sampleSizeExplanation }: CategorySectionProps) {
  const checks = data.checks as unknown as Check[];
  const [showSourcePages, setShowSourcePages] = useState(false);
  const sourcePages = data.sourcePages || [];

  return (
    <div className="bg-card border rounded-xl p-8 mb-8" id={id}>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <ScoreRing score={data.score} grade={data.grade} size="md" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          {data.message && (
            <p className="text-muted-foreground">{data.message}</p>
          )}
          {pageTypeInfo && (
            <p className="text-sm text-blue-600 mt-1">📊 {pageTypeInfo}</p>
          )}
          {sampleSizeExplanation && (
            <p className="text-xs text-gray-500 mt-1 italic">ℹ️ {sampleSizeExplanation}</p>
          )}
          {sourcePages.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowSourcePages(!showSourcePages)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {showSourcePages ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span>Analyzed from {sourcePages.length} page{sourcePages.length > 1 ? 's' : ''}</span>
              </button>
              {showSourcePages && (
                <div className="mt-2 pl-5 space-y-1">
                  {sourcePages.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 truncate"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{new URL(url).pathname || '/'}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {checks.map((check) => (
          <CheckItem
            key={check.id}
            id={check.id}
            name={check.name}
            status={check.status as "pass" | "warning" | "fail" | "info"}
            message={check.message}
            value={check.value as Record<string, unknown> | undefined}
            sourcePages={check.sourcePages}
          />
        ))}
      </div>
    </div>
  );
}
