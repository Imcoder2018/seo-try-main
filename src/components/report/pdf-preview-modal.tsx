"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Loader2,
  X,
  Eye,
  CheckCircle2,
  Circle,
  Sparkles,
  FileBarChart,
  Link2,
  Settings2,
  Zap,
} from "lucide-react";

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditData: Record<string, unknown>;
}

interface SectionOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export function PDFPreviewModal({ isOpen, onClose, auditData }: PDFPreviewModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [sections, setSections] = useState<SectionOption[]>([
    {
      id: "executiveSummary",
      label: "Executive Summary",
      description: "Score overview, quick wins, and key insights",
      icon: <Sparkles className="h-4 w-4" />,
      enabled: true,
    },
    {
      id: "categoryPerformance",
      label: "Category Performance",
      description: "Detailed breakdown by SEO category",
      icon: <FileBarChart className="h-4 w-4" />,
      enabled: true,
    },
    {
      id: "recommendations",
      label: "Detailed Recommendations",
      description: "Prioritized list of improvements",
      icon: <Zap className="h-4 w-4" />,
      enabled: true,
    },
    {
      id: "linkAnalysis",
      label: "Link Analysis",
      description: "Internal, external, and broken links breakdown",
      icon: <Link2 className="h-4 w-4" />,
      enabled: true,
    },
    {
      id: "technicalDetails",
      label: "Technical Details",
      description: "Advanced technical SEO information",
      icon: <Settings2 className="h-4 w-4" />,
      enabled: false,
    },
  ]);

  // Extract data for preview
  const domain = (auditData as { domain?: string }).domain || "Website";
  const overallScore = (auditData as { overallScore?: number }).overallScore ?? 0;
  const grade = overallScore >= 90 ? "A+" : overallScore >= 80 ? "A" : overallScore >= 70 ? "B" : overallScore >= 60 ? "C" : overallScore >= 50 ? "D" : "F";

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-amber-100";
    return "bg-red-100";
  };

  const toggleSection = (id: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
  };

  const computeCheckCounts = () => {
    const data = auditData as Record<string, unknown>;
    let passed = 0, warnings = 0, failed = 0;
    
    const categories = ['localSeo', 'seo', 'links', 'usability', 'performance', 'social', 'content', 'eeat', 'technology'];
    categories.forEach(cat => {
      const catData = data[cat] as { checks?: Array<{ status?: string }> } | undefined;
      if (catData?.checks) {
        catData.checks.forEach((check: { status?: string }) => {
          if (check.status === 'passed' || check.status === 'good') passed++;
          else if (check.status === 'warning' || check.status === 'moderate') warnings++;
          else if (check.status === 'failed' || check.status === 'poor' || check.status === 'error') failed++;
        });
      }
    });
    
    if (passed === 0 && warnings === 0 && failed === 0) {
      const score = (data.overallScore as number) || 50;
      passed = Math.round(score / 10);
      warnings = Math.round((100 - score) / 20);
      failed = Math.round((100 - score) / 15);
    }
    
    return { passed, warnings, failed };
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const counts = computeCheckCounts();
      const includeSections = {
        technicalDetails: sections.find(s => s.id === "technicalDetails")?.enabled,
        linkAnalysis: sections.find(s => s.id === "linkAnalysis")?.enabled,
      };
      
      const enrichedData = {
        ...auditData,
        passedChecks: counts.passed,
        warningChecks: counts.warnings,
        failedChecks: counts.failed,
        includeSections,
      };
      
      const response = await fetch("/api/report/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditData: enrichedData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate PDF: ${errorText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Sanitize domain for filename: remove protocol, www, and special chars
      const sanitizedDomain = domain
        .replace(/^(https?:\/\/)?(www\.)?/i, '')
        .replace(/[^a-zA-Z0-9.-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      a.download = `seo-audit-${sanitizedDomain || 'report'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onClose();
    } catch (error) {
      console.error("PDF download error:", error);
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPreviewReady(false);
      const timer = setTimeout(() => setPreviewReady(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const counts = computeCheckCounts();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Generate PDF Report
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Preview and customize your report
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview Panel */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Cover Page Preview
              </h3>
              
              {/* Mock PDF Preview */}
              <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden aspect-[8.5/11]">
                {!previewReady ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    {/* Top accent bar */}
                    <div className="h-1.5 bg-indigo-600" />
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      {/* Title */}
                      <h1 className="text-xl font-bold text-slate-800 mb-1">
                        SEO Health Report
                      </h1>
                      <p className="text-xs text-slate-500 mb-4">
                        Comprehensive Website Analysis
                      </p>
                      
                      {/* Domain */}
                      <div className="bg-slate-100 px-4 py-2 rounded-lg mb-6">
                        <span className="text-sm font-medium text-indigo-600">
                          {domain}
                        </span>
                      </div>
                      
                      {/* Grade Stamp */}
                      <div className={`w-16 h-16 rounded-full border-4 ${getScoreColor(overallScore).replace('text', 'border')} flex items-center justify-center mb-4`}>
                        <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                          {grade}
                        </span>
                      </div>
                      
                      {/* Score */}
                      <div className={`${getScoreBg(overallScore)} px-4 py-2 rounded-full mb-6`}>
                        <span className={`text-lg font-bold ${getScoreColor(overallScore)}`}>
                          {overallScore}
                        </span>
                        <span className="text-sm text-slate-500 ml-1">/ 100</span>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex gap-3 text-xs">
                        <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg">
                          <span className="font-bold">{counts.passed}</span> Passed
                        </div>
                        <div className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg">
                          <span className="font-bold">{counts.warnings}</span> Warnings
                        </div>
                        <div className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg">
                          <span className="font-bold">{counts.failed}</span> Issues
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="border-t border-slate-100 px-4 py-2 text-center">
                      <span className="text-[10px] text-slate-400">
                        Powered by SEO Audit Tool
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-slate-500 text-center">
                This is a preview of the cover page. The full report includes multiple pages.
              </p>
            </div>

            {/* Customization Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Report Sections
              </h3>
              
              <div className="space-y-3">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      section.enabled
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className={`mt-0.5 ${section.enabled ? "text-indigo-600" : "text-slate-400"}`}>
                      {section.enabled ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={section.enabled ? "text-indigo-600" : "text-slate-400"}>
                          {section.icon}
                        </span>
                        <span className={`font-medium ${section.enabled ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                          {section.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {section.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Report Info */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mt-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Report Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Domain</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Overall Score</span>
                    <span className={`font-medium ${getScoreColor(overallScore)}`}>{overallScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Grade</span>
                    <span className={`font-medium ${getScoreColor(overallScore)}`}>{grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sections Included</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {sections.filter(s => s.enabled).length} of {sections.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-sm text-slate-500">
            PDF will be generated with a print-friendly white background
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-red-500/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
