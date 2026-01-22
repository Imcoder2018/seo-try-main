import * as cheerio from "cheerio";
import type { Check, CategoryResult, PageData } from "./types";
import { calculateGrade } from "../utils";

export async function analyzeTechnology(data: PageData): Promise<CategoryResult> {
  const $ = cheerio.load(data.html);
  const checks: Check[] = [];
  const baseUrl = new URL(data.url);

  // 1. CMS Detection
  let detectedCMS = "Unknown";
  if (data.html.includes("wp-content") || data.html.includes("wp-includes")) {
    detectedCMS = "WordPress";
  } else if (data.html.includes("Shopify.theme")) {
    detectedCMS = "Shopify";
  } else if (data.html.includes("Wix.com")) {
    detectedCMS = "Wix";
  } else if (data.html.includes("squarespace.com")) {
    detectedCMS = "Squarespace";
  } else if (data.html.includes("drupal.js") || data.html.includes("Drupal.")) {
    detectedCMS = "Drupal";
  } else if (data.html.includes("joomla")) {
    detectedCMS = "Joomla";
  } else if ($('meta[name="generator"]').attr("content")?.toLowerCase().includes("next.js")) {
    detectedCMS = "Next.js";
  } else if (data.html.includes("__NUXT__")) {
    detectedCMS = "Nuxt.js";
  } else if (data.html.includes("gatsby")) {
    detectedCMS = "Gatsby";
  }
  checks.push({
    id: "cms",
    name: "CMS / Framework",
    status: "info",
    score: 100,
    weight: 0,
    value: { cms: detectedCMS },
    message: `Detected: ${detectedCMS}`,
  });

  // 2. JavaScript Framework Detection
  let jsFramework = "Unknown";
  if (data.html.includes("react") || data.html.includes("__REACT")) {
    jsFramework = "React";
  } else if (data.html.includes("vue") || data.html.includes("__VUE__")) {
    jsFramework = "Vue.js";
  } else if (data.html.includes("ng-app") || data.html.includes("ng-version")) {
    jsFramework = "Angular";
  } else if (data.html.includes("svelte")) {
    jsFramework = "Svelte";
  } else if (data.html.includes("jquery") || data.html.includes("jQuery")) {
    jsFramework = "jQuery";
  }
  checks.push({
    id: "jsFramework",
    name: "JavaScript Framework",
    status: "info",
    score: 100,
    weight: 0,
    value: { framework: jsFramework },
    message: `Detected: ${jsFramework}`,
  });

  // 3. Server/Hosting Detection
  const serverHeader = data.headers["server"] || data.headers["x-powered-by"] || "";
  checks.push({
    id: "server",
    name: "Web Server",
    status: "info",
    score: 100,
    weight: 0,
    value: { server: serverHeader || "Not disclosed" },
    message: serverHeader
      ? `Server: ${serverHeader}`
      : "Server not disclosed in headers",
  });

  // 4. CDN Detection
  let cdnDetected = "None detected";
  if (data.headers["cf-ray"] || data.headers["cf-cache-status"]) {
    cdnDetected = "Cloudflare";
  } else if (data.headers["x-amz-cf-id"] || data.headers["x-amz-cf-pop"]) {
    cdnDetected = "Amazon CloudFront";
  } else if (data.headers["x-served-by"]?.includes("cache-")) {
    cdnDetected = "Fastly";
  } else if (data.headers["x-akamai-transformed"]) {
    cdnDetected = "Akamai";
  } else if (data.headers["x-vercel-id"]) {
    cdnDetected = "Vercel Edge Network";
  }
  checks.push({
    id: "cdn",
    name: "CDN Detection",
    status: cdnDetected !== "None detected" ? "pass" : "info",
    score: cdnDetected !== "None detected" ? 100 : 70,
    weight: 10,
    value: { cdn: cdnDetected },
    message: `CDN: ${cdnDetected}`,
    recommendation: cdnDetected === "None detected"
      ? "Consider using a CDN for faster content delivery"
      : undefined,
  });

  // 5. SPF Record Check
  let hasSPF = false;
  let spfRecord = "";
  try {
    // Note: DNS lookups may not work in browser environment
    // This is a simplified check that would need server-side implementation
    checks.push({
      id: "spf",
      name: "SPF Mail Record",
      status: "info",
      score: 70,
      weight: 5,
      value: { note: "DNS check requires server-side implementation" },
      message: "SPF check requires DNS lookup (advanced feature)",
      recommendation: "Add an SPF Mail Record to prevent email spoofing",
    });
  } catch {}

  // 6. DMARC Record Check (simplified)
  checks.push({
    id: "dmarc",
    name: "DMARC Mail Record",
    status: "info",
    score: 70,
    weight: 5,
    value: { note: "DNS check requires server-side implementation" },
    message: "DMARC check requires DNS lookup (advanced feature)",
    recommendation: "Add a DMARC Mail Record for email authentication",
  });

  // 7. llms.txt Check
  let hasLlmsTxt = false;
  try {
    const llmsUrl = `${baseUrl.protocol}//${baseUrl.hostname}/llms.txt`;
    const response = await fetch(llmsUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    hasLlmsTxt = response.ok;
  } catch {}
  checks.push({
    id: "hasLlmsTxt",
    name: "llms.txt File",
    status: hasLlmsTxt ? "pass" : "info",
    score: hasLlmsTxt ? 100 : 70,
    weight: 5,
    value: { exists: hasLlmsTxt },
    message: hasLlmsTxt
      ? "llms.txt file found (helps AI crawlers)"
      : "No llms.txt file found",
    recommendation: !hasLlmsTxt
      ? "Implement a llms.txt File for AI crawler guidance"
      : undefined,
  });

  // 8. Local Business Schema
  let hasLocalBusinessSchema = false;
  const jsonLdScripts = $('script[type="application/ld+json"]');
  jsonLdScripts.each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || "{}");
      const type = json["@type"] || "";
      if (type.includes("LocalBusiness") || type.includes("Organization") || type.includes("Store")) {
        hasLocalBusinessSchema = true;
      }
    } catch {}
  });
  checks.push({
    id: "localBusinessSchema",
    name: "Local Business Schema",
    status: hasLocalBusinessSchema ? "pass" : "info",
    score: hasLocalBusinessSchema ? 100 : 60,
    weight: 8,
    value: { found: hasLocalBusinessSchema },
    message: hasLocalBusinessSchema
      ? "Local Business Schema detected"
      : "No Local Business Schema found",
    recommendation: !hasLocalBusinessSchema
      ? "Add Local Business Schema for better local SEO"
      : undefined,
  });

  // 9. Contact Information Detection
  const phoneRegex = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
  const bodyText = $("body").text();
  const phones = bodyText.match(phoneRegex) || [];
  const hasAddress = bodyText.toLowerCase().includes("address") || 
    $('[itemtype*="PostalAddress"]').length > 0;
  checks.push({
    id: "contactInfo",
    name: "Contact Information",
    status: phones.length > 0 || hasAddress ? "pass" : "info",
    score: phones.length > 0 || hasAddress ? 100 : 60,
    weight: 5,
    value: { phonesFound: phones.length, hasAddress },
    message: phones.length > 0 || hasAddress
      ? "Contact information detected on page"
      : "No obvious contact information found",
    recommendation: phones.length === 0 && !hasAddress
      ? "Add Business Address and Phone Number"
      : undefined,
  });

  // 10. Security Headers
  const securityHeaders = {
    "x-frame-options": data.headers["x-frame-options"] || "",
    "x-content-type-options": data.headers["x-content-type-options"] || "",
    "x-xss-protection": data.headers["x-xss-protection"] || "",
    "strict-transport-security": data.headers["strict-transport-security"] || "",
    "content-security-policy": data.headers["content-security-policy"] || "",
  };
  const securityHeaderCount = Object.values(securityHeaders).filter(Boolean).length;
  checks.push({
    id: "securityHeaders",
    name: "Security Headers",
    status: securityHeaderCount >= 3 ? "pass" : securityHeaderCount > 0 ? "warning" : "fail",
    score: securityHeaderCount >= 4 ? 100 : securityHeaderCount >= 2 ? 70 : securityHeaderCount > 0 ? 40 : 20,
    weight: 15,
    value: securityHeaders,
    message: `${securityHeaderCount}/5 security headers present`,
    recommendation: securityHeaderCount < 3
      ? "Implement additional security headers"
      : undefined,
  });

  // 11. HSTS (HTTP Strict Transport Security)
  const hasHSTS = !!data.headers["strict-transport-security"];
  checks.push({
    id: "hsts",
    name: "HSTS",
    status: hasHSTS ? "pass" : data.isHttps ? "warning" : "info",
    score: hasHSTS ? 100 : 60,
    weight: 10,
    value: { enabled: hasHSTS, header: data.headers["strict-transport-security"] },
    message: hasHSTS
      ? "HSTS enabled"
      : "HSTS not enabled",
    recommendation: !hasHSTS && data.isHttps
      ? "Enable HSTS for enhanced security"
      : undefined,
  });

  // 12. Accessibility Features Detection
  const ariaLabels = $("[aria-label]").length;
  const ariaRoles = $("[role]").length;
  const altTexts = $("img[alt]").length;
  const accessibilityScore = ariaLabels + ariaRoles > 5 ? 100 : ariaLabels + ariaRoles > 0 ? 70 : 40;
  checks.push({
    id: "accessibility",
    name: "Accessibility Features",
    status: accessibilityScore >= 70 ? "pass" : "warning",
    score: accessibilityScore,
    weight: 10,
    value: { ariaLabels, ariaRoles, altTexts },
    message: `Found ${ariaLabels} aria-labels, ${ariaRoles} role attributes`,
    recommendation: accessibilityScore < 70
      ? "Improve accessibility with ARIA attributes"
      : undefined,
  });

  // Calculate category score (only for scored items)
  const scoredChecks = checks.filter(c => c.weight > 0);
  const totalWeight = scoredChecks.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore = scoredChecks.reduce((sum, c) => sum + c.score * c.weight, 0);
  const score = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  const grade = calculateGrade(score);

  return {
    score,
    grade,
    message: score >= 80
      ? "Good technology implementation!"
      : score >= 60
      ? "Technology setup could be improved"
      : "Technology implementation needs work",
    checks,
  };
}
