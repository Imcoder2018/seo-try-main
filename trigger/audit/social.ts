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

export const socialTask = task({
  id: "social-analysis",
  retry: { maxAttempts: 2 },
  run: async (payload: { url: string; auditId: string }) => {
    const { url } = payload;
    const checks: CheckResult[] = [];

    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    const ogTitle = $('meta[property="og:title"]').attr("content");
    const ogDescription = $('meta[property="og:description"]').attr("content");
    const ogImage = $('meta[property="og:image"]').attr("content");
    const ogUrl = $('meta[property="og:url"]').attr("content");

    const hasOpenGraph = !!(ogTitle || ogDescription || ogImage);
    checks.push({
      id: "openGraph",
      name: "Facebook Open Graph Tags",
      status: hasOpenGraph ? "pass" : "warning",
      score: hasOpenGraph ? 100 : 40,
      weight: 20,
      value: { ogTitle, ogDescription, ogImage, ogUrl },
      message: hasOpenGraph
        ? "Open Graph tags are configured."
        : "No Open Graph tags found.",
      recommendation: !hasOpenGraph
        ? "Add Facebook Open Graph tags"
        : undefined,
    });

    const twitterCard = $('meta[name="twitter:card"]').attr("content");
    const twitterTitle = $('meta[name="twitter:title"]').attr("content");
    const twitterDesc = $('meta[name="twitter:description"]').attr("content");
    const twitterImage = $('meta[name="twitter:image"]').attr("content");

    const hasTwitterCards = !!(twitterCard || twitterTitle);
    checks.push({
      id: "twitterCards",
      name: "X (Twitter) Cards",
      status: hasTwitterCards ? "pass" : "warning",
      score: hasTwitterCards ? 100 : 40,
      weight: 15,
      value: { twitterCard, twitterTitle, twitterDesc, twitterImage },
      message: hasTwitterCards
        ? "Twitter Card tags are configured."
        : "No Twitter Card tags found.",
      recommendation: !hasTwitterCards ? "Add Twitter Card meta tags" : undefined,
    });

    const allLinks = $("a[href]")
      .map((_, el) => $(el).attr("href") || "")
      .get();

    const hasFacebook = allLinks.some((l) => l.includes("facebook.com"));
    checks.push({
      id: "hasFacebook",
      name: "Facebook Page Linked",
      status: hasFacebook ? "pass" : "info",
      score: hasFacebook ? 100 : 50,
      weight: 10,
      value: { linked: hasFacebook },
      message: hasFacebook
        ? "Facebook page is linked."
        : "No Facebook page link found.",
      recommendation: !hasFacebook
        ? "Create and link your Facebook Page"
        : undefined,
    });

    const hasTwitter = allLinks.some(
      (l) => l.includes("twitter.com") || l.includes("x.com")
    );
    checks.push({
      id: "hasTwitter",
      name: "X (Twitter) Account Linked",
      status: hasTwitter ? "pass" : "info",
      score: hasTwitter ? 100 : 50,
      weight: 10,
      value: { linked: hasTwitter },
      message: hasTwitter
        ? "X/Twitter profile is linked."
        : "No X/Twitter profile link found.",
      recommendation: !hasTwitter ? "Create and link your X Profile" : undefined,
    });

    const hasInstagram = allLinks.some((l) => l.includes("instagram.com"));
    checks.push({
      id: "hasInstagram",
      name: "Instagram Linked",
      status: hasInstagram ? "pass" : "info",
      score: hasInstagram ? 100 : 50,
      weight: 10,
      value: { linked: hasInstagram },
      message: hasInstagram
        ? "Instagram profile is linked."
        : "No Instagram link found.",
      recommendation: !hasInstagram
        ? "Create and link an associated Instagram Profile"
        : undefined,
    });

    const hasLinkedIn = allLinks.some((l) => l.includes("linkedin.com"));
    checks.push({
      id: "hasLinkedIn",
      name: "LinkedIn Page Linked",
      status: hasLinkedIn ? "pass" : "info",
      score: hasLinkedIn ? 100 : 50,
      weight: 10,
      value: { linked: hasLinkedIn },
      message: hasLinkedIn
        ? "LinkedIn page is linked."
        : "No LinkedIn link found.",
      recommendation: !hasLinkedIn
        ? "Create and link an associated LinkedIn Profile"
        : undefined,
    });

    const hasYoutube = allLinks.some((l) => l.includes("youtube.com"));
    checks.push({
      id: "hasYoutube",
      name: "YouTube Channel Linked",
      status: hasYoutube ? "pass" : "info",
      score: hasYoutube ? 100 : 50,
      weight: 10,
      value: { linked: hasYoutube },
      message: hasYoutube
        ? "YouTube channel is linked."
        : "No YouTube link found.",
      recommendation: !hasYoutube
        ? "Create and link an associated YouTube Channel"
        : undefined,
    });

    const hasFbPixel =
      html.includes("fbq(") ||
      html.includes("facebook.net/en_US/fbevents.js") ||
      html.includes("connect.facebook.net");
    checks.push({
      id: "facebookPixel",
      name: "Facebook Pixel",
      status: hasFbPixel ? "pass" : "info",
      score: hasFbPixel ? 100 : 70,
      weight: 5,
      value: { installed: hasFbPixel },
      message: hasFbPixel
        ? "Facebook Pixel is installed."
        : "No Facebook Pixel detected.",
    });

    const score = calculateCategoryScore(checks);
    const grade = calculateGrade(score);

    return {
      score,
      grade,
      checks,
      message: getCategoryMessage("social", score),
    };
  },
});
