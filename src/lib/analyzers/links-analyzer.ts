import * as cheerio from "cheerio";
import type { Check, CategoryResult, PageData } from "./types";
import { calculateGrade } from "../utils";

export async function analyzeLinks(data: PageData): Promise<CategoryResult> {
  const $ = cheerio.load(data.html);
  const checks: Check[] = [];
  const baseUrl = new URL(data.url);

  // 1. Internal Links
  const allLinks = $("a[href]");
  let internalLinks = 0;
  let externalLinks = 0;
  const internalUrls: string[] = [];
  const externalUrls: string[] = [];

  allLinks.each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }
    try {
      const linkUrl = new URL(href, data.url);
      if (linkUrl.hostname === baseUrl.hostname) {
        internalLinks++;
        if (internalUrls.length < 10) internalUrls.push(linkUrl.href);
      } else {
        externalLinks++;
        if (externalUrls.length < 10) externalUrls.push(linkUrl.href);
      }
    } catch {}
  });

  checks.push({
    id: "internalLinks",
    name: "Internal Links",
    status: internalLinks >= 3 ? "pass" : internalLinks > 0 ? "warning" : "fail",
    score: internalLinks >= 10 ? 100 : internalLinks >= 3 ? 80 : internalLinks > 0 ? 50 : 0,
    weight: 15,
    value: { count: internalLinks, sample: internalUrls },
    message: `Found ${internalLinks} internal links`,
    recommendation: internalLinks < 3
      ? "Add more internal links to improve site navigation"
      : undefined,
  });

  // 2. External Links
  checks.push({
    id: "externalLinks",
    name: "External Links",
    status: externalLinks > 0 ? "pass" : "info",
    score: externalLinks > 0 ? 100 : 80,
    weight: 10,
    value: { count: externalLinks, sample: externalUrls },
    message: externalLinks > 0
      ? `Found ${externalLinks} external links`
      : "No external links found",
  });

  // 3. Broken Links Check (simplified - just checks for common issues)
  let suspiciousLinks = 0;
  allLinks.each((_, el) => {
    const href = $(el).attr("href") || "";
    if (href.includes("undefined") || href.includes("null") || href === "#undefined") {
      suspiciousLinks++;
    }
  });
  checks.push({
    id: "brokenLinks",
    name: "Potentially Broken Links",
    status: suspiciousLinks === 0 ? "pass" : "warning",
    score: suspiciousLinks === 0 ? 100 : 50,
    weight: 10,
    value: { suspiciousCount: suspiciousLinks },
    message: suspiciousLinks === 0
      ? "No obviously broken links detected"
      : `Found ${suspiciousLinks} potentially broken links`,
    recommendation: suspiciousLinks > 0
      ? "Fix broken or malformed links"
      : undefined,
  });

  // 4. Nofollow Links
  let nofollowLinks = 0;
  allLinks.each((_, el) => {
    const rel = $(el).attr("rel") || "";
    if (rel.includes("nofollow")) nofollowLinks++;
  });
  checks.push({
    id: "nofollowLinks",
    name: "Nofollow Links",
    status: "info",
    score: 100,
    weight: 5,
    value: { count: nofollowLinks },
    message: `Found ${nofollowLinks} nofollow links`,
  });

  // 5. Robots.txt Check
  let hasRobotsTxt = false;
  let robotsTxtContent = "";
  try {
    const robotsUrl = `${baseUrl.protocol}//${baseUrl.hostname}/robots.txt`;
    const robotsResponse = await fetch(robotsUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOAuditBot/1.0)" },
      signal: AbortSignal.timeout(5000),
    });
    if (robotsResponse.ok) {
      hasRobotsTxt = true;
      robotsTxtContent = await robotsResponse.text();
    }
  } catch {}
  checks.push({
    id: "robotsTxt",
    name: "Robots.txt",
    status: hasRobotsTxt ? "pass" : "warning",
    score: hasRobotsTxt ? 100 : 50,
    weight: 15,
    value: { exists: hasRobotsTxt, preview: robotsTxtContent.slice(0, 200) },
    message: hasRobotsTxt
      ? "robots.txt file found"
      : "No robots.txt file found",
    recommendation: !hasRobotsTxt
      ? "Create a robots.txt file"
      : undefined,
  });

  // 6. XML Sitemap Check
  let hasSitemap = false;
  let sitemapUrl = "";
  // Check robots.txt for sitemap
  if (robotsTxtContent) {
    const sitemapMatch = robotsTxtContent.match(/Sitemap:\s*(.+)/i);
    if (sitemapMatch) {
      sitemapUrl = sitemapMatch[1].trim();
      hasSitemap = true;
    }
  }
  // Try common sitemap locations if not in robots.txt
  if (!hasSitemap) {
    const sitemapUrls = [
      `${baseUrl.protocol}//${baseUrl.hostname}/sitemap.xml`,
      `${baseUrl.protocol}//${baseUrl.hostname}/sitemap_index.xml`,
    ];
    for (const url of sitemapUrls) {
      try {
        const response = await fetch(url, {
          method: "HEAD",
          signal: AbortSignal.timeout(5000),
        });
        if (response.ok) {
          hasSitemap = true;
          sitemapUrl = url;
          break;
        }
      } catch {}
    }
  }
  checks.push({
    id: "xmlSitemap",
    name: "XML Sitemap",
    status: hasSitemap ? "pass" : "warning",
    score: hasSitemap ? 100 : 50,
    weight: 15,
    value: { exists: hasSitemap, url: sitemapUrl },
    message: hasSitemap
      ? `XML Sitemap found: ${sitemapUrl}`
      : "No XML Sitemap found",
    recommendation: !hasSitemap
      ? "Create an XML Sitemap and submit it to search engines"
      : undefined,
  });

  // 7. Friendly URLs
  const urlPath = baseUrl.pathname;
  const isFriendlyUrl = !urlPath.includes("?") && 
    !urlPath.match(/\d{5,}/) && 
    !urlPath.includes(".php?") &&
    !urlPath.includes(".asp?");
  checks.push({
    id: "friendlyUrls",
    name: "SEO Friendly URL",
    status: isFriendlyUrl ? "pass" : "warning",
    score: isFriendlyUrl ? 100 : 60,
    weight: 10,
    value: { url: urlPath, isFriendly: isFriendlyUrl },
    message: isFriendlyUrl
      ? "URL structure is SEO friendly"
      : "URL could be more SEO friendly",
    recommendation: !isFriendlyUrl
      ? "Use descriptive, keyword-rich URLs without excessive parameters"
      : undefined,
  });

  // 8. URL Length
  const urlLength = data.url.length;
  checks.push({
    id: "urlLength",
    name: "URL Length",
    status: urlLength <= 75 ? "pass" : urlLength <= 100 ? "warning" : "fail",
    score: urlLength <= 75 ? 100 : urlLength <= 100 ? 70 : 40,
    weight: 5,
    value: { length: urlLength },
    message: `URL length: ${urlLength} characters`,
    recommendation: urlLength > 75
      ? "Consider shortening your URL (aim for under 75 characters)"
      : undefined,
  });

  // 9. HTTPS Redirect Check
  let httpsRedirect = false;
  if (data.isHttps) {
    // Check if HTTP redirects to HTTPS
    try {
      const httpUrl = data.url.replace("https://", "http://");
      const response = await fetch(httpUrl, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(5000),
      });
      const location = response.headers.get("location") || "";
      httpsRedirect = location.startsWith("https://");
    } catch {
      httpsRedirect = true; // Assume redirect exists if HTTP fails
    }
  }
  checks.push({
    id: "httpsRedirect",
    name: "HTTPS Redirect",
    status: data.isHttps && httpsRedirect ? "pass" : data.isHttps ? "warning" : "fail",
    score: data.isHttps && httpsRedirect ? 100 : data.isHttps ? 70 : 0,
    weight: 10,
    value: { isHttps: data.isHttps, redirects: httpsRedirect },
    message: data.isHttps && httpsRedirect
      ? "HTTP traffic redirects to HTTPS"
      : data.isHttps
      ? "Site uses HTTPS but redirect not confirmed"
      : "Site does not use HTTPS",
    recommendation: !data.isHttps
      ? "Enable HTTPS and redirect all HTTP traffic to HTTPS"
      : !httpsRedirect
      ? "Set up 301 redirect from HTTP to HTTPS"
      : undefined,
  });

  // 10. Blocked by Robots.txt Check
  let blockedByRobots = false;
  if (robotsTxtContent) {
    const lines = robotsTxtContent.toLowerCase().split("\n");
    let currentUserAgent = "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("user-agent:")) {
        currentUserAgent = trimmed.replace("user-agent:", "").trim();
      } else if (trimmed.startsWith("disallow:") && (currentUserAgent === "*" || currentUserAgent === "googlebot")) {
        const disallowPath = trimmed.replace("disallow:", "").trim();
        if (disallowPath && urlPath.startsWith(disallowPath)) {
          blockedByRobots = true;
          break;
        }
      }
    }
  }
  checks.push({
    id: "blockedByRobots",
    name: "Blocked by Robots.txt",
    status: blockedByRobots ? "fail" : "pass",
    score: blockedByRobots ? 0 : 100,
    weight: 10,
    value: { blocked: blockedByRobots },
    message: blockedByRobots
      ? "Page is blocked by robots.txt"
      : "Page is not blocked by robots.txt",
    recommendation: blockedByRobots
      ? "Update robots.txt to allow crawling of this page"
      : undefined,
  });

  // Calculate category score
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore = checks.reduce((sum, c) => sum + c.score * c.weight, 0);
  const score = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  const grade = calculateGrade(score);

  return {
    score,
    grade,
    message: score >= 80 
      ? "Your link structure is good!"
      : score >= 60 
      ? "Your link structure needs some work"
      : "Your link structure needs significant improvement",
    checks,
  };
}
