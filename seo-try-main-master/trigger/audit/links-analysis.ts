import { task } from "@trigger.dev/sdk";
import * as cheerio from "cheerio";
import { calculateGrade } from "../../src/lib/utils";
import { calculateCategoryScore, getCategoryMessage, type CheckResult } from "../../src/lib/scoring";

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOAuditBot/1.0)" },
  });
  return response.text();
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

    checks.push({
      id: "backlinks",
      name: "Backlink Profile",
      status: "info",
      score: 50,
      weight: 30,
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
