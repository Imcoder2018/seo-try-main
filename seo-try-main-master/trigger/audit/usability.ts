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

export const usabilityTask = task({
  id: "usability-analysis",
  retry: { maxAttempts: 2 },
  run: async (payload: { url: string; auditId: string }) => {
    const { url } = payload;
    const checks: CheckResult[] = [];

    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    const viewport = $('meta[name="viewport"]').attr("content");
    checks.push({
      id: "viewport",
      name: "Mobile Viewport",
      status: viewport ? "pass" : "fail",
      score: viewport ? 100 : 0,
      weight: 15,
      value: { viewport },
      message: viewport
        ? "Mobile viewport meta tag is set."
        : "No mobile viewport meta tag found.",
      recommendation: !viewport ? "Add a mobile viewport meta tag" : undefined,
    });

    const favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href");
    checks.push({
      id: "favicon",
      name: "Favicon",
      status: favicon ? "pass" : "warning",
      score: favicon ? 100 : 50,
      weight: 5,
      value: { favicon },
      message: favicon ? "Favicon is set." : "No favicon found.",
      recommendation: !favicon ? "Add a favicon" : undefined,
    });

    const iframes = $("iframe").length;
    checks.push({
      id: "iframes",
      name: "iFrames Usage",
      status: iframes === 0 ? "pass" : "warning",
      score: iframes === 0 ? 100 : 70,
      weight: 5,
      value: { count: iframes },
      message:
        iframes === 0
          ? "No iFrames found."
          : `Found ${iframes} iFrame(s). Consider reducing usage.`,
      recommendation: iframes > 0 ? "Remove iFrames" : undefined,
    });

    const flash =
      $("object[type*='flash']").length +
      $("embed[type*='flash']").length +
      $("[src*='.swf']").length;
    checks.push({
      id: "flash",
      name: "Flash Content",
      status: flash === 0 ? "pass" : "fail",
      score: flash === 0 ? 100 : 0,
      weight: 10,
      value: { count: flash },
      message:
        flash === 0
          ? "No Flash content detected."
          : "Flash content detected. Flash is obsolete.",
      recommendation: flash > 0 ? "Remove all Flash content" : undefined,
    });

    const emails = html.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    );
    checks.push({
      id: "emailPrivacy",
      name: "Email Privacy",
      status: !emails || emails.length === 0 ? "pass" : "warning",
      score: !emails || emails.length === 0 ? 100 : 70,
      weight: 5,
      value: { count: emails?.length || 0 },
      message:
        !emails || emails.length === 0
          ? "No plain text emails found."
          : `Found ${emails.length} plain text email(s). Consider obfuscating.`,
    });

    const hasHttps = url.startsWith("https://");
    checks.push({
      id: "ssl",
      name: "SSL Certificate",
      status: hasHttps ? "pass" : "fail",
      score: hasHttps ? 100 : 0,
      weight: 20,
      value: { https: hasHttps },
      message: hasHttps
        ? "SSL certificate is active (HTTPS)."
        : "No SSL certificate. Site is not secure.",
      recommendation: !hasHttps ? "Enable SSL/HTTPS" : undefined,
    });

    const inlineStyles = $("[style]").length;
    checks.push({
      id: "inlineStyles",
      name: "Inline Styles",
      status: inlineStyles < 10 ? "pass" : "warning",
      score: inlineStyles < 10 ? 100 : inlineStyles < 30 ? 70 : 50,
      weight: 5,
      value: { count: inlineStyles },
      message:
        inlineStyles < 10
          ? "Minimal inline styles used."
          : `Found ${inlineStyles} inline styles. Consider using CSS files.`,
      recommendation: inlineStyles >= 10 ? "Remove Inline Styles" : undefined,
    });

    const deprecatedTags = ["center", "font", "marquee", "blink", "strike"];
    let deprecatedCount = 0;
    deprecatedTags.forEach((tag) => {
      deprecatedCount += $(tag).length;
    });
    checks.push({
      id: "deprecatedHtml",
      name: "Deprecated HTML",
      status: deprecatedCount === 0 ? "pass" : "warning",
      score: deprecatedCount === 0 ? 100 : 60,
      weight: 5,
      value: { count: deprecatedCount },
      message:
        deprecatedCount === 0
          ? "No deprecated HTML tags found."
          : `Found ${deprecatedCount} deprecated HTML tag(s).`,
      recommendation: deprecatedCount > 0 ? "Remove deprecated HTML tags" : undefined,
    });

    const score = calculateCategoryScore(checks);
    const grade = calculateGrade(score);

    return {
      score,
      grade,
      checks,
      message: getCategoryMessage("usability", score),
    };
  },
});
