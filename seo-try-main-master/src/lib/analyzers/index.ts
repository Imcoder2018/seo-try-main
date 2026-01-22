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
    overallScore,
    overallGrade,
    recommendations,
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
