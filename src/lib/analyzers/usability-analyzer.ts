import * as cheerio from "cheerio";
import type { Check, CategoryResult, PageData } from "./types";
import { calculateGrade } from "../utils";

export function analyzeUsability(data: PageData): CategoryResult {
  const $ = cheerio.load(data.html);
  const checks: Check[] = [];

  // 1. Mobile Viewport
  const viewport = $('meta[name="viewport"]').attr("content") || "";
  const hasViewport = viewport.includes("width=device-width");
  checks.push({
    id: "viewport",
    name: "Mobile Viewport",
    status: hasViewport ? "pass" : "fail",
    score: hasViewport ? 100 : 0,
    weight: 20,
    value: { viewport, hasViewport },
    message: hasViewport
      ? "Mobile viewport is properly configured"
      : "No mobile viewport meta tag found",
    recommendation: !hasViewport
      ? "Add a mobile viewport meta tag for responsive design"
      : undefined,
  });

  // 2. Favicon
  const favicon = $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    $('link[rel="apple-touch-icon"]').attr("href");
  checks.push({
    id: "favicon",
    name: "Favicon",
    status: favicon ? "pass" : "warning",
    score: favicon ? 100 : 50,
    weight: 5,
    value: { favicon },
    message: favicon
      ? `Favicon found: ${favicon}`
      : "No favicon detected",
    recommendation: !favicon
      ? "Add a favicon to improve brand recognition"
      : undefined,
  });

  // 3. Apple Touch Icon
  const appleTouchIcon = $('link[rel="apple-touch-icon"]').attr("href");
  checks.push({
    id: "appleTouchIcon",
    name: "Apple Touch Icon",
    status: appleTouchIcon ? "pass" : "info",
    score: appleTouchIcon ? 100 : 70,
    weight: 3,
    value: { icon: appleTouchIcon },
    message: appleTouchIcon
      ? "Apple Touch Icon found"
      : "No Apple Touch Icon found",
  });

  // 4. iFrames Check
  const iframes = $("iframe");
  const iframeCount = iframes.length;
  checks.push({
    id: "hasIframe",
    name: "iFrames",
    status: iframeCount === 0 ? "pass" : "warning",
    score: iframeCount === 0 ? 100 : 70,
    weight: 5,
    value: { count: iframeCount },
    message: iframeCount === 0
      ? "No iFrames found (good for SEO)"
      : `Found ${iframeCount} iFrame(s)`,
    recommendation: iframeCount > 0
      ? "Consider removing iFrames as they can affect SEO and usability"
      : undefined,
  });

  // 5. Flash Content
  const hasFlash = data.html.includes(".swf") ||
    $('object[type="application/x-shockwave-flash"]').length > 0 ||
    $("embed[type='application/x-shockwave-flash']").length > 0;
  checks.push({
    id: "flash",
    name: "Flash Content",
    status: hasFlash ? "fail" : "pass",
    score: hasFlash ? 0 : 100,
    weight: 10,
    value: { hasFlash },
    message: hasFlash
      ? "Flash content detected - Flash is obsolete"
      : "No Flash content (good)",
    recommendation: hasFlash
      ? "Remove Flash content and use HTML5 alternatives"
      : undefined,
  });

  // 6. Email Privacy (exposed emails)
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const bodyText = $("body").text();
  const exposedEmails = bodyText.match(emailRegex) || [];
  const uniqueEmails = [...new Set(exposedEmails)];
  checks.push({
    id: "emailPrivacy",
    name: "Email Privacy",
    status: uniqueEmails.length === 0 ? "pass" : "warning",
    score: uniqueEmails.length === 0 ? 100 : 60,
    weight: 5,
    value: { count: uniqueEmails.length, emails: uniqueEmails.slice(0, 3) },
    message: uniqueEmails.length === 0
      ? "No exposed email addresses found"
      : `Found ${uniqueEmails.length} exposed email(s)`,
    recommendation: uniqueEmails.length > 0
      ? "Consider using contact forms instead of exposing email addresses"
      : undefined,
  });

  // 7. SSL/HTTPS
  checks.push({
    id: "ssl",
    name: "SSL Certificate",
    status: data.isHttps ? "pass" : "fail",
    score: data.isHttps ? 100 : 0,
    weight: 20,
    value: { https: data.isHttps },
    message: data.isHttps
      ? "Site uses HTTPS (secure)"
      : "Site does NOT use HTTPS",
    recommendation: !data.isHttps
      ? "Enable SSL/HTTPS for better security and SEO"
      : undefined,
  });

  // 8. Inline Styles
  const inlineStyleCount = $("[style]").length;
  checks.push({
    id: "hasInlineCss",
    name: "Inline Styles",
    status: inlineStyleCount <= 5 ? "pass" : inlineStyleCount <= 20 ? "warning" : "fail",
    score: inlineStyleCount <= 5 ? 100 : inlineStyleCount <= 20 ? 70 : 40,
    weight: 5,
    value: { count: inlineStyleCount },
    message: inlineStyleCount <= 5
      ? `Minimal inline styles (${inlineStyleCount})`
      : `Found ${inlineStyleCount} inline styles`,
    recommendation: inlineStyleCount > 5
      ? "Remove inline styles and use external CSS"
      : undefined,
  });

  // 9. Deprecated HTML
  const deprecatedTags = ["font", "center", "marquee", "blink", "strike", "big", "tt"];
  let deprecatedCount = 0;
  const foundDeprecated: string[] = [];
  deprecatedTags.forEach((tag) => {
    const count = $(tag).length;
    if (count > 0) {
      deprecatedCount += count;
      foundDeprecated.push(tag);
    }
  });
  checks.push({
    id: "deprecatedHtml",
    name: "Deprecated HTML",
    status: deprecatedCount === 0 ? "pass" : "warning",
    score: deprecatedCount === 0 ? 100 : 60,
    weight: 5,
    value: { count: deprecatedCount, tags: foundDeprecated },
    message: deprecatedCount === 0
      ? "No deprecated HTML tags found"
      : `Found ${deprecatedCount} deprecated HTML elements: ${foundDeprecated.join(", ")}`,
    recommendation: deprecatedCount > 0
      ? "Replace deprecated HTML tags with modern alternatives"
      : undefined,
  });

  // 10. Text/HTML Ratio
  const htmlLength = data.html.length;
  const textLength = $("body").text().replace(/\s+/g, "").length;
  const textRatio = Math.round((textLength / htmlLength) * 100);
  checks.push({
    id: "textHtmlRatio",
    name: "Text/HTML Ratio",
    status: textRatio >= 15 ? "pass" : textRatio >= 10 ? "warning" : "fail",
    score: textRatio >= 25 ? 100 : textRatio >= 15 ? 80 : textRatio >= 10 ? 60 : 30,
    weight: 8,
    value: { ratio: textRatio, htmlSize: htmlLength, textSize: textLength },
    message: `Text to HTML ratio: ${textRatio}%`,
    recommendation: textRatio < 15
      ? "Increase text content relative to HTML code"
      : undefined,
  });

  // 11. Page Size
  const pageSizeKB = Math.round(data.contentLength / 1024);
  checks.push({
    id: "pageSize",
    name: "Page Size",
    status: pageSizeKB <= 100 ? "pass" : pageSizeKB <= 500 ? "warning" : "fail",
    score: pageSizeKB <= 100 ? 100 : pageSizeKB <= 300 ? 80 : pageSizeKB <= 500 ? 60 : 30,
    weight: 8,
    value: { sizeKB: pageSizeKB, sizeBytes: data.contentLength },
    message: `Page size: ${pageSizeKB} KB`,
    recommendation: pageSizeKB > 100
      ? "Optimize page size for faster loading"
      : undefined,
  });

  // 12. Doctype
  const hasDoctype = data.html.toLowerCase().includes("<!doctype html");
  checks.push({
    id: "doctype",
    name: "HTML5 Doctype",
    status: hasDoctype ? "pass" : "warning",
    score: hasDoctype ? 100 : 50,
    weight: 3,
    value: { hasDoctype },
    message: hasDoctype
      ? "Valid HTML5 doctype found"
      : "No HTML5 doctype declaration",
    recommendation: !hasDoctype
      ? "Add <!DOCTYPE html> at the start of your HTML"
      : undefined,
  });

  // 13. Character Encoding
  const charset = $('meta[charset]').attr("charset") ||
    $('meta[http-equiv="Content-Type"]').attr("content")?.match(/charset=([^;]+)/)?.[1] ||
    "";
  const hasUtf8 = charset.toLowerCase().includes("utf-8");
  checks.push({
    id: "charset",
    name: "Character Encoding",
    status: hasUtf8 ? "pass" : charset ? "warning" : "fail",
    score: hasUtf8 ? 100 : charset ? 70 : 30,
    weight: 5,
    value: { charset },
    message: hasUtf8
      ? "UTF-8 encoding declared"
      : charset
      ? `Encoding: ${charset} (UTF-8 recommended)`
      : "No character encoding declared",
    recommendation: !hasUtf8
      ? "Use UTF-8 character encoding"
      : undefined,
  });

  // 14. Legible Font Sizes (check for very small font sizes)
  const smallFontElements = $('[style*="font-size"]').filter((_, el) => {
    const style = $(el).attr("style") || "";
    const fontSizeMatch = style.match(/font-size:\s*(\d+)(px|pt|em|rem)/);
    if (fontSizeMatch) {
      const size = parseInt(fontSizeMatch[1]);
      const unit = fontSizeMatch[2];
      if (unit === "px" && size < 12) return true;
      if (unit === "pt" && size < 9) return true;
    }
    return false;
  }).length;
  checks.push({
    id: "legibleFonts",
    name: "Legible Font Sizes",
    status: smallFontElements === 0 ? "pass" : "warning",
    score: smallFontElements === 0 ? 100 : 70,
    weight: 5,
    value: { smallFontElements },
    message: smallFontElements === 0
      ? "Text appears to be legible across devices"
      : `Found ${smallFontElements} elements with potentially small fonts`,
    recommendation: smallFontElements > 0
      ? "Ensure all text is at least 12px for readability"
      : undefined,
  });

  // 15. Tap Target Sizing (check for small clickable elements)
  const smallLinks = $("a, button").filter((_, el) => {
    const style = $(el).attr("style") || "";
    const widthMatch = style.match(/width:\s*(\d+)px/);
    const heightMatch = style.match(/height:\s*(\d+)px/);
    if (widthMatch && parseInt(widthMatch[1]) < 44) return true;
    if (heightMatch && parseInt(heightMatch[1]) < 44) return true;
    return false;
  }).length;
  const totalClickable = $("a, button").length;
  checks.push({
    id: "tapTargets",
    name: "Tap Target Sizing",
    status: smallLinks === 0 ? "pass" : "warning",
    score: smallLinks === 0 ? 100 : 70,
    weight: 5,
    value: { smallLinks, totalClickable },
    message: smallLinks === 0
      ? "Links and buttons appear appropriately sized for touchscreens"
      : `Found ${smallLinks} potentially small tap targets`,
    recommendation: smallLinks > 0
      ? "Ensure tap targets are at least 44x44 pixels"
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
      ? "Your site's usability is good!"
      : score >= 60
      ? "Your site's usability needs some improvement"
      : "Your site's usability needs significant work",
    checks,
  };
}
