import { task, metadata } from "@trigger.dev/sdk";
import * as cheerio from "cheerio";
import { calculateGrade } from "../../src/lib/utils";
import { calculateCategoryScore, getCategoryMessage, type CheckResult } from "../../src/lib/scoring";

// Interface for link validation result
interface LinkValidationResult {
  url: string;
  status: number | null;
  isWorking: boolean;
  error?: string;
  redirectUrl?: string;
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOAuditBot/1.0)" },
  });
  return response.text();
}

// Validate a single link using HEAD request (faster than GET)
async function validateLink(linkUrl: string, baseUrl: string): Promise<LinkValidationResult> {
  try {
    // Resolve relative URLs
    const absoluteUrl = new URL(linkUrl, baseUrl).toString();
    
    // Skip non-HTTP URLs
    if (!absoluteUrl.startsWith('http://') && !absoluteUrl.startsWith('https://')) {
      return { url: linkUrl, status: null, isWorking: true }; // mailto:, tel:, etc.
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(absoluteUrl, {
      method: 'HEAD',
      headers: { 
        "User-Agent": "Mozilla/5.0 (compatible; SEOAuditBot/1.0; Link Checker)",
        "Accept": "*/*"
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const isWorking = response.status >= 200 && response.status < 400;
    
    return {
      url: linkUrl,
      status: response.status,
      isWorking,
      redirectUrl: response.url !== absoluteUrl ? response.url : undefined,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Timeout or abort = potentially slow server, not necessarily broken
    if (errorMessage.includes('abort') || errorMessage.includes('timeout')) {
      return { url: linkUrl, status: null, isWorking: true, error: 'Timeout (server slow)' };
    }
    
    return {
      url: linkUrl,
      status: null,
      isWorking: false,
      error: errorMessage,
    };
  }
}

// Batch validate links with concurrency control
async function validateLinks(links: string[], baseUrl: string, maxConcurrent: number = 5, maxLinks: number = 20): Promise<LinkValidationResult[]> {
  const results: LinkValidationResult[] = [];
  const linksToCheck = links.slice(0, maxLinks); // Limit number of links to check
  
  // Process in batches
  for (let i = 0; i < linksToCheck.length; i += maxConcurrent) {
    const batch = linksToCheck.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(
      batch.map(link => validateLink(link, baseUrl))
    );
    results.push(...batchResults);
  }
  
  return results;
}

export const linksAnalysisTask = task({
  id: "links-analysis",
  retry: { maxAttempts: 2 },
  run: async (payload: { url: string; auditId: string }) => {
    const { url } = payload;
    const checks: CheckResult[] = [];
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;

    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    const allLinks = $("a[href]");
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];
    const nofollowLinks: string[] = [];

    allLinks.each((_, el) => {
      const href = $(el).attr("href") || "";
      const rel = $(el).attr("rel") || "";

      if (href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      try {
        const linkUrl = new URL(href, url);
        if (linkUrl.hostname === domain) {
          internalLinks.push(href);
        } else {
          externalLinks.push(href);
        }

        if (rel.includes("nofollow")) {
          nofollowLinks.push(href);
        }
      } catch {
        if (href.startsWith("/") || !href.includes("://")) {
          internalLinks.push(href);
        }
      }
    });

    const totalLinks = internalLinks.length + externalLinks.length;
    checks.push({
      id: "totalLinks",
      name: "On-Page Links",
      status: totalLinks > 0 ? "pass" : "warning",
      score: totalLinks > 0 ? 100 : 50,
      weight: 10,
      value: {
        total: totalLinks,
        internal: internalLinks.length,
        external: externalLinks.length,
        nofollow: nofollowLinks.length,
      },
      message: `Found ${totalLinks} links: ${internalLinks.length} internal, ${externalLinks.length} external.`,
    });

    checks.push({
      id: "internalLinks",
      name: "Internal Link Structure",
      status: internalLinks.length >= 3 ? "pass" : "warning",
      score: internalLinks.length >= 3 ? 100 : internalLinks.length > 0 ? 70 : 40,
      weight: 15,
      value: { count: internalLinks.length },
      message:
        internalLinks.length >= 3
          ? `Good internal linking: ${internalLinks.length} links.`
          : `Low internal links: ${internalLinks.length}. Add more internal links.`,
      recommendation:
        internalLinks.length < 3 ? "Add more internal links" : undefined,
    });

    const externalPercent = totalLinks > 0 ? (externalLinks.length / totalLinks) * 100 : 0;
    checks.push({
      id: "externalLinks",
      name: "External Links",
      status: "info",
      score: 80,
      weight: 5,
      value: {
        count: externalLinks.length,
        percentage: externalPercent.toFixed(1),
      },
      message: `${externalLinks.length} external links (${externalPercent.toFixed(1)}% of total).`,
    });

    const friendlyLinks = [...internalLinks, ...externalLinks].every((href) => {
      return !href.includes("?") || href.split("?")[0].length > 5;
    });
    checks.push({
      id: "friendlyUrls",
      name: "Friendly URLs",
      status: friendlyLinks ? "pass" : "warning",
      score: friendlyLinks ? 100 : 70,
      weight: 10,
      value: { friendly: friendlyLinks },
      message: friendlyLinks
        ? "Link URLs appear friendly and readable."
        : "Some URLs may not be user-friendly.",
    });

    // ACTUAL BROKEN LINK DETECTION - HTTP HEAD requests
    metadata.set("status", { progress: 30, label: "Checking links for broken URLs..." } as any);
    
    const allLinksToValidate = [...internalLinks, ...externalLinks].filter(
      href => !href.startsWith('#') && !href.startsWith('javascript:') && 
              !href.startsWith('mailto:') && !href.startsWith('tel:')
    );
    
    const linkValidationResults = await validateLinks(allLinksToValidate, url, 5, 30);
    const brokenLinks = linkValidationResults.filter(r => !r.isWorking);
    const workingLinks = linkValidationResults.filter(r => r.isWorking);
    const brokenLinkUrls = brokenLinks.map(r => r.url);
    const brokenLinkDetails = brokenLinks.map(r => ({
      url: r.url,
      status: r.status,
      error: r.error
    }));
    
    const brokenLinkPercent = allLinksToValidate.length > 0 
      ? (brokenLinks.length / linkValidationResults.length) * 100 
      : 0;
    
    checks.push({
      id: "brokenLinks",
      name: "Broken Links (HTTP Verified)",
      status: brokenLinks.length === 0 ? "pass" : brokenLinks.length <= 2 ? "warning" : "fail",
      score: brokenLinks.length === 0 ? 100 : Math.max(0, 100 - brokenLinks.length * 15),
      weight: 20,
      value: {
        totalChecked: linkValidationResults.length,
        working: workingLinks.length,
        broken: brokenLinks.length,
        brokenPercent: brokenLinkPercent.toFixed(1),
        brokenUrls: brokenLinkUrls.slice(0, 10), // Show first 10
        brokenDetails: brokenLinkDetails.slice(0, 5), // Detailed info for first 5
        note: `Checked ${linkValidationResults.length} of ${allLinksToValidate.length} links via HTTP HEAD requests`
      },
      message: brokenLinks.length === 0
        ? `All ${linkValidationResults.length} checked links are working (HTTP verified)`
        : `Found ${brokenLinks.length} broken links out of ${linkValidationResults.length} checked (${brokenLinkPercent.toFixed(1)}% broken)`,
      recommendation: brokenLinks.length > 0 
        ? `Fix broken links: ${brokenLinkUrls.slice(0, 3).join(', ')}${brokenLinkUrls.length > 3 ? '...' : ''}`
        : undefined,
    });

    checks.push({
      id: "backlinks",
      name: "Backlink Profile",
      status: "info",
      score: 50,
      weight: 20,
      value: { note: "Requires external API for full analysis" },
      message: "Full backlink analysis requires integration with Moz/Ahrefs API.",
      recommendation: "Execute a Link Building Strategy",
    });

    const robotsTxt = await fetch(`${parsedUrl.origin}/robots.txt`).then(
      (r) => (r.ok ? r.text() : null)
    ).catch(() => null);
    
    checks.push({
      id: "robotsTxt",
      name: "Robots.txt",
      status: robotsTxt ? "pass" : "warning",
      score: robotsTxt ? 100 : 60,
      weight: 10,
      value: { exists: !!robotsTxt },
      message: robotsTxt
        ? "Robots.txt file found."
        : "No robots.txt file found.",
      recommendation: !robotsTxt ? "Create a robots.txt file" : undefined,
    });

    const sitemapUrl = `${parsedUrl.origin}/sitemap.xml`;
    const sitemap = await fetch(sitemapUrl).then(
      (r) => (r.ok ? true : false)
    ).catch(() => false);
    
    checks.push({
      id: "sitemap",
      name: "XML Sitemap",
      status: sitemap ? "pass" : "warning",
      score: sitemap ? 100 : 60,
      weight: 10,
      value: { exists: sitemap, url: sitemapUrl },
      message: sitemap
        ? "XML Sitemap found."
        : "No XML Sitemap found at standard location.",
      recommendation: !sitemap ? "Create an XML Sitemap" : undefined,
    });

    const score = calculateCategoryScore(checks);
    const grade = calculateGrade(score);

    return {
      score,
      grade,
      checks,
      message: getCategoryMessage("links", score),
    };
  },
});
