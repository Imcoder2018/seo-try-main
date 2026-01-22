import { task } from "@trigger.dev/sdk";
import * as cheerio from "cheerio";
import { calculateGrade } from "../../src/lib/utils";
import { calculateCategoryScore, getCategoryMessage, type CheckResult } from "../../src/lib/scoring";

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SEOAuditBot/1.0)",
    },
  });
  return response.text();
}

export const onPageSeoTask = task({
  id: "on-page-seo-analysis",
  retry: { maxAttempts: 2 },
  run: async (payload: { url: string; auditId: string }) => {
    const { url } = payload;
    const checks: CheckResult[] = [];

    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    const title = $("title").text().trim();
    checks.push({
      id: "title",
      name: "Title Tag",
      status:
        title.length >= 50 && title.length <= 60
          ? "pass"
          : title.length > 0
            ? "warning"
            : "fail",
      score:
        title.length >= 50 && title.length <= 60
          ? 100
          : title.length > 0 && title.length < 70
            ? 70
            : title.length > 0
              ? 50
              : 0,
      weight: 15,
      value: { title, length: title.length },
      message:
        title.length >= 50 && title.length <= 60
          ? "Your Title Tag is optimal length."
          : title.length > 0
            ? `Title Tag is ${title.length} characters. Ideal: 50-60.`
            : "No Title Tag found.",
      recommendation:
        title.length > 60
          ? "Reduce length of Title Tag"
          : title.length === 0
            ? "Add a Title Tag"
            : title.length < 50
              ? "Expand your Title Tag"
              : undefined,
    });

    const metaDesc = $('meta[name="description"]').attr("content") || "";
    checks.push({
      id: "metaDescription",
      name: "Meta Description Tag",
      status:
        metaDesc.length >= 120 && metaDesc.length <= 160
          ? "pass"
          : metaDesc.length > 0
            ? "warning"
            : "fail",
      score:
        metaDesc.length >= 120 && metaDesc.length <= 160
          ? 100
          : metaDesc.length > 0
            ? 60
            : 0,
      weight: 12,
      value: { description: metaDesc, length: metaDesc.length },
      message:
        metaDesc.length >= 120 && metaDesc.length <= 160
          ? "Your Meta Description is optimal length."
          : metaDesc.length > 0
            ? `Meta Description is ${metaDesc.length} characters. Ideal: 120-160.`
            : "No Meta Description found.",
      recommendation:
        metaDesc.length === 0
          ? "Add a Meta Description"
          : metaDesc.length > 160
            ? "Shorten your Meta Description"
            : metaDesc.length < 120
              ? "Expand your Meta Description"
              : undefined,
    });

    const h1Tags = $("h1");
    checks.push({
      id: "h1Tag",
      name: "H1 Header Tag",
      status: h1Tags.length === 1 ? "pass" : h1Tags.length > 1 ? "warning" : "fail",
      score: h1Tags.length === 1 ? 100 : h1Tags.length > 1 ? 70 : 0,
      weight: 10,
      value: { count: h1Tags.length, text: h1Tags.first().text().trim() },
      message:
        h1Tags.length === 1
          ? "Your page has a single H1 Tag."
          : h1Tags.length > 1
            ? `Found ${h1Tags.length} H1 tags. Use only one.`
            : "No H1 Tag found.",
      recommendation:
        h1Tags.length === 0
          ? "Add an H1 Tag"
          : h1Tags.length > 1
            ? "Use only one H1 Tag per page"
            : undefined,
    });

    const h2Count = $("h2").length;
    const h3Count = $("h3").length;
    const h4Count = $("h4").length;
    checks.push({
      id: "headingStructure",
      name: "H2-H6 Header Tag Usage",
      status: h2Count > 0 ? "pass" : "warning",
      score: h2Count > 0 ? 100 : 50,
      weight: 5,
      value: { h2: h2Count, h3: h3Count, h4: h4Count },
      message:
        h2Count > 0
          ? "Your page uses multiple heading levels."
          : "Consider using H2-H6 tags for better structure.",
    });

    const images = $("img");
    const imagesWithoutAlt = images.filter((_, el) => !$(el).attr("alt")).length;
    checks.push({
      id: "imageAlt",
      name: "Image Alt Attributes",
      status: imagesWithoutAlt === 0 ? "pass" : "warning",
      score: images.length === 0 ? 100 : Math.round(((images.length - imagesWithoutAlt) / images.length) * 100),
      weight: 8,
      value: { total: images.length, missing: imagesWithoutAlt },
      message:
        imagesWithoutAlt === 0
          ? "All images have Alt attributes."
          : `${imagesWithoutAlt} of ${images.length} images missing Alt attributes.`,
      recommendation:
        imagesWithoutAlt > 0 ? "Add Alt attributes to all images" : undefined,
    });

    const canonical = $('link[rel="canonical"]').attr("href");
    checks.push({
      id: "canonical",
      name: "Canonical Tag",
      status: canonical ? "pass" : "warning",
      score: canonical ? 100 : 50,
      weight: 8,
      value: { canonical },
      message: canonical
        ? `Canonical URL: ${canonical}`
        : "No Canonical Tag found.",
      recommendation: !canonical ? "Add a Canonical Tag" : undefined,
    });

    const lang = $("html").attr("lang");
    checks.push({
      id: "langAttribute",
      name: "Language Attribute",
      status: lang ? "pass" : "warning",
      score: lang ? 100 : 50,
      weight: 5,
      value: { lang },
      message: lang ? `Language declared: ${lang}` : "No lang attribute found.",
    });

    const noindex = $('meta[name="robots"]').attr("content")?.includes("noindex");
    checks.push({
      id: "noindex",
      name: "Noindex Tag Test",
      status: noindex ? "fail" : "pass",
      score: noindex ? 0 : 100,
      weight: 15,
      value: { noindex },
      message: noindex
        ? "Page has noindex tag - will not be indexed!"
        : "Page can be indexed by search engines.",
      recommendation: noindex ? "Remove noindex tag if page should be indexed" : undefined,
    });

    const jsonLd = $('script[type="application/ld+json"]');
    checks.push({
      id: "schemaMarkup",
      name: "Schema.org Structured Data",
      status: jsonLd.length > 0 ? "pass" : "info",
      score: jsonLd.length > 0 ? 100 : 70,
      weight: 6,
      value: { count: jsonLd.length },
      message:
        jsonLd.length > 0
          ? `Found ${jsonLd.length} JSON-LD schema(s).`
          : "No JSON-LD schema found.",
      recommendation:
        jsonLd.length === 0 ? "Add Schema.org structured data" : undefined,
    });

    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = bodyText.split(" ").filter((w) => w.length > 0).length;
    checks.push({
      id: "wordCount",
      name: "Amount of Content",
      status: wordCount >= 300 ? "pass" : "warning",
      score: wordCount >= 300 ? 100 : wordCount >= 100 ? 70 : 40,
      weight: 6,
      value: { wordCount },
      message:
        wordCount >= 300
          ? `Good content length: ${wordCount} words.`
          : `Low content: ${wordCount} words. Aim for 300+.`,
      recommendation:
        wordCount < 300 ? "Add more content to your page" : undefined,
    });

    const score = calculateCategoryScore(checks);
    const grade = calculateGrade(score);

    return {
      score,
      grade,
      checks,
      message: getCategoryMessage("seo", score),
    };
  },
});
