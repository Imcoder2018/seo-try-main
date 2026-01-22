import { task } from "@trigger.dev/sdk";
import * as cheerio from "cheerio";
import { calculateGrade } from "../../src/lib/utils";
import { calculateCategoryScore, type CheckResult } from "../../src/lib/scoring";

async function fetchWithHeaders(url: string): Promise<{ html: string; headers: Headers }> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOAuditBot/1.0)" },
  });
  return { html: await response.text(), headers: response.headers };
}

export const technologyTask = task({
  id: "technology-analysis",
  retry: { maxAttempts: 2 },
  run: async (payload: { url: string; auditId: string }) => {
    const { url } = payload;
    const checks: CheckResult[] = [];
    const technologies: string[] = [];

    const { html, headers } = await fetchWithHeaders(url);
    const $ = cheerio.load(html);
    const parsedUrl = new URL(url);

    const server = headers.get("server") || headers.get("x-powered-by");
    if (server) {
      technologies.push(server);
    }

    if (headers.get("x-vercel-id") || html.includes("vercel")) {
      technologies.push("Vercel");
    }
    if (headers.get("x-amz-cf-id") || headers.get("x-amz-request-id")) {
      technologies.push("AWS CloudFront");
    }
    if (headers.get("cf-ray")) {
      technologies.push("Cloudflare");
    }
    if (headers.get("x-netlify-id")) {
      technologies.push("Netlify");
    }

    if (html.includes("wp-content") || html.includes("wp-includes")) {
      technologies.push("WordPress");
    }
    if (html.includes("Shopify.theme")) {
      technologies.push("Shopify");
    }
    if (html.includes("wix.com")) {
      technologies.push("Wix");
    }
    if (html.includes("squarespace.com")) {
      technologies.push("Squarespace");
    }
    if (html.includes("__next") || html.includes("_next/static")) {
      technologies.push("Next.js");
    }
    if (html.includes("__nuxt")) {
      technologies.push("Nuxt.js");
    }

    if (html.includes("gtag(") || html.includes("google-analytics.com")) {
      technologies.push("Google Analytics");
    }
    if (html.includes("gtm.js") || html.includes("googletagmanager.com")) {
      technologies.push("Google Tag Manager");
    }
    if (html.includes("fbq(") || html.includes("facebook.net/en_US/fbevents.js")) {
      technologies.push("Facebook Pixel");
    }
    if (html.includes("hotjar.com")) {
      technologies.push("Hotjar");
    }

    checks.push({
      id: "technologies",
      name: "Detected Technologies",
      status: "info",
      score: 100,
      weight: 10,
      value: { technologies },
      message:
        technologies.length > 0
          ? `Detected: ${technologies.join(", ")}`
          : "No specific technologies detected.",
    });

    const serverHeader = headers.get("server");
    checks.push({
      id: "webServer",
      name: "Web Server",
      status: "info",
      score: 100,
      weight: 5,
      value: { server: serverHeader },
      message: serverHeader ? `Server: ${serverHeader}` : "Server header not exposed.",
    });

    const charset = headers.get("content-type");
    checks.push({
      id: "charset",
      name: "Character Encoding",
      status: charset?.includes("utf-8") ? "pass" : "info",
      score: charset?.includes("utf-8") ? 100 : 80,
      weight: 5,
      value: { charset },
      message: charset || "Content-Type header not set.",
    });

    let spfRecord = false;
    let dmarcRecord = false;

    try {
      const spfCheck = await fetch(
        `https://dns.google/resolve?name=${parsedUrl.hostname}&type=TXT`
      ).then((r) => r.json());
      
      if (spfCheck.Answer) {
        spfRecord = spfCheck.Answer.some((a: { data: string }) =>
          a.data?.includes("v=spf1")
        );
      }

      const dmarcCheck = await fetch(
        `https://dns.google/resolve?name=_dmarc.${parsedUrl.hostname}&type=TXT`
      ).then((r) => r.json());
      
      if (dmarcCheck.Answer) {
        dmarcRecord = dmarcCheck.Answer.some((a: { data: string }) =>
          a.data?.includes("v=DMARC1")
        );
      }
    } catch {
      // DNS lookup failed
    }

    checks.push({
      id: "spf",
      name: "SPF Record",
      status: spfRecord ? "pass" : "warning",
      score: spfRecord ? 100 : 50,
      weight: 10,
      value: { exists: spfRecord },
      message: spfRecord
        ? "SPF record is configured."
        : "No SPF record found.",
      recommendation: !spfRecord ? "Add an SPF Mail Record" : undefined,
    });

    checks.push({
      id: "dmarc",
      name: "DMARC Record",
      status: dmarcRecord ? "pass" : "warning",
      score: dmarcRecord ? 100 : 50,
      weight: 10,
      value: { exists: dmarcRecord },
      message: dmarcRecord
        ? "DMARC record is configured."
        : "No DMARC record found.",
      recommendation: !dmarcRecord ? "Add a DMARC Mail Record" : undefined,
    });

    const localBusinessSchema = html.includes("LocalBusiness") || 
      html.includes("Organization") && (html.includes("address") || html.includes("telephone"));
    checks.push({
      id: "localBusinessSchema",
      name: "Local Business Schema",
      status: localBusinessSchema ? "pass" : "info",
      score: localBusinessSchema ? 100 : 70,
      weight: 5,
      value: { exists: localBusinessSchema },
      message: localBusinessSchema
        ? "Local Business schema detected."
        : "No Local Business schema found.",
      recommendation: !localBusinessSchema ? "Add Local Business Schema" : undefined,
    });

    const llmsTxt = await fetch(`${parsedUrl.origin}/llms.txt`)
      .then((r) => r.ok)
      .catch(() => false);
    checks.push({
      id: "llmsTxt",
      name: "llms.txt File",
      status: llmsTxt ? "pass" : "info",
      score: llmsTxt ? 100 : 70,
      weight: 5,
      value: { exists: llmsTxt },
      message: llmsTxt
        ? "llms.txt file found."
        : "No llms.txt file found.",
      recommendation: !llmsTxt ? "Implement a llms.txt File" : undefined,
    });

    const score = calculateCategoryScore(checks);
    const grade = calculateGrade(score);

    return {
      score,
      grade,
      checks,
      technologies,
      message: "Technology analysis complete.",
    };
  },
});
