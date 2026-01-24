"use client";

import { X, ExternalLink, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkName: string;
  checkStatus: "pass" | "warning" | "fail" | "info";
  sourceCode?: string;
  sourceUrl?: string;
  findings: Record<string, unknown>;
  detectedElements?: Array<{
    element: string;
    snippet: string;
    line?: number;
  }>;
}

export function VerificationModal({
  isOpen,
  onClose,
  checkName,
  checkStatus,
  sourceCode,
  sourceUrl,
  findings,
  detectedElements = [],
}: VerificationModalProps) {
  if (!isOpen) return null;

  const statusConfig = {
    pass: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30", label: "Passed" },
    warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", label: "Warning" },
    fail: { icon: XCircle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30", label: "Failed" },
    info: { icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", label: "Info" },
  };

  const config = statusConfig[checkStatus];
  const StatusIcon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", config.bg)}>
              <StatusIcon className={cn("w-5 h-5", config.color)} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Verification: {checkName}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.bg, config.color)}>
                  {config.label}
                </span>
                {sourceUrl && (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Page
                  </a>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Header Badge */}
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-slate-200 dark:border-slate-700">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
            📋 Audit Findings
          </span>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-4">
          <div className="space-y-4">
              {/* Summary */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  What We Checked
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Our audit tool analyzed the HTML source code of your webpage to verify this SEO element.
                  Below are the actual findings from the audit.
                </p>
              </div>

              {/* Findings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(findings).map(([key, val]) => {
                  if (val === null || val === undefined || key === "recommendation") return null;
                  
                  const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

                  return (
                    <div
                      key={key}
                      className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                        {formattedKey}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {typeof val === "boolean" ? (
                          <span className={cn("flex items-center gap-1", val ? "text-green-600" : "text-red-600")}>
                            {val ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {val ? "Yes" : "No"}
                          </span>
                        ) : Array.isArray(val) ? (
                          <span>{val.length} items found</span>
                        ) : typeof val === "number" ? (
                          <span className="text-blue-600">{val}</span>
                        ) : (
                          <span className="break-words">{String(val).substring(0, 100)}{String(val).length > 100 ? "..." : ""}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detected Elements */}
              {detectedElements.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Detected Elements
                  </h3>
                  <div className="space-y-2">
                    {detectedElements.map((el, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            {el.element}
                          </span>
                          {el.line && (
                            <span className="text-xs text-slate-500">Line {el.line}</span>
                          )}
                        </div>
                        <code className="text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2 rounded block overflow-x-auto">
                          {el.snippet}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This verification shows exactly what our audit tool detected in your page&apos;s HTML source.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
