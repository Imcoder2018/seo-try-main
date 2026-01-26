"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { ReportHeader } from "@/components/report/report-header";
import { CategoryScores } from "@/components/report/category-scores";
import { CategorySection } from "@/components/report/category-section";
import { SidebarNav } from "@/components/report/sidebar-nav";
import { WordPressConnect, BulkFixButton, AutoFixButton } from "@/components/report/wordpress-connect";
import { GoogleSearchConsoleConnect } from "@/components/report/google-search-console";
import { CheckItem } from "@/components/report/check-item";
import { ScoreRing } from "@/components/report/score-ring";
import { ViewModeProvider, ViewModeToggle } from "@/components/report/view-mode-toggle";
import { ReportActions } from "@/components/report/report-actions";
import { HistoryChart } from "@/components/report/history-chart";
import { Loader2, Zap, Plug, ExternalLink, ChevronDown, ChevronRight, Check } from "lucide-react";
import React from "react";

interface Audit {
  id: string;
  domain: string;
  url: string;
  status: string;
  overallScore: number | null;
  overallGrade: string | null;
  localSeoScore: number | null;
  seoScore: number | null;
  linksScore: number | null;
  usabilityScore: number | null;
  performanceScore: number | null;
  socialScore: number | null;
  contentScore: number | null;
  eeatScore: number | null;
  technicalSeoScore: number | null;
  localSeoResults: Record<string, unknown> | null;
  seoResults: Record<string, unknown> | null;
  linksResults: Record<string, unknown> | null;
  usabilityResults: Record<string, unknown> | null;
  performanceResults: Record<string, unknown> | null;
  socialResults: Record<string, unknown> | null;
  technologyResults: Record<string, unknown> | null;
  technicalSeoResults: Record<string, unknown> | null;
  contentResults: Record<string, unknown> | null;
  eeatResults: Record<string, unknown> | null;
  recommendations: Array<{
    id: string;
    title: string;
    description: string | null;
    category: string;
    priority: string;
    checkId: string;
    sourcePages?: string[];
  }>;
  createdAt: string;
  // Smart audit fields
  pageClassifications?: Array<{
    url: string;
    type: string;
    title?: string;
  }>;
  auditMapping?: {
    localSeo: string[];
    seo: string[];
    content: string[];
    performance: string[];
    eeat: string[];
    social: string[];
    technology: string[];
    technicalSeo: string[];
    links: string[];
    usability: string[];
  };
  pagesAnalyzed?: number;
  pagesFailed?: number;
}

// Map check IDs to WordPress fix actions
// NOTE: Only includes actions that CAN be fixed remotely via the WordPress plugin
// Actions marked ❌ in docs/WORDPRESS-AUTOFIX-FEATURES.md are excluded
const checkToFixAction: Record<string, { action: string; label: string }> = {
  // SEO Basics - All fixable ✅
  "meta-description": { action: "fix_meta", label: "Generate Meta" },
  "metaDescription": { action: "fix_meta", label: "Generate Meta" },
  "title-tag": { action: "fix_meta", label: "Generate Meta" },
  "title": { action: "fix_meta", label: "Generate Meta" },
  "image-alt": { action: "fix_alt_text", label: "Fix Alt Text" },
  "imageAlt": { action: "fix_alt_text", label: "Fix Alt Text" },
  "image-alt-tags": { action: "fix_alt_text", label: "Fix Alt Text" },
  "og-tags": { action: "fix_og_tags", label: "Enable OG Tags" },
  "openGraph": { action: "fix_og_tags", label: "Enable OG Tags" },
  "open-graph": { action: "fix_og_tags", label: "Enable OG Tags" },
  "twitter-card": { action: "fix_og_tags", label: "Enable Twitter Cards" },
  "xml-sitemap": { action: "fix_sitemap", label: "Generate Sitemap" },
  "xmlSitemap": { action: "fix_sitemap", label: "Generate Sitemap" },
  "sitemap-reference": { action: "fix_sitemap", label: "Generate Sitemap" },
  "robots-txt": { action: "fix_robots", label: "Optimize Robots.txt" },
  "robotsTxt": { action: "fix_robots", label: "Optimize Robots.txt" },
  
  // Technical SEO - Fixable items only
  "indexing-status": { action: "fix_indexing", label: "Fix Indexing" },
  "page-speed-indicators": { action: "fix_cwv", label: "Optimize Speed" },
  // ❌ "mobile-friendliness" - Requires theme/CSS changes, cannot fix remotely
  "https-security": { action: "fix_security", label: "Enable Security" },
  "broken-links": { action: "fix_links", label: "Scan Links" },
  // ❌ "url-structure" - Requires permalink structure changes, cannot fix remotely
  "canonical-tag": { action: "fix_canonical", label: "Add Canonical" },
  "canonical-url": { action: "fix_canonical", label: "Add Canonical" },
  "redirect-issues": { action: "fix_redirects", label: "Fix Redirects" },
  "core-web-vitals-indicators": { action: "fix_cwv", label: "Optimize CWV" },
  
  // On-Page SEO Enhanced - Fixable items only
  "heading-structure": { action: "fix_headings", label: "Fix Headings" },
  // ❌ "keyword-placement" - Requires content rewriting, cannot fix remotely
  // ❌ "url-optimization" - Requires permalink changes, cannot fix remotely
  "internal-linking": { action: "fix_internal_links", label: "Get Suggestions" },
  // ❌ "content-duplication" - Requires human content decisions, cannot fix remotely
  // ❌ "thin-content" - Requires human content creation, cannot fix remotely
  
  // Performance
  "lazy-loading": { action: "fix_lazy_loading", label: "Enable Lazy Loading" },
  "imageLazyLoading": { action: "fix_lazy_loading", label: "Enable Lazy Loading" },
  "image-compression": { action: "fix_compress", label: "Compress Images" },
  "resourceHints": { action: "fix_resource_hints", label: "Add Resource Hints" },
  "preconnect": { action: "fix_resource_hints", label: "Add Preconnect" },
  "jsOptimization": { action: "fix_js_optimization", label: "Optimize JS" },
  "deferJs": { action: "fix_js_optimization", label: "Defer JavaScript" },
  "cssOptimization": { action: "fix_css_optimization", label: "Optimize CSS" },
  "lcpImage": { action: "fix_preload", label: "Preload LCP Image" },
  
  // Security
  "security-headers": { action: "fix_security", label: "Enable Headers" },
  "securityHeaders": { action: "fix_security", label: "Enable Headers" },
  "hsts": { action: "fix_security", label: "Enable HSTS" },
  
  // Schema & Structured Data
  "schema-markup": { action: "fix_schema", label: "Add Schema" },
  "schemaMarkup": { action: "fix_schema", label: "Add Schema" },
  "local-business-schema": { action: "fix_local_schema", label: "Add Local Schema" },
  "localBusinessSchema": { action: "fix_local_schema", label: "Add Local Schema" },
  "faqSchema": { action: "fix_faq_schema", label: "Add FAQ Schema" },
  "breadcrumbSchema": { action: "fix_breadcrumbs", label: "Add Breadcrumbs" },
  
  // Local SEO
  "contactPage": { action: "fix_contact_info", label: "Add Contact Info" },
  "clickToCall": { action: "fix_contact_info", label: "Add Click-to-Call" },
  "phoneNumber": { action: "fix_contact_info", label: "Add Phone" },
  "physicalAddress": { action: "fix_contact_info", label: "Add Address" },
  "businessHours": { action: "fix_business_hours", label: "Add Hours" },
  "googleMap": { action: "fix_map_embed", label: "Add Map" },
  "serviceAreas": { action: "fix_service_areas", label: "Add Service Areas" },
  
  // Trust & E-E-A-T
  "reviews": { action: "fix_testimonials", label: "Add Reviews" },
  "testimonials": { action: "fix_testimonials", label: "Add Testimonials" },
  "authorInfo": { action: "fix_author_info", label: "Add Author Info" },
  "trustBadges": { action: "fix_trust_badges", label: "Add Trust Badges" },
  "reviewSchema": { action: "fix_review_schema", label: "Add Review Schema" },
  
  // Accessibility
  "skipLink": { action: "fix_skip_link", label: "Add Skip Link" },
  "focusIndicators": { action: "fix_focus_styles", label: "Add Focus Styles" },
  "linkWarnings": { action: "fix_link_warnings", label: "Add Link Warnings" },

  // Advanced
  "analytics": { action: "fix_analytics", label: "Add Analytics" },
  "llmsTxt": { action: "fix_llms_txt", label: "Generate llms.txt" },
};

function getFixableIssues(audit: Audit): string[] {
  const fixes: string[] = [];
  const addedActions = new Set<string>();

  audit.recommendations?.forEach((rec) => {
    const fix = checkToFixAction[rec.checkId];
    if (fix && !addedActions.has(fix.action)) {
      fixes.push(fix.action.replace("fix_", ""));
      addedActions.add(fix.action);
    }
  });

  const checkResults = (results: Record<string, unknown> | null) => {
    if (!results?.checks) return;
    const checks = results.checks as Array<{ id: string; passed: boolean }>;
    checks.forEach((check) => {
      if (!check.passed) {
        const fix = checkToFixAction[check.id];
        if (fix && !addedActions.has(fix.action)) {
          fixes.push(fix.action.replace("fix_", ""));
          addedActions.add(fix.action);
        }
      }
    });
  };

  checkResults(audit.localSeoResults);
  checkResults(audit.seoResults);
  checkResults(audit.performanceResults);
  checkResults(audit.socialResults);
  checkResults(audit.technologyResults);

  return fixes;
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = use(params);
  const searchParams = useSearchParams();
  const auditId = searchParams.get("id");
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wpConnected, setWpConnected] = useState(false);
  const [fixableIssues, setFixableIssues] = useState<string[]>([]);

  const handleConnectionChange = useCallback((connected: boolean) => {
    setWpConnected(connected);
  }, []);

  useEffect(() => {
    if (!auditId) {
      setError("No audit ID provided");
      setLoading(false);
      return;
    }

    // First try to get from sessionStorage (most reliable for Vercel)
    const stored = sessionStorage.getItem(`audit_${auditId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setAudit(data);
        if (data.status === "COMPLETED") {
          setFixableIssues(getFixableIssues(data));
        }
        setLoading(false);
        return;
      } catch {
        // If parsing fails, continue to API
      }
    }

    // Fallback: fetch from server (Prisma)
    (async () => {
      try {
        const res = await fetch(`/api/audit/${auditId}`, { cache: "no-store" });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Audit not found");
        }

        const data = await res.json();
        setAudit(data);

        if (data.status === "COMPLETED") {
          setFixableIssues(getFixableIssues(data));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Audit not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [auditId]);

  useEffect(() => {
    // Use global key for WordPress connection
    const globalSaved = localStorage.getItem('wp_connection_global');
    const domainSaved = localStorage.getItem(`wp_connection_${domain}`);
    const saved = globalSaved || domainSaved;
    
    if (saved) {
      const conn = JSON.parse(saved);
      setWpConnected(conn.connected);
    }
  }, [domain]);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg">Loading audit results...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (error || !audit) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-destructive text-lg mb-4">{error || "Audit not found"}</p>
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Run New Audit
            </a>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (audit.status === "PENDING" || audit.status === "RUNNING") {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
            <h2 className="mt-6 text-2xl font-semibold">Analyzing {domain}</h2>
            <p className="mt-2 text-muted-foreground">
              We&apos;re checking your website&apos;s SEO, performance, usability, and more.
              This typically takes 30-60 seconds.
            </p>
            <div className="mt-8 w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <ViewModeProvider>
    <SidebarLayout>
      <SidebarNav />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl lg:ml-32 lg:mr-4 lg:max-w-5xl">
          <ReportHeader
            domain={audit.domain}
            score={audit.overallScore || 0}
            grade={audit.overallGrade || "F"}
            createdAt={audit.createdAt}
            pagesScanned={audit.pagesAnalyzed}
            crawlType={audit.pageClassifications ? "Deep" : "Quick"}
          />

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Switch between <span className="font-medium text-slate-900 dark:text-slate-200">Standard</span> and <span className="font-medium text-slate-900 dark:text-slate-200">Advanced</span> view
              </p>
            </div>
            <ViewModeToggle />
          </div>

          {/* Report Export Actions */}
          <ReportActions auditData={audit as unknown as Record<string, unknown>} />

          {/* Historical Tracking */}
          <HistoryChart 
            domain={audit.domain} 
            currentAudit={audit as unknown as Record<string, unknown>} 
          />

          {/* WordPress Auto-Fix Section */}
          <div className={`rounded-2xl p-6 mb-8 border-2 transition-all ${
            wpConnected 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-300 dark:border-green-700' 
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800'
          }`}>
            {/* Connection Status Banner */}
            {wpConnected && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-green-200 dark:border-green-800">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-green-800 dark:text-green-200 text-lg">🎉 WordPress Connected Successfully!</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Auto-fix buttons are now visible on all sections below</p>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  {wpConnected ? 'WordPress Auto-Fix' : 'Auto-Fix with WordPress Plugin'}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {wpConnected 
                    ? 'Use the fix buttons on each category section to automatically fix issues.' 
                    : 'Connect your WordPress site to automatically fix SEO issues with one click.'}
                </p>
              </div>
              <WordPressConnect 
                domain={domain} 
                onConnectionChange={handleConnectionChange}
              />
            </div>

            {wpConnected && fixableIssues.length > 0 && (
              <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm font-bold rounded-full">
                      {fixableIssues.length} fixable issues
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400">ready for auto-fix</span>
                  </div>
                  <BulkFixButton 
                    domain={domain} 
                    fixes={fixableIssues}
                    onComplete={() => window.location.reload()}
                  />
                </div>
              </div>
            )}

            {!wpConnected && (
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Plug className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">How to connect:</p>
                    <ol className="list-decimal list-inside text-muted-foreground mt-1 space-y-1">
                      <li>Download and install <a href="/downloads/seo-auto-fix.zip" className="text-primary hover:underline">SEO AutoFix Pro plugin</a></li>
                      <li>Go to SEO AutoFix → API / Connect in WordPress</li>
                      <li>Enable Remote API and copy your API key</li>
                      <li>Click &quot;Connect WordPress&quot; above and paste your credentials</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>

          <CategoryScores
            localSeoScore={audit.localSeoScore ?? undefined}
            seoScore={audit.seoScore || 0}
            linksScore={audit.linksScore || 0}
            usabilityScore={audit.usabilityScore || 0}
            performanceScore={audit.performanceScore || 0}
            socialScore={audit.socialScore || 0}
            contentScore={audit.contentScore ?? undefined}
            eeatScore={audit.eeatScore ?? undefined}
            technicalSeoScore={audit.technicalSeoScore ?? undefined}
          />

          {/* Recommendations */}
          {audit.recommendations && audit.recommendations.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5"></div>
              <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recommendations</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{audit.recommendations.length} improvements suggested</p>
                    </div>
                  </div>
                  {wpConnected && (
                    <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Auto-Fix Available
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {audit.recommendations.map((rec) => {
                    const fix = checkToFixAction[rec.checkId];
                    return (
                      <div 
                        key={rec.id}
                        className="flex items-start justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-colors group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wide ${
                              rec.priority === "high" 
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" 
                                : rec.priority === "medium"
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            }`}>
                              {rec.priority}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{rec.category}</span>
                          </div>
                          <h4 className="font-semibold mt-2 text-slate-900 dark:text-slate-100">{rec.title}</h4>
                          {rec.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{rec.description}</p>
                          )}
                        </div>
                        {wpConnected && fix && (
                          <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                            <AutoFixButton
                              domain={domain}
                              fixType={fix.action}
                              label={fix.label}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {audit.localSeoResults && (
            <CategorySectionWithFix
              id="local-seo"
              title="Local SEO Results"
              data={audit.localSeoResults as { score: number; grade: string; message?: string; checks: Array<Record<string, unknown>> }}
              domain={domain}
              wpConnected={wpConnected}
              fixAction="fix_local_seo"
              sampleSizeExplanation={getSampleSizeExplanation('local-seo')}
            />
          )}

          {audit.seoResults && (
            <CategorySectionWithFix
              id="seo"
              title="On-Page SEO Results"
              data={audit.seoResults as { score: number; grade: string; message?: string; checks: Array<Record<string, unknown>> }}
              domain={domain}
              wpConnected={wpConnected}
              fixAction="fix_onpage"
              sampleSizeExplanation={getSampleSizeExplanation('seo')}
            />
          )}

          {audit.technicalSeoResults && (
            <CategorySectionWithFix
              id="technical-seo"
              title="Technical SEO"
              data={audit.technicalSeoResults as { score: number; grade: string; message?: string; checks: Array<Record<string, unknown>> }}
              domain={domain}
              wpConnected={wpConnected}
              fixAction="fix_technical_seo"
              sampleSizeExplanation={getSampleSizeExplanation('technical-seo')}
              showGoogleSearchConsole={true}
            />
          )}

          {audit.linksResults && (
            <CategorySectionWithFix
              id="links"
              title="Links Analysis"
              data={audit.linksResults as { score: number; grade: string; message?: string; checks: Array<Record<string, unknown>> }}
              domain={domain}
              wpConnected={wpConnected}
              fixAction="fix_links"
              sampleSizeExplanation={getSampleSizeExplanation('links')}
            />
          )}

          {audit.usabilityResults && (
            <CategorySectionWithFix
              id="usability"
              title="Usability Results"
              data={audit.usabilityResults as { score: number; grade: string; message?: string; checks: Array<Record<string, unknown>> }}
              domain={domain}
              wpConnected={wpConnected}
              fixAction="fix_usability"
              sampleSizeExplanation={getSampleSizeExplanation('usability')}
            />
          )}

          {audit.performanceResults && (
            <CategorySectionWithFix
              id="performance"
              title="Performance Results"
              data={audit.performanceResults as { score: number; grade: string; message?: string; checks: Array<Record<string, unknown>> }}
              domain={domain}
              wpConnected={wpConnected}
              fixAction="fix_performance"
              sampleSizeExplanation={getSampleSizeExplanation('performance')}
            />
          )}

          {audit.socialResults && (
            <CategorySectionWithFix
              id="social"
              title="Social Results"
              data={audit.socialResults as { score: number; grade: string; message?: string; checks: Array<Record<string, unknown>> }}
              domain={domain}
              wpConnected={wpConnected}
              fixAction="fix_social"
              sampleSizeExplanation={getSampleSizeExplanation('social')}
            />
          )}

          {audit.technologyResults && (
            <CategorySectionWithFix
              id="technology"
              title="Technology Results"
              data={audit.technologyResults as { score: number; grade: string; message?: string; checks: Array<Record<string, unknown>> }}
              domain={domain}
              wpConnected={wpConnected}
              fixAction="fix_technology"
              sampleSizeExplanation={getSampleSizeExplanation('technology')}
            />
          )}

          {audit.contentResults && (
            <CategorySectionWithFix
              id="content"
              title="Content Quality"
              data={audit.contentResults as { score: number; grade: string; message?: string; checks: Array<Record<string, unknown>> }}
              domain={domain}
              wpConnected={wpConnected}
              fixAction="fix_content"
              sampleSizeExplanation={getSampleSizeExplanation('content')}
            />
          )}

          {audit.eeatResults && (
            <CategorySectionWithFix
              id="eeat"
              title="E-E-A-T Signals"
              data={audit.eeatResults as { score: number; grade: string; message?: string; checks: Array<Record<string, unknown>> }}
              domain={domain}
              wpConnected={wpConnected}
              fixAction="fix_eeat"
              sampleSizeExplanation={getSampleSizeExplanation('eeat')}
            />
          )}

          {/* Download Plugin CTA */}
          {!wpConnected && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-xl p-6 mt-8 text-center">
              <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fix All Issues Automatically</h3>
              <p className="text-muted-foreground mb-4">
                Install the SEO AutoFix Pro WordPress plugin to fix issues with one click
              </p>
              <a
                href="/downloads/seo-auto-fix.zip"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                Download Plugin
              </a>
            </div>
          )}
        </div>
      </main>
    </SidebarLayout>
    </ViewModeProvider>
  );
}

// Sample size explanations for each audit section
const getSampleSizeExplanation = (sectionId: string): string => {
  const explanations: Record<string, string> = {
    'performance': 'We audit Homepage, Service Pages, and Product Pages using Google PageSpeed Insights API for comprehensive Core Web Vitals analysis.',
    'technology': 'We audit the Homepage and Contact page as they represent your site\'s technical foundation.',
    'technical-seo': 'We analyze all pages for indexing, sitemaps, page speed indicators, mobile-friendliness, security, broken links, URL structure, canonical tags, and redirects.',
    'local-seo': 'We check the Header, Footer, and Contact page where contact info is critical.',
    'seo': 'We analyze content pages (excluding category/tag pages) to assess your SEO efforts.',
    'content': 'We analyze blog and content pages for depth and structure.',
    'links': 'We analyze all pages for internal and external link patterns.',
    'usability': 'We analyze Homepage and Contact page for accessibility and user experience.',
    'social': 'We analyze the Homepage for social media meta tags.',
    'eeat': 'We analyze About and content pages for expertise and authority signals.',
  };
  return explanations[sectionId] || '';
};

// Category Section with Fix buttons
interface CategorySectionWithFixProps {
  id: string;
  title: string;
  data: { score: number; grade: string; message?: string; checks: Array<Record<string, unknown>> };
  domain: string;
  wpConnected: boolean;
  sampleSizeExplanation?: string;
  fixAction?: string;
  showGoogleSearchConsole?: boolean;
}

function CategorySectionWithFix({ id, title, data, domain, wpConnected, sampleSizeExplanation, fixAction, showGoogleSearchConsole }: CategorySectionWithFixProps) {
  const checks = data.checks as Array<{ 
    id: string; 
    name: string; 
    status: string; 
    message: string; 
    value?: Record<string, unknown>; 
    sourcePages?: string[];
    perPageFindings?: Array<{
      url: string;
      pathname: string;
      status: string;
      score: number;
      value: Record<string, unknown>;
      message: string;
    }>;
  }>;
  const sourcePages = (data as any).sourcePages || [];
  const [showSourcePages, setShowSourcePages] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false); // Default collapsed
  
  // Count failed checks
  const failedChecks = checks.filter(c => c.status !== "pass" && c.status !== "info").length;
  const passedChecks = checks.filter(c => c.status === "pass").length;
  
  // Get grade color
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'from-green-500 to-emerald-500';
    if (grade.startsWith('B')) return 'from-blue-500 to-indigo-500';
    if (grade.startsWith('C')) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };
  
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden mb-8 shadow-lg hover:shadow-xl transition-all" id={id}>
      {/* Header with gradient accent */}
      <div className={`h-1.5 bg-gradient-to-r ${getGradeColor(data.grade)}`}></div>
      
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6 mb-4">
          <div className="flex-shrink-0">
            <ScoreRing score={data.score} grade={data.grade} size="md" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{title}</h2>
                {data.message && (
                  <p className="text-slate-600 dark:text-slate-400">{data.message}</p>
                )}
                {sampleSizeExplanation && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg inline-block">
                    <span className="text-blue-500">ℹ️</span> {sampleSizeExplanation}
                  </p>
                )}
                {/* Quick stats */}
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                    ✓ {passedChecks} passed
                  </span>
                  {failedChecks > 0 && (
                    <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full font-medium">
                      ✗ {failedChecks} issues
                    </span>
                  )}
                </div>
              </div>
              {/* Section Fix All Button */}
              {wpConnected && fixAction && failedChecks > 0 && (
                <AutoFixButton
                  domain={domain}
                  fixType={fixAction}
                  label={`Fix All ${failedChecks} Issue${failedChecks > 1 ? 's' : ''}`}
                />
              )}
            </div>
            {sourcePages.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowSourcePages(!showSourcePages)}
                  className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg"
                >
                  {showSourcePages ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span>Analyzed from {sourcePages.length} page{sourcePages.length > 1 ? 's' : ''}</span>
                </button>
                {showSourcePages && (
                  <div className="mt-2 ml-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                    {sourcePages.map((url: string, idx: number) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate py-0.5"
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

        {/* Google Search Console Integration for Technical SEO */}
        {showGoogleSearchConsole && (
          <GoogleSearchConsoleConnect domain={domain} />
        )}

        {/* Expand/Collapse toggle for checks */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mb-4 mt-4"
        >
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {isExpanded ? 'Hide' : 'Show'} {checks.length} Audit Checks & Proof
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click to {isExpanded ? 'collapse' : 'expand'}
          </span>
        </button>

        {/* Checks list - collapsible */}
        {isExpanded && (
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 animate-in slide-in-from-top-2 duration-200">
            {checks.map((check) => {
              const fix = checkToFixAction[check.id];
              const isPassed = check.status === "pass" || check.status === "info";
              
              return (
                <div key={check.id} className="relative group">
                  <CheckItem
                    id={check.id}
                    name={check.name}
                    status={check.status as "pass" | "warning" | "fail" | "info"}
                    message={check.message}
                    value={check.value}
                    sourcePages={check.sourcePages}
                    perPageFindings={check.perPageFindings}
                  />
                  {!isPassed && wpConnected && fix && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <AutoFixButton
                        domain={domain}
                        fixType={fix.action}
                        label={fix.label}
                        checkId={check.id}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
