import { task, metadata } from "@trigger.dev/sdk/v3";

interface PageIssue {
  url: string;
  title?: string;
  issues: Array<{
    type: string;
    severity: "critical" | "warning" | "info";
    message: string;
    details?: string;
  }>;
}

interface SiteWideAuditPayload {
  url: string;
  maxPages?: number;
}

interface SiteWideAuditOutput {
  baseUrl: string;
  totalPages: number;
  crawledPages: number;
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  pages: PageIssue[];
  siteWideIssues: Array<{
    type: string;
    count: number;
    severity: "critical" | "warning" | "info";
    description: string;
    affectedUrls: string[];
  }>;
  summary: {
    missingTitles: number;
    missingMetaDescriptions: number;
    missingH1: number;
    duplicateTitles: number;
    duplicateDescriptions: number;
    brokenLinks: number;
    missingAltText: number;
    noindexPages: number;
    orphanPages: number;
    slowPages: number;
    redirectChains: number;
  };
}

async function fetchPage(url: string): Promise<{ html: string; status: number; responseTime: number; finalUrl: string } | null> {
  const startTime = Date.now();
  try {
    const response = await fetch(url, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (compatible; SEOAuditBot/1.0)",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(20000),
      redirect: "follow",
    });
    
    const html = await response.text();
    const responseTime = Date.now() - startTime;
    
    return {
      html,
      status: response.status,
      responseTime,
      finalUrl: response.url,
    };
  } catch {
    return null;
  }
}

function analyzePageSEO(html: string, url: string, responseTime: number): PageIssue["issues"] {
  const issues: PageIssue["issues"] = [];
  
  // Title check
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  
  if (!title) {
    issues.push({ type: "missing-title", severity: "critical", message: "Page is missing a title tag" });
  } else if (title.length < 30) {
    issues.push({ type: "short-title", severity: "warning", message: `Title is too short (${title.length} chars)`, details: title });
  } else if (title.length > 60) {
    issues.push({ type: "long-title", severity: "warning", message: `Title is too long (${title.length} chars)`, details: title });
  }
  
  // Meta description check
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const metaDesc = descMatch ? descMatch[1].trim() : null;
  
  if (!metaDesc) {
    issues.push({ type: "missing-meta-description", severity: "critical", message: "Page is missing meta description" });
  } else if (metaDesc.length < 100) {
    issues.push({ type: "short-meta-description", severity: "warning", message: `Meta description is too short (${metaDesc.length} chars)` });
  } else if (metaDesc.length > 160) {
    issues.push({ type: "long-meta-description", severity: "warning", message: `Meta description is too long (${metaDesc.length} chars)` });
  }
  
  // H1 check
  const h1Matches = html.match(/<h1[^>]*>(.*?)<\/h1>/gi);
  if (!h1Matches || h1Matches.length === 0) {
    issues.push({ type: "missing-h1", severity: "critical", message: "Page is missing H1 heading" });
  } else if (h1Matches.length > 1) {
    issues.push({ type: "multiple-h1", severity: "warning", message: `Page has ${h1Matches.length} H1 headings` });
  }
  
  // Image alt text
  const imgMatches = html.matchAll(/<img[^>]*>/gi);
  let imagesWithoutAlt = 0;
  for (const match of imgMatches) {
    if (!match[0].includes('alt=') || match[0].match(/alt=["']\s*["']/)) {
      imagesWithoutAlt++;
    }
  }
  if (imagesWithoutAlt > 0) {
    issues.push({ 
      type: "missing-alt-text", 
      severity: "warning", 
      message: `${imagesWithoutAlt} image(s) missing alt text` 
    });
  }
  
  // Canonical check
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  if (!canonical) {
    issues.push({ type: "missing-canonical", severity: "warning", message: "Page is missing canonical tag" });
  }
  
  // Noindex check
  const noindex = html.match(/<meta[^>]+content=["'][^"']*noindex[^"']*["']/i);
  if (noindex) {
    issues.push({ type: "noindex", severity: "info", message: "Page has noindex directive" });
  }
  
  // Response time
  if (responseTime > 3000) {
    issues.push({ 
      type: "slow-response", 
      severity: "warning", 
      message: `Page loads slowly (${(responseTime/1000).toFixed(1)}s)` 
    });
  }
  
  // Open Graph check
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["']/i);
  const ogDesc = html.match(/<meta[^>]+property=["']og:description["']/i);
  if (!ogTitle || !ogDesc) {
    issues.push({ type: "missing-og-tags", severity: "info", message: "Missing Open Graph tags" });
  }
  
  // Schema markup
  const hasSchema = html.includes('application/ld+json') || html.includes('itemtype=');
  if (!hasSchema) {
    issues.push({ type: "missing-schema", severity: "info", message: "No structured data found" });
  }
  
  return issues;
}

export const siteWideAuditTask = task({
  id: "site-wide-audit",
  retry: { maxAttempts: 2 },
  run: async (payload: SiteWideAuditPayload): Promise<SiteWideAuditOutput> => {
    const { url, maxPages = 100 } = payload;
    
    const baseUrl = new URL(url);
    const hostname = baseUrl.hostname;
    
    const visited = new Set<string>();
    const toVisit: string[] = [url];
    const pages: PageIssue[] = [];
    const titles = new Map<string, string[]>();
    const descriptions = new Map<string, string[]>();
    const allInternalLinks = new Set<string>();
    const linkedPages = new Set<string>();
    let brokenLinks = 0;
    
    metadata.set("status", "Starting site-wide audit...");
    metadata.set("progress", 0);

    // Try to get sitemap first
    try {
      const sitemapUrl = `${baseUrl.protocol}//${hostname}/sitemap.xml`;
      const sitemapResponse = await fetch(sitemapUrl, {
        headers: { "User-Agent": "SEOAuditBot/1.0" },
        signal: AbortSignal.timeout(10000),
      });
      
      if (sitemapResponse.ok) {
        const sitemapText = await sitemapResponse.text();
        const urlMatches = sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g);
        for (const match of urlMatches) {
          const sitemapPageUrl = match[1];
          if (sitemapPageUrl.includes(hostname) && !toVisit.includes(sitemapPageUrl)) {
            toVisit.push(sitemapPageUrl);
            allInternalLinks.add(sitemapPageUrl);
          }
        }
      }
    } catch {}

    // Crawl and audit pages
    while (toVisit.length > 0 && visited.size < maxPages) {
      const currentUrl = toVisit.shift()!;
      
      if (visited.has(currentUrl)) continue;
      visited.add(currentUrl);

      const progress = Math.round((visited.size / maxPages) * 90);
      metadata.set("status", `Auditing page ${visited.size}/${maxPages}`);
      metadata.set("progress", progress);

      const pageData = await fetchPage(currentUrl);
      
      if (!pageData) {
        brokenLinks++;
        pages.push({
          url: currentUrl,
          issues: [{ type: "unreachable", severity: "critical", message: "Page is unreachable" }],
        });
        continue;
      }

      const { html, status, responseTime, finalUrl } = pageData;
      
      // Check for redirect
      if (finalUrl !== currentUrl) {
        pages.push({
          url: currentUrl,
          issues: [{ type: "redirect", severity: "info", message: `Redirects to ${finalUrl}` }],
        });
        if (!visited.has(finalUrl)) {
          toVisit.unshift(finalUrl);
        }
        continue;
      }
      
      if (status >= 400) {
        brokenLinks++;
        pages.push({
          url: currentUrl,
          issues: [{ type: "error-status", severity: "critical", message: `HTTP ${status} error` }],
        });
        continue;
      }

      // Extract title for duplicate check
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : null;
      if (title) {
        if (!titles.has(title)) titles.set(title, []);
        titles.get(title)!.push(currentUrl);
      }
      
      // Extract description for duplicate check
      const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
      const desc = descMatch ? descMatch[1].trim() : null;
      if (desc) {
        if (!descriptions.has(desc)) descriptions.set(desc, []);
        descriptions.get(desc)!.push(currentUrl);
      }

      // Analyze page SEO
      const issues = analyzePageSEO(html, currentUrl, responseTime);
      
      pages.push({
        url: currentUrl,
        title: title || undefined,
        issues,
      });

      // Extract internal links
      const linkMatches = html.matchAll(/href=["']([^"']+)["']/gi);
      for (const match of linkMatches) {
        try {
          const linkUrl = new URL(match[1], currentUrl);
          if (linkUrl.hostname === hostname && 
              !linkUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|pdf|css|js|ico|woff|woff2|ttf|eot)$/i)) {
            const cleanUrl = `${linkUrl.protocol}//${linkUrl.hostname}${linkUrl.pathname}`;
            allInternalLinks.add(cleanUrl);
            linkedPages.add(cleanUrl);
            
            if (!visited.has(cleanUrl) && !toVisit.includes(cleanUrl) && visited.size + toVisit.length < maxPages) {
              toVisit.push(cleanUrl);
            }
          }
        } catch {}
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    metadata.set("status", "Analyzing site-wide issues...");
    metadata.set("progress", 95);

    // Calculate site-wide issues
    const siteWideIssues: SiteWideAuditOutput["siteWideIssues"] = [];

    // Duplicate titles
    const duplicateTitles = [...titles.entries()].filter(([, urls]) => urls.length > 1);
    if (duplicateTitles.length > 0) {
      siteWideIssues.push({
        type: "duplicate-titles",
        count: duplicateTitles.length,
        severity: "warning",
        description: `${duplicateTitles.length} pages share the same title`,
        affectedUrls: duplicateTitles.flatMap(([, urls]) => urls),
      });
    }

    // Duplicate descriptions
    const duplicateDescs = [...descriptions.entries()].filter(([, urls]) => urls.length > 1);
    if (duplicateDescs.length > 0) {
      siteWideIssues.push({
        type: "duplicate-descriptions",
        count: duplicateDescs.length,
        severity: "warning",
        description: `${duplicateDescs.length} pages share the same meta description`,
        affectedUrls: duplicateDescs.flatMap(([, urls]) => urls),
      });
    }

    // Orphan pages (pages not linked from any other page)
    const orphanPages = pages.filter(p => !linkedPages.has(p.url) && p.url !== url);
    if (orphanPages.length > 0) {
      siteWideIssues.push({
        type: "orphan-pages",
        count: orphanPages.length,
        severity: "warning",
        description: `${orphanPages.length} pages are not linked from any other page`,
        affectedUrls: orphanPages.map(p => p.url),
      });
    }

    // Calculate summary
    const summary = {
      missingTitles: pages.filter(p => p.issues.some(i => i.type === "missing-title")).length,
      missingMetaDescriptions: pages.filter(p => p.issues.some(i => i.type === "missing-meta-description")).length,
      missingH1: pages.filter(p => p.issues.some(i => i.type === "missing-h1")).length,
      duplicateTitles: duplicateTitles.reduce((sum, [, urls]) => sum + urls.length, 0),
      duplicateDescriptions: duplicateDescs.reduce((sum, [, urls]) => sum + urls.length, 0),
      brokenLinks,
      missingAltText: pages.filter(p => p.issues.some(i => i.type === "missing-alt-text")).length,
      noindexPages: pages.filter(p => p.issues.some(i => i.type === "noindex")).length,
      orphanPages: orphanPages.length,
      slowPages: pages.filter(p => p.issues.some(i => i.type === "slow-response")).length,
      redirectChains: pages.filter(p => p.issues.some(i => i.type === "redirect")).length,
    };

    const totalIssues = pages.reduce((sum, p) => sum + p.issues.length, 0);
    const criticalIssues = pages.reduce((sum, p) => sum + p.issues.filter(i => i.severity === "critical").length, 0);
    const warningIssues = pages.reduce((sum, p) => sum + p.issues.filter(i => i.severity === "warning").length, 0);

    metadata.set("status", "Site-wide audit complete!");
    metadata.set("progress", 100);

    return {
      baseUrl: url,
      totalPages: allInternalLinks.size,
      crawledPages: visited.size,
      totalIssues,
      criticalIssues,
      warningIssues,
      pages,
      siteWideIssues,
      summary,
    };
  },
});
