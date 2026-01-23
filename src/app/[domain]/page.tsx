"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ReportHeader } from "@/components/report/report-header";
import { CategoryScores } from "@/components/report/category-scores";
import { CategorySection } from "@/components/report/category-section";
import { SidebarNav } from "@/components/report/sidebar-nav";
import { WordPressConnect, BulkFixButton, AutoFixButton } from "@/components/report/wordpress-connect";
import { CheckItem } from "@/components/report/check-item";
import { ScoreRing } from "@/components/report/score-ring";
import { ViewModeProvider, ViewModeToggle } from "@/components/report/view-mode-toggle";
import { ReportActions } from "@/components/report/report-actions";
import { HistoryChart } from "@/components/report/history-chart";
import { Loader2, Zap, Plug, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
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
  localSeoResults: Record<string, unknown> | null;
  seoResults: Record<string, unknown> | null;
  linksResults: Record<string, unknown> | null;
  usabilityResults: Record<string, unknown> | null;
  performanceResults: Record<string, unknown> | null;
  socialResults: Record<string, unknown> | null;
  technologyResults: Record<string, unknown> | null;
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
    links: string[];
    usability: string[];
  };
  pagesAnalyzed?: number;
  pagesFailed?: number;
}

// Map check IDs to WordPress fix actions
const checkToFixAction: Record<string, { action: string; label: string }> = {
  // SEO Basics
  "meta-description": { action: "fix_meta", label: "Generate Meta" },
  "metaDescription": { action: "fix_meta", label: "Generate Meta" },
  "title-tag": { action: "fix_meta", label: "Generate Meta" },
  "title": { action: "fix_meta", label: "Generate Meta" },
  "image-alt": { action: "fix_alt_text", label: "Fix Alt Text" },
  "imageAlt": { action: "fix_alt_text", label: "Fix Alt Text" },
  "og-tags": { action: "fix_og_tags", label: "Enable OG Tags" },
  "openGraph": { action: "fix_og_tags", label: "Enable OG Tags" },
  "twitter-card": { action: "fix_og_tags", label: "Enable Twitter Cards" },
  "xml-sitemap": { action: "fix_sitemap", label: "Generate Sitemap" },
  "xmlSitemap": { action: "fix_sitemap", label: "Generate Sitemap" },
  "robots-txt": { action: "fix_robots", label: "Optimize Robots.txt" },
  "robotsTxt": { action: "fix_robots", label: "Optimize Robots.txt" },
  
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
    const saved = localStorage.getItem(`wp_connection_${domain}`);
    if (saved) {
      const conn = JSON.parse(saved);
      setWpConnected(conn.connected);
    }
  }, [domain]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg">Loading audit results...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-destructive text-lg mb-4">{error || "Audit not found"}</p>
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Run New Audit
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (audit.status === "PENDING" || audit.status === "RUNNING") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <ViewModeProvider>
    <div className="min-h-screen flex flex-col">
      <Header />
      <SidebarNav />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl lg:ml-32 lg:mr-4 lg:max-w-5xl">
          <ReportHeader
            domain={audit.domain}
            score={audit.overallScore || 0}
            grade={audit.overallGrade || "F"}
            createdAt={audit.createdAt}
          />

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Toggle view mode to show more or fewer technical details
            </p>
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Auto-Fix with WordPress Plugin
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Connect your WordPress site to automatically fix SEO issues with one click.
                </p>
              </div>
              <WordPressConnect 
                domain={domain} 
                onConnectionChange={handleConnectionChange}
              />
            </div>

            {wpConnected && fixableIssues.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-sm">
                    <span className="font-medium text-green-600">{fixableIssues.length} issues</span>{" "}
                    can be automatically fixed
                  </p>
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
            localSeoScore={audit.localSeoScore || undefined}
            seoScore={audit.seoScore || 0}
            linksScore={audit.linksScore || 0}
            usabilityScore={audit.usabilityScore || 0}
            performanceScore={audit.performanceScore || 0}
            socialScore={audit.socialScore || 0}
            contentScore={audit.contentScore || undefined}
            eeatScore={audit.eeatScore || undefined}
          />

          {/* Recommendations */}
          {audit.recommendations && audit.recommendations.length > 0 && (
            <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
              <div className="space-y-3">
                {audit.recommendations.map((rec) => {
                  const fix = checkToFixAction[rec.checkId];
                  return (
                    <div 
                      key={rec.id}
                      className="flex items-start justify-between gap-4 p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            rec.priority === "high" 
                              ? "bg-red-100 text-red-700" 
                              : rec.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {rec.priority}
                          </span>
                          <span className="text-xs text-muted-foreground">{rec.category}</span>
                        </div>
                        <h4 className="font-medium mt-1">{rec.title}</h4>
                        {rec.description && (
                          <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                        )}
                      </div>
                      {wpConnected && fix && (
                        <AutoFixButton
                          domain={domain}
                          fixType={fix.action}
                          label={fix.label}
                        />
                      )}
                    </div>
                  );
                })}
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
      <Footer />
    </div>
    </ViewModeProvider>
  );
}

// Sample size explanations for each audit section
const getSampleSizeExplanation = (sectionId: string): string => {
  const explanations: Record<string, string> = {
    'performance': 'We audit the Homepage for speed as it represents your server\'s baseline performance.',
    'technology': 'We audit the Homepage as it represents your site\'s technical foundation.',
    'local-seo': 'We check the Header, Footer, and Contact page where contact info is critical.',
    'seo': 'We analyze content pages (excluding category/tag pages) to assess your SEO efforts.',
    'content': 'We analyze blog and content pages for depth and structure.',
    'links': 'We analyze all pages for internal and external link patterns.',
    'usability': 'We analyze all pages for accessibility and user experience.',
    'social': 'We analyze the Homepage for social media meta tags.',
    'eeat': 'We analyze content pages for expertise and authority signals.',
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
}

function CategorySectionWithFix({ id, title, data, domain, wpConnected, sampleSizeExplanation, fixAction }: CategorySectionWithFixProps) {
  const checks = data.checks as Array<{ id: string; name: string; status: string; message: string; value?: Record<string, unknown> }>;
  const sourcePages = (data as any).sourcePages || [];
  const [showSourcePages, setShowSourcePages] = React.useState(false);
  
  // Count failed checks
  const failedChecks = checks.filter(c => c.status !== "pass" && c.status !== "info").length;
  
  return (
    <div className="bg-card border rounded-xl p-8 mb-8 shadow-sm hover:shadow-md transition-shadow" id={id}>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <ScoreRing score={data.score} grade={data.grade} size="md" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">{title}</h2>
              {data.message && (
                <p className="text-muted-foreground">{data.message}</p>
              )}
              {sampleSizeExplanation && (
                <p className="text-xs text-gray-500 mt-1 italic">ℹ️ {sampleSizeExplanation}</p>
              )}
            </div>
            {/* Section Fix All Button */}
            {wpConnected && fixAction && failedChecks > 0 && (
              <AutoFixButton
                domain={domain}
                fixType={fixAction}
                label={`Fix ${failedChecks} Issue${failedChecks > 1 ? 's' : ''}`}
              />
            )}
          </div>
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
                  {sourcePages.map((url: string, idx: number) => (
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
        {checks.map((check) => {
          const fix = checkToFixAction[check.id];
          const isPassed = check.status === "pass" || check.status === "info";
          
          return (
            <div key={check.id} className="relative">
              <CheckItem
                id={check.id}
                name={check.name}
                status={check.status as "pass" | "warning" | "fail" | "info"}
                message={check.message}
                value={check.value}
              />
              {!isPassed && wpConnected && fix && (
                <div className="absolute right-4 top-4">
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
    </div>
  );
}
