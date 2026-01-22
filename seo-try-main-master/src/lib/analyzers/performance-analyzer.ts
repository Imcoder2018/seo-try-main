import * as cheerio from "cheerio";
import type { Check, CategoryResult, PageData } from "./types";
import { calculateGrade } from "../utils";

interface CoreWebVitals {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  si: number;
  tbt: number;
  performanceScore: number;
}

async function getPageSpeedInsights(url: string): Promise<CoreWebVitals | null> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  
  if (!apiKey) {
    console.log("No GOOGLE_PAGESPEED_API_KEY configured, skipping PageSpeed Insights");
    return null;
  }

  try {
    const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    apiUrl.searchParams.set("url", url);
    apiUrl.searchParams.set("key", apiKey);
    apiUrl.searchParams.set("strategy", "mobile");
    apiUrl.searchParams.set("category", "performance");

    const response = await fetch(apiUrl.toString(), {
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.error("PageSpeed API error:", response.status);
      return null;
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;
    const audits = lighthouse?.audits || {};

    return {
      lcp: Math.round(audits["largest-contentful-paint"]?.numericValue || 0),
      fid: Math.round(audits["max-potential-fid"]?.numericValue || 0),
      cls: parseFloat((audits["cumulative-layout-shift"]?.numericValue || 0).toFixed(3)),
      fcp: Math.round(audits["first-contentful-paint"]?.numericValue || 0),
      ttfb: Math.round(audits["server-response-time"]?.numericValue || 0),
      si: Math.round(audits["speed-index"]?.numericValue || 0),
      tbt: Math.round(audits["total-blocking-time"]?.numericValue || 0),
      performanceScore: Math.round((lighthouse?.categories?.performance?.score || 0) * 100),
    };
  } catch (e) {
    console.error("PageSpeed Insights error:", e);
    return null;
  }
}

export async function analyzePerformance(data: PageData): Promise<CategoryResult> {
  const $ = cheerio.load(data.html);
  const checks: Check[] = [];

  // Fetch Core Web Vitals from PageSpeed Insights API
  const cwv = await getPageSpeedInsights(data.url);

  // 1. Response Time
  const responseTime = data.responseTime;
  checks.push({
    id: "serverResponseTime",
    name: "Server Response Time",
    status: responseTime <= 200 ? "pass" : responseTime <= 600 ? "warning" : "fail",
    score: responseTime <= 200 ? 100 : responseTime <= 400 ? 80 : responseTime <= 600 ? 60 : 30,
    weight: 15,
    value: { time: responseTime },
    message: `Server responded in ${responseTime}ms`,
    recommendation: responseTime > 200
      ? "Improve server response time (aim for under 200ms)"
      : undefined,
  });

  // 2. Compression (check headers)
  const contentEncoding = data.headers["content-encoding"] || "";
  const isCompressed = contentEncoding.includes("gzip") || contentEncoding.includes("br") || contentEncoding.includes("deflate");
  checks.push({
    id: "compression",
    name: "GZIP/Brotli Compression",
    status: isCompressed ? "pass" : "warning",
    score: isCompressed ? 100 : 50,
    weight: 15,
    value: { encoding: contentEncoding, compressed: isCompressed },
    message: isCompressed
      ? `Compression enabled (${contentEncoding})`
      : "No compression detected",
    recommendation: !isCompressed
      ? "Enable GZIP or Brotli compression"
      : undefined,
  });

  // 3. HTTP/2 or HTTP/3 (from headers)
  // Note: This is simplified - real HTTP/2 detection requires protocol info
  checks.push({
    id: "http2",
    name: "HTTP/2 Protocol",
    status: "info",
    score: 80,
    weight: 5,
    value: { note: "Protocol detection requires server inspection" },
    message: "HTTP/2+ status requires server-level inspection",
  });

  // 4. Page Size
  const pageSizeKB = Math.round(data.contentLength / 1024);
  checks.push({
    id: "pageSize",
    name: "Page Size",
    status: pageSizeKB <= 100 ? "pass" : pageSizeKB <= 500 ? "warning" : "fail",
    score: pageSizeKB <= 100 ? 100 : pageSizeKB <= 300 ? 80 : pageSizeKB <= 500 ? 60 : 30,
    weight: 12,
    value: { sizeKB: pageSizeKB },
    message: `HTML page size: ${pageSizeKB} KB`,
    recommendation: pageSizeKB > 100
      ? "Reduce HTML page size"
      : undefined,
  });

  // 5. Image Optimization Check
  const images = $("img");
  let largeImages = 0;
  let lazyLoadedImages = 0;
  let modernFormatImages = 0;
  images.each((_, el) => {
    const src = $(el).attr("src") || "";
    const loading = $(el).attr("loading");
    if (loading === "lazy") lazyLoadedImages++;
    if (src.includes(".webp") || src.includes(".avif")) modernFormatImages++;
  });
  const totalImages = images.length;
  checks.push({
    id: "imageLazyLoading",
    name: "Image Lazy Loading",
    status: totalImages === 0 || lazyLoadedImages > 0 ? "pass" : "warning",
    score: totalImages === 0 ? 100 : lazyLoadedImages > 0 ? 100 : 50,
    weight: 8,
    value: { total: totalImages, lazyLoaded: lazyLoadedImages },
    message: totalImages === 0
      ? "No images to lazy load"
      : lazyLoadedImages > 0
      ? `${lazyLoadedImages}/${totalImages} images use lazy loading`
      : "No lazy loading detected on images",
    recommendation: totalImages > 0 && lazyLoadedImages === 0
      ? "Add loading='lazy' to images below the fold"
      : undefined,
  });

  // 6. Modern Image Formats
  checks.push({
    id: "modernImageFormats",
    name: "Modern Image Formats",
    status: totalImages === 0 || modernFormatImages > 0 ? "pass" : "info",
    score: totalImages === 0 ? 100 : modernFormatImages > 0 ? 100 : 70,
    weight: 5,
    value: { total: totalImages, modernFormat: modernFormatImages },
    message: totalImages === 0
      ? "No images found"
      : modernFormatImages > 0
      ? `${modernFormatImages}/${totalImages} images use modern formats (WebP/AVIF)`
      : "Consider using WebP or AVIF image formats",
  });

  // 7. JavaScript Files Count
  const scripts = $("script[src]");
  const scriptCount = scripts.length;
  const inlineScripts = $("script:not([src])").length;
  checks.push({
    id: "jsFileCount",
    name: "JavaScript Files",
    status: scriptCount <= 5 ? "pass" : scriptCount <= 15 ? "warning" : "fail",
    score: scriptCount <= 5 ? 100 : scriptCount <= 10 ? 80 : scriptCount <= 15 ? 60 : 40,
    weight: 8,
    value: { external: scriptCount, inline: inlineScripts },
    message: `Found ${scriptCount} external JS files and ${inlineScripts} inline scripts`,
    recommendation: scriptCount > 10
      ? "Reduce the number of JavaScript files by bundling"
      : undefined,
  });

  // 8. CSS Files Count
  const stylesheets = $('link[rel="stylesheet"]');
  const cssCount = stylesheets.length;
  const inlineStyles = $("style").length;
  checks.push({
    id: "cssFileCount",
    name: "CSS Files",
    status: cssCount <= 3 ? "pass" : cssCount <= 8 ? "warning" : "fail",
    score: cssCount <= 3 ? 100 : cssCount <= 5 ? 80 : cssCount <= 8 ? 60 : 40,
    weight: 8,
    value: { external: cssCount, inline: inlineStyles },
    message: `Found ${cssCount} CSS files and ${inlineStyles} inline style blocks`,
    recommendation: cssCount > 5
      ? "Reduce the number of CSS files by combining them"
      : undefined,
  });

  // 9. Render-blocking Resources
  const renderBlockingJS = $('script:not([async]):not([defer])[src]').length;
  const renderBlockingCSS = $('link[rel="stylesheet"]:not([media="print"])').length;
  checks.push({
    id: "renderBlocking",
    name: "Render-Blocking Resources",
    status: renderBlockingJS <= 2 && renderBlockingCSS <= 2 ? "pass" : "warning",
    score: renderBlockingJS + renderBlockingCSS <= 4 ? 100 : 60,
    weight: 10,
    value: { js: renderBlockingJS, css: renderBlockingCSS },
    message: `${renderBlockingJS} render-blocking JS, ${renderBlockingCSS} render-blocking CSS`,
    recommendation: renderBlockingJS > 2
      ? "Add async or defer attributes to non-critical JavaScript"
      : undefined,
  });

  // 10. Minification Check (heuristic based on whitespace)
  const htmlContent = data.html;
  const whitespaceRatio = (htmlContent.match(/\s{2,}/g) || []).length / htmlContent.length * 1000;
  const isMinified = whitespaceRatio < 2;
  checks.push({
    id: "htmlMinification",
    name: "HTML Minification",
    status: isMinified ? "pass" : "info",
    score: isMinified ? 100 : 70,
    weight: 5,
    value: { isMinified, whitespaceRatio: whitespaceRatio.toFixed(2) },
    message: isMinified
      ? "HTML appears to be minified"
      : "HTML could benefit from minification",
    recommendation: !isMinified
      ? "Consider minifying HTML to reduce page size"
      : undefined,
  });

  // 11. Caching Headers Check
  const cacheControl = data.headers["cache-control"] || "";
  const expires = data.headers["expires"] || "";
  const hasCaching = cacheControl.length > 0 || expires.length > 0;
  checks.push({
    id: "caching",
    name: "Browser Caching",
    status: hasCaching ? "pass" : "warning",
    score: hasCaching ? 100 : 50,
    weight: 8,
    value: { cacheControl, expires },
    message: hasCaching
      ? `Caching headers found: ${cacheControl || expires}`
      : "No caching headers detected",
    recommendation: !hasCaching
      ? "Implement browser caching with Cache-Control headers"
      : undefined,
  });

  // 12. DNS Prefetch
  const dnsPrefetch = $('link[rel="dns-prefetch"]').length;
  const preconnect = $('link[rel="preconnect"]').length;
  checks.push({
    id: "resourceHints",
    name: "Resource Hints",
    status: dnsPrefetch > 0 || preconnect > 0 ? "pass" : "info",
    score: dnsPrefetch > 0 || preconnect > 0 ? 100 : 70,
    weight: 3,
    value: { dnsPrefetch, preconnect },
    message: dnsPrefetch + preconnect > 0
      ? `Found ${dnsPrefetch} dns-prefetch and ${preconnect} preconnect hints`
      : "No resource hints found",
    recommendation: dnsPrefetch === 0 && preconnect === 0
      ? "Add dns-prefetch or preconnect for third-party domains"
      : undefined,
  });

  // === CORE WEB VITALS FROM PAGESPEED INSIGHTS ===
  if (cwv) {
    // 13. LCP - Largest Contentful Paint
    checks.push({
      id: "lcp",
      name: "Largest Contentful Paint (LCP)",
      status: cwv.lcp <= 2500 ? "pass" : cwv.lcp <= 4000 ? "warning" : "fail",
      score: cwv.lcp <= 2500 ? 100 : cwv.lcp <= 4000 ? 60 : 20,
      weight: 15,
      value: { lcp: cwv.lcp, unit: "ms" },
      message: `LCP: ${(cwv.lcp / 1000).toFixed(2)}s ${cwv.lcp <= 2500 ? "(Good)" : cwv.lcp <= 4000 ? "(Needs Improvement)" : "(Poor)"}`,
      recommendation: cwv.lcp > 2500
        ? "Improve LCP by optimizing images, preloading key resources, and reducing server response time"
        : undefined,
    });

    // 14. FID - First Input Delay (using TBT as proxy)
    checks.push({
      id: "tbt",
      name: "Total Blocking Time (TBT)",
      status: cwv.tbt <= 200 ? "pass" : cwv.tbt <= 600 ? "warning" : "fail",
      score: cwv.tbt <= 200 ? 100 : cwv.tbt <= 600 ? 60 : 20,
      weight: 12,
      value: { tbt: cwv.tbt, unit: "ms" },
      message: `TBT: ${cwv.tbt}ms ${cwv.tbt <= 200 ? "(Good)" : cwv.tbt <= 600 ? "(Needs Improvement)" : "(Poor)"}`,
      recommendation: cwv.tbt > 200
        ? "Reduce TBT by breaking up long tasks, optimizing JavaScript, and removing unused code"
        : undefined,
    });

    // 15. CLS - Cumulative Layout Shift
    checks.push({
      id: "cls",
      name: "Cumulative Layout Shift (CLS)",
      status: cwv.cls <= 0.1 ? "pass" : cwv.cls <= 0.25 ? "warning" : "fail",
      score: cwv.cls <= 0.1 ? 100 : cwv.cls <= 0.25 ? 60 : 20,
      weight: 12,
      value: { cls: cwv.cls },
      message: `CLS: ${cwv.cls} ${cwv.cls <= 0.1 ? "(Good)" : cwv.cls <= 0.25 ? "(Needs Improvement)" : "(Poor)"}`,
      recommendation: cwv.cls > 0.1
        ? "Reduce CLS by setting explicit dimensions on images/videos and avoiding inserting content above existing content"
        : undefined,
    });

    // 16. FCP - First Contentful Paint
    checks.push({
      id: "fcp",
      name: "First Contentful Paint (FCP)",
      status: cwv.fcp <= 1800 ? "pass" : cwv.fcp <= 3000 ? "warning" : "fail",
      score: cwv.fcp <= 1800 ? 100 : cwv.fcp <= 3000 ? 60 : 20,
      weight: 10,
      value: { fcp: cwv.fcp, unit: "ms" },
      message: `FCP: ${(cwv.fcp / 1000).toFixed(2)}s ${cwv.fcp <= 1800 ? "(Good)" : cwv.fcp <= 3000 ? "(Needs Improvement)" : "(Poor)"}`,
      recommendation: cwv.fcp > 1800
        ? "Improve FCP by eliminating render-blocking resources and optimizing critical rendering path"
        : undefined,
    });

    // 17. Speed Index
    checks.push({
      id: "speedIndex",
      name: "Speed Index",
      status: cwv.si <= 3400 ? "pass" : cwv.si <= 5800 ? "warning" : "fail",
      score: cwv.si <= 3400 ? 100 : cwv.si <= 5800 ? 60 : 20,
      weight: 8,
      value: { si: cwv.si, unit: "ms" },
      message: `Speed Index: ${(cwv.si / 1000).toFixed(2)}s ${cwv.si <= 3400 ? "(Good)" : cwv.si <= 5800 ? "(Needs Improvement)" : "(Poor)"}`,
      recommendation: cwv.si > 3400
        ? "Improve Speed Index by optimizing how content is painted to the screen"
        : undefined,
    });

    // 18. Google Performance Score
    checks.push({
      id: "performanceScore",
      name: "Google Performance Score",
      status: cwv.performanceScore >= 90 ? "pass" : cwv.performanceScore >= 50 ? "warning" : "fail",
      score: cwv.performanceScore,
      weight: 15,
      value: { score: cwv.performanceScore, source: "Google PageSpeed Insights" },
      message: `Google Performance Score: ${cwv.performanceScore}/100 ${cwv.performanceScore >= 90 ? "(Good)" : cwv.performanceScore >= 50 ? "(Needs Improvement)" : "(Poor)"}`,
      recommendation: cwv.performanceScore < 90
        ? "Address the Core Web Vitals issues above to improve your performance score"
        : undefined,
    });
  }

  // Calculate category score
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore = checks.reduce((sum, c) => sum + c.score * c.weight, 0);
  const score = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  const grade = calculateGrade(score);

  return {
    score,
    grade,
    message: score >= 80
      ? "Your site's performance is good!"
      : score >= 60
      ? "Your site's performance could be improved"
      : "Your site's performance needs significant optimization",
    checks,
  };
}
