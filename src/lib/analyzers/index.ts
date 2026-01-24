import type { AnalysisResult, PageData, Recommendation, CategoryResult, Check } from "./types";
import { analyzeSEO } from "./seo-analyzer";
import { analyzeLinks } from "./links-analyzer";
import { analyzeUsability } from "./usability-analyzer";
import { analyzePerformance } from "./performance-analyzer";
import { analyzeSocial } from "./social-analyzer";
import { analyzeTechnology } from "./technology-analyzer";
import { analyzeContent } from "./content-analyzer";
import { analyzeEEAT } from "./eeat-analyzer";
import { analyzeLocalSEO } from "./local-seo-analyzer";
import { calculateGrade } from "../utils";

export * from "./types";

const CATEGORY_WEIGHTS = {
  localSeo: 25,
  seo: 15,
  links: 10,
  usability: 10,
  performance: 10,
  social: 5,
  technology: 5,
  content: 8,
  eeat: 8,
  technicalSeo: 4,
};

export async function fetchPage(url: string): Promise<PageData> {
  const startTime = Date.now();
  
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    redirect: "follow",
  });

  const responseTime = Date.now() - startTime;
  const html = await response.text();
  
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  return {
    url: response.url, // Final URL after redirects
    html,
    headers,
    responseTime,
    statusCode: response.status,
    contentLength: html.length,
    isHttps: response.url.startsWith("https://"),
  };
}

interface AnalyzeOptions {
  selectedUrls?: string[];
  crawlData?: any;
}

async function analyzeMultiplePages(baseUrl: string, urlsToAudit: string[], crawlData?: any): Promise<AnalysisResult> {
  console.log(`Starting multi-page audit for ${urlsToAudit.length} pages`);

  // Fetch and analyze all selected pages
  const pageResults = await Promise.all(
    urlsToAudit.map(async (url) => {
      try {
        const pageData = await fetchPage(url);
        const [seo, links, usability, performance, social, technology, content, eeat, localSeo] = await Promise.all([
          Promise.resolve(analyzeSEO(pageData)),
          analyzeLinks(pageData),
          Promise.resolve(analyzeUsability(pageData)),
          analyzePerformance(pageData),
          Promise.resolve(analyzeSocial(pageData)),
          analyzeTechnology(pageData),
          Promise.resolve(analyzeContent(pageData)),
          Promise.resolve(analyzeEEAT(pageData)),
          Promise.resolve(analyzeLocalSEO(pageData)),
        ]);

        return {
          url,
          success: true,
          seo,
          links,
          usability,
          performance,
          social,
          technology,
          content,
          eeat,
          localSeo,
        };
      } catch (error) {
        console.error(`Error analyzing ${url}:`, error);
        return {
          url,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    })
  );

  // Aggregate results across all pages
  const successfulResults = pageResults.filter(r => r.success);
  const failedResults = pageResults.filter(r => !r.success);

  if (successfulResults.length === 0) {
    throw new Error('All pages failed to analyze');
  }

  // Calculate average scores across all successful pages
  const avgScore = (results: any[]) => {
    const sum = results.reduce((acc, r) => acc + r.score, 0);
    return Math.round(sum / results.length);
  };

  // Aggregate checks across all pages
  const aggregateChecks = (results: any[]) => {
    const checkMap = new Map<string, Check & { pageCount: number }>();
    
    results.forEach(result => {
      result.checks?.forEach((check: Check) => {
        const existing = checkMap.get(check.id);
        
        if (!existing) {
          // First time seeing this check
          checkMap.set(check.id, { ...check, pageCount: 1 });
        } else {
          // Update existing check - if any page fails, the overall check fails
          if (check.status === 'fail' || existing.status === 'fail') {
            existing.status = 'fail';
          } else if (check.status === 'warning' || existing.status === 'warning') {
            existing.status = 'warning';
          }
          existing.pageCount += 1;
        }
      });
    });
    
    return Array.from(checkMap.values()).map(({ pageCount, ...rest }) => rest);
  };

  const aggregatedLocalSeo = {
    score: avgScore(successfulResults.map(r => r.localSeo)),
    grade: calculateGrade(avgScore(successfulResults.map(r => r.localSeo))),
    message: `${successfulResults.length} pages analyzed`,
    checks: aggregateChecks(successfulResults.map(r => r.localSeo)),
  };

  const aggregatedSeo = {
    score: avgScore(successfulResults.map(r => r.seo)),
    grade: calculateGrade(avgScore(successfulResults.map(r => r.seo))),
    message: `${successfulResults.length} pages analyzed`,
    checks: aggregateChecks(successfulResults.map(r => r.seo)),
  };

  const aggregatedLinks = {
    score: avgScore(successfulResults.map(r => r.links)),
    grade: calculateGrade(avgScore(successfulResults.map(r => r.links))),
    message: `${successfulResults.length} pages analyzed`,
    checks: aggregateChecks(successfulResults.map(r => r.links)),
  };

  const aggregatedUsability = {
    score: avgScore(successfulResults.map(r => r.usability)),
    grade: calculateGrade(avgScore(successfulResults.map(r => r.usability))),
    message: `${successfulResults.length} pages analyzed`,
    checks: aggregateChecks(successfulResults.map(r => r.usability)),
  };

  const aggregatedPerformance = {
    score: avgScore(successfulResults.map(r => r.performance)),
    grade: calculateGrade(avgScore(successfulResults.map(r => r.performance))),
    message: `${successfulResults.length} pages analyzed`,
    checks: aggregateChecks(successfulResults.map(r => r.performance)),
  };

  const aggregatedSocial = {
    score: avgScore(successfulResults.map(r => r.social)),
    grade: calculateGrade(avgScore(successfulResults.map(r => r.social))),
    message: `${successfulResults.length} pages analyzed`,
    checks: aggregateChecks(successfulResults.map(r => r.social)),
  };

  const aggregatedTechnology = {
    score: avgScore(successfulResults.map(r => r.technology)),
    grade: calculateGrade(avgScore(successfulResults.map(r => r.technology))),
    message: `${successfulResults.length} pages analyzed`,
    checks: aggregateChecks(successfulResults.map(r => r.technology)),
  };

  const aggregatedContent = {
    score: avgScore(successfulResults.map(r => r.content)),
    grade: calculateGrade(avgScore(successfulResults.map(r => r.content))),
    message: `${successfulResults.length} pages analyzed`,
    checks: aggregateChecks(successfulResults.map(r => r.content)),
  };

  const aggregatedEEAT = {
    score: avgScore(successfulResults.map(r => r.eeat)),
    grade: calculateGrade(avgScore(successfulResults.map(r => r.eeat))),
    message: `${successfulResults.length} pages analyzed`,
    checks: aggregateChecks(successfulResults.map(r => r.eeat)),
  };

  // Calculate overall score
  const overallScore = Math.round(
    (aggregatedLocalSeo.score * CATEGORY_WEIGHTS.localSeo +
      aggregatedSeo.score * CATEGORY_WEIGHTS.seo +
      aggregatedLinks.score * CATEGORY_WEIGHTS.links +
      aggregatedUsability.score * CATEGORY_WEIGHTS.usability +
      aggregatedPerformance.score * CATEGORY_WEIGHTS.performance +
      aggregatedSocial.score * CATEGORY_WEIGHTS.social +
      aggregatedTechnology.score * CATEGORY_WEIGHTS.technology +
      aggregatedContent.score * CATEGORY_WEIGHTS.content +
      aggregatedEEAT.score * CATEGORY_WEIGHTS.eeat) /
      100
  );

  const overallGrade = calculateGrade(overallScore);

  // Generate recommendations from all categories
  const recommendations = generateRecommendations({
    localSeo: aggregatedLocalSeo,
    seo: aggregatedSeo,
    links: aggregatedLinks,
    usability: aggregatedUsability,
    performance: aggregatedPerformance,
    social: aggregatedSocial,
    technology: aggregatedTechnology,
    content: aggregatedContent,
    eeat: aggregatedEEAT,
  });

  return {
    overallScore,
    overallGrade,
    localSeo: aggregatedLocalSeo,
    seo: aggregatedSeo,
    links: aggregatedLinks,
    usability: aggregatedUsability,
    performance: aggregatedPerformance,
    social: aggregatedSocial,
    technology: aggregatedTechnology,
    content: aggregatedContent,
    eeat: aggregatedEEAT,
    recommendations,
  } as AnalysisResult & { pagesAnalyzed: number; pagesFailed: number };
}

export async function analyzeWebsite(url: string, options?: AnalyzeOptions): Promise<AnalysisResult> {
  // If multi-page audit is requested
  if (options?.selectedUrls && options.selectedUrls.length > 1) {
    return await analyzeMultiplePages(url, options.selectedUrls, options.crawlData);
  }

  // Single page audit
  const pageData = await fetchPage(url);

  // Run all analyzers
  const [seo, links, usability, performance, social, technology, content, eeat, localSeo] = await Promise.all([
    Promise.resolve(analyzeSEO(pageData)),
    analyzeLinks(pageData),
    Promise.resolve(analyzeUsability(pageData)),
    analyzePerformance(pageData),
    Promise.resolve(analyzeSocial(pageData)),
    analyzeTechnology(pageData),
    Promise.resolve(analyzeContent(pageData)),
    Promise.resolve(analyzeEEAT(pageData)),
    Promise.resolve(analyzeLocalSEO(pageData)),
  ]);

  // Calculate overall score
  const overallScore = Math.round(
    (localSeo.score * CATEGORY_WEIGHTS.localSeo +
      seo.score * CATEGORY_WEIGHTS.seo +
      links.score * CATEGORY_WEIGHTS.links +
      usability.score * CATEGORY_WEIGHTS.usability +
      performance.score * CATEGORY_WEIGHTS.performance +
      social.score * CATEGORY_WEIGHTS.social +
      technology.score * CATEGORY_WEIGHTS.technology +
      content.score * CATEGORY_WEIGHTS.content +
      eeat.score * CATEGORY_WEIGHTS.eeat) /
      100
  );

  const overallGrade = calculateGrade(overallScore);

  // Analyze Technical SEO
  const technicalSeo = analyzeTechnicalSEOBasic(pageData);

  // Generate recommendations from all categories
  const recommendations = generateRecommendations({
    localSeo,
    seo,
    links,
    usability,
    performance,
    social,
    technology,
    content,
    eeat,
  });

  return {
    localSeo,
    seo,
    links,
    usability,
    performance,
    social,
    technology,
    content,
    eeat,
    technicalSeo,
    overallScore,
    overallGrade,
    recommendations,
  };
}

function analyzeTechnicalSEOBasic(pageData: PageData): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // Check for robots meta tag
  const robotsFullMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*>/i);
  const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
  const robotsContent = robotsMatch ? robotsMatch[1].toLowerCase() : '';
  const isIndexable = !robotsContent.includes('noindex');
  
  checks.push({
    id: 'indexing-status',
    name: 'Indexing Status',
    status: isIndexable ? 'pass' : 'fail',
    score: isIndexable ? 100 : 0,
    weight: 15,
    value: { 
      isIndexable, 
      robotsDirective: robotsContent || 'index, follow (default)',
      htmlSnippet: robotsFullMatch ? robotsFullMatch[0] : '<meta name="robots" content="index, follow"> (default - not explicitly set)'
    },
    message: isIndexable ? 'Page is indexable' : 'Page has noindex directive',
    recommendation: !isIndexable ? 'Remove noindex directive to allow search engines to index this page' : undefined,
  });
  
  // Check canonical tag
  const canonicalFullMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  const hasCanonical = !!canonicalMatch;
  
  checks.push({
    id: 'canonical-tag',
    name: 'Canonical Tag',
    status: hasCanonical ? 'pass' : 'warning',
    score: hasCanonical ? 100 : 50,
    weight: 10,
    value: { 
      hasCanonical, 
      canonicalUrl: canonicalMatch ? canonicalMatch[1] : null,
      htmlSnippet: canonicalFullMatch ? canonicalFullMatch[0] : 'No canonical tag found'
    },
    message: hasCanonical ? `Canonical URL set: ${canonicalMatch![1]}` : 'No canonical tag found',
    recommendation: !hasCanonical ? 'Add a canonical tag to prevent duplicate content issues' : undefined,
  });
  
  // Check HTTPS
  const isHttps = pageData.isHttps;
  
  checks.push({
    id: 'https-security',
    name: 'HTTPS Security',
    status: isHttps ? 'pass' : 'fail',
    score: isHttps ? 100 : 0,
    weight: 15,
    value: { 
      isHttps,
      htmlSnippet: isHttps ? '<!-- Page served over HTTPS -->' : '<!-- WARNING: Page not served over HTTPS -->'
    },
    message: isHttps ? 'Page served over HTTPS' : 'Page not served over HTTPS',
    recommendation: !isHttps ? 'Enable HTTPS to secure your website' : undefined,
  });
  
  // Check viewport
  const viewportFullMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
  const hasViewport = !!viewportFullMatch;
  
  checks.push({
    id: 'mobile-friendliness',
    name: 'Mobile Friendliness',
    status: hasViewport ? 'pass' : 'fail',
    score: hasViewport ? 100 : 0,
    weight: 10,
    value: { 
      hasViewport,
      htmlSnippet: viewportFullMatch ? viewportFullMatch[0] : 'No viewport meta tag found'
    },
    message: hasViewport ? 'Viewport meta tag found' : 'No viewport meta tag',
    recommendation: !hasViewport ? 'Add viewport meta tag for mobile responsiveness' : undefined,
  });
  
  // Check page speed indicators (resource count)
  const scripts = (html.match(/<script[^>]*>/gi) || []).length;
  const stylesheets = (html.match(/<link[^>]*rel=["']stylesheet["']/gi) || []).length;
  const totalResources = scripts + stylesheets;
  
  checks.push({
    id: 'page-speed-indicators',
    name: 'Page Speed (Resource Count)',
    status: totalResources <= 10 ? 'pass' : totalResources <= 20 ? 'warning' : 'fail',
    score: totalResources <= 10 ? 100 : totalResources <= 20 ? 70 : 40,
    weight: 12,
    value: { 
      scripts, 
      stylesheets, 
      totalResources,
      htmlSnippet: `<!-- Found ${scripts} scripts and ${stylesheets} stylesheets (${totalResources} total) -->`
    },
    message: `Found ${scripts} scripts, ${stylesheets} stylesheets (${totalResources} total resources)`,
    recommendation: totalResources > 15 ? 'Reduce render-blocking resources for better page speed' : undefined,
  });
  
  // Check for structured data
  const hasJsonLd = html.includes('application/ld+json');
  const hasMicrodata = html.includes('itemscope') || html.includes('itemtype');
  const hasStructuredData = hasJsonLd || hasMicrodata;
  
  checks.push({
    id: 'structured-data',
    name: 'Structured Data',
    status: hasStructuredData ? 'pass' : 'warning',
    score: hasStructuredData ? 100 : 50,
    weight: 8,
    value: { 
      hasJsonLd, 
      hasMicrodata,
      htmlSnippet: hasJsonLd ? '<script type="application/ld+json">...</script>' : hasMicrodata ? '<!-- Microdata found -->' : 'No structured data found'
    },
    message: hasStructuredData ? `Structured data found (${hasJsonLd ? 'JSON-LD' : 'Microdata'})` : 'No structured data detected',
    recommendation: !hasStructuredData ? 'Add structured data (JSON-LD recommended) for rich search results' : undefined,
  });
  
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore = checks.reduce((sum, c) => sum + (c.score * c.weight), 0);
  const score = Math.round(weightedScore / totalWeight);
  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'F';
  
  return {
    score,
    grade,
    message: score >= 80 ? 'Technical SEO is well optimized' : score >= 60 ? 'Some technical SEO improvements needed' : 'Technical SEO needs attention',
    checks,
  };
}

function generateRecommendations(categories: {
  localSeo: CategoryResult;
  seo: CategoryResult;
  links: CategoryResult;
  usability: CategoryResult;
  performance: CategoryResult;
  social: CategoryResult;
  technology: CategoryResult;
  content: CategoryResult;
  eeat: CategoryResult;
}): Recommendation[] {
  const recommendations: Recommendation[] = [];
  let id = 0;

  const categoryMapping: Record<string, { name: string; weight: number }> = {
    localSeo: { name: "Local SEO", weight: CATEGORY_WEIGHTS.localSeo },
    seo: { name: "On-Page SEO", weight: CATEGORY_WEIGHTS.seo },
    links: { name: "Links", weight: CATEGORY_WEIGHTS.links },
    usability: { name: "Usability", weight: CATEGORY_WEIGHTS.usability },
    performance: { name: "Performance", weight: CATEGORY_WEIGHTS.performance },
    social: { name: "Social", weight: CATEGORY_WEIGHTS.social },
    technology: { name: "Technology", weight: CATEGORY_WEIGHTS.technology },
    content: { name: "Content Quality", weight: CATEGORY_WEIGHTS.content },
    eeat: { name: "E-E-A-T", weight: CATEGORY_WEIGHTS.eeat },
  };

  for (const [categoryKey, result] of Object.entries(categories)) {
    const categoryInfo = categoryMapping[categoryKey];
    
    for (const check of result.checks) {
      if (check.recommendation) {
        // Determine priority based on score and weight
        let priority: "HIGH" | "MEDIUM" | "LOW";
        if (check.score === 0 && check.weight >= 10) {
          priority = "HIGH";
        } else if (check.score < 50 && check.weight >= 8) {
          priority = "MEDIUM";
        } else {
          priority = "LOW";
        }

        recommendations.push({
          id: `rec_${id++}`,
          title: check.recommendation,
          description: check.message,
          category: categoryInfo.name,
          priority,
          checkId: check.id,
        });
      }
    }
  }

  // Sort by priority
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}
