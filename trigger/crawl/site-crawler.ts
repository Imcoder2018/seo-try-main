import { task, metadata } from "@trigger.dev/sdk";

interface CrawlResult {
  url: string;
  status: number;
  title?: string;
  links: string[];
  error?: string;
  depth: number;
  internalLinkCount: number;
  isNavigation: boolean;
}

interface SiteCrawlPayload {
  url: string;
  maxPages?: number;
  auditId?: string;
}

interface SiteCrawlOutput {
  baseUrl: string;
  pagesFound: number;
  pages: CrawlResult[];
  sitemapUrls: string[];
  errors: string[];
  urlGroups: {
    core: string[];
    blog: string[];
    product: string[];
    service: string[];
    category: string[];
    other: string[];
  };
  topLinkedPages: Array<{ url: string; linkCount: number }>;
}

// Normalize URL to prevent duplicates (trailing slash, case, etc.)
function normalizeUrl(urlStr: string, hostname: string): string {
  try {
    const urlObj = new URL(urlStr);
    // Only process same-hostname URLs
    if (urlObj.hostname !== hostname) return urlStr;
    
    // Normalize: lowercase hostname, remove trailing slash (except for root)
    let pathname = urlObj.pathname;
    if (pathname !== '/' && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    // Remove default ports, fragments, and unnecessary query params for deduplication
    return `${urlObj.protocol}//${urlObj.hostname.toLowerCase()}${pathname}`;
  } catch {
    return urlStr;
  }
}

// Check if URL is a page URL (not an asset like image, script, etc.)
function isPageUrl(urlStr: string): boolean {
  try {
    const urlObj = new URL(urlStr);
    const pathname = urlObj.pathname.toLowerCase();
    
    // Exclude common asset file extensions
    const assetExtensions = [
      // Images
      '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp', '.tiff', '.avif',
      // Scripts & styles
      '.js', '.css', '.map',
      // Documents (non-page)
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar', '.tar', '.gz',
      // Fonts
      '.woff', '.woff2', '.ttf', '.eot', '.otf',
      // Media
      '.mp3', '.mp4', '.avi', '.mov', '.wmv', '.flv', '.ogg', '.webm', '.wav',
      // Data
      '.json', '.xml', '.csv', '.txt',
    ];
    
    for (const ext of assetExtensions) {
      if (pathname.endsWith(ext)) return false;
    }
    
    // Exclude common asset paths
    const assetPaths = [
      '/wp-content/uploads/',
      '/wp-includes/',
      '/wp-admin/',
      '/assets/',
      '/static/',
      '/images/',
      '/img/',
      '/css/',
      '/js/',
      '/fonts/',
      '/media/',
    ];
    
    for (const path of assetPaths) {
      if (pathname.includes(path)) return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export const siteCrawlerTask = task({
  id: "site-crawler",
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 60000,
  },
  run: async (payload: SiteCrawlPayload): Promise<SiteCrawlOutput> => {
    const { url, maxPages = 50, auditId } = payload;

    try {
      const baseUrl = new URL(url);
      const hostname = baseUrl.hostname.toLowerCase();

      const visited = new Set<string>();
      // Normalize the starting URL
      const normalizedStartUrl = normalizeUrl(url, hostname);
      const toVisit: Array<{ url: string; depth: number }> = [{ url: normalizedStartUrl, depth: 0 }];
      const pages: CrawlResult[] = [];
      const errors: string[] = [];
      let sitemapUrls: string[] = [];
      const internalLinkCounts = new Map<string, number>();
      const navigationLinks = new Set<string>();

      metadata.set("status", {
        progress: 0,
        label: "Starting site crawl...",
        pagesFound: 0,
        auditId,
      } as any);

      // Validate URL
      try {
        new URL(url);
      } catch (e) {
        throw new Error(`Invalid URL: ${url}`);
      }

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
            const rawUrl = match[1];
            // Only process URLs from same hostname and that are page URLs
            try {
              const urlObj = new URL(rawUrl);
              if (urlObj.hostname.toLowerCase() !== hostname) continue;
              if (!isPageUrl(rawUrl)) continue;
              
              const normalizedSitemapUrl = normalizeUrl(rawUrl, hostname);
              if (!visited.has(normalizedSitemapUrl)) {
                sitemapUrls.push(normalizedSitemapUrl);
                if (!toVisit.find(t => t.url === normalizedSitemapUrl)) {
                  toVisit.push({ url: normalizedSitemapUrl, depth: 1 });
                }
              }
            } catch {
              // Skip invalid URLs
            }
          }
          metadata.set("status", {
            progress: 5,
            label: `Found ${sitemapUrls.length} URLs in sitemap`,
            pagesFound: sitemapUrls.length,
            auditId,
          } as any);
        }
      } catch (e) {
        console.log("Sitemap not available or error:", e);
        metadata.set("status", {
          progress: 5,
          label: "Sitemap not available, crawling from homepage",
          pagesFound: 0,
          auditId,
        } as any);
      }

      // Crawl pages
      let pageCount = 0;
      while (toVisit.length > 0 && visited.size < maxPages) {
        const current = toVisit.shift()!;
        const currentUrl = current.url;
        const currentDepth = current.depth;

        if (visited.has(currentUrl)) continue;
        visited.add(currentUrl);
        pageCount++;

        const progress = Math.min(90, Math.round((visited.size / maxPages) * 90) + 5);
        metadata.set("status", {
          progress,
          label: `Crawling page ${visited.size}/${maxPages}: ${currentUrl.slice(0, 50)}...`,
          pagesFound: visited.size,
          auditId,
          currentPage: currentUrl,
        } as any);

        try {
          const response = await fetch(currentUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Accept-Encoding": "gzip, deflate, br",
              "Connection": "keep-alive",
              "Upgrade-Insecure-Requests": "1",
            },
            signal: AbortSignal.timeout(30000),
            redirect: "follow",
          });

          const html = await response.text();

          // Extract title
          const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
          const title = titleMatch ? titleMatch[1].trim() : undefined;

          // Check content type to filter junk
          const contentType = response.headers.get('content-type') || '';
          if (!contentType.includes('text/html')) {
            console.log(`Skipping non-HTML content: ${currentUrl}`);
            continue;
          }

          // Filter out WordPress junk paths
          const junkPatterns = [
            /\/xmlrpc\.php/i,
            /\/wp-json\//i,
            /\/feed\//i,
            /\/wp-content\/uploads\//i,
            /\/wp-admin\//i,
            /\/wp-includes\//i,
          ];
          if (junkPatterns.some(pattern => pattern.test(currentUrl))) {
            console.log(`Skipping junk path: ${currentUrl}`);
            continue;
          }

          // Extract links and detect navigation
          const linksSet = new Set<string>(); // Use Set to automatically deduplicate
          const linkMatches = html.matchAll(/href=["']([^"']+)["']/gi);
          const navMatch = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/i);
          const footerMatch = html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);

          // Extract navigation links
          const navContent = navMatch?.[1] || "";
          const footerContent = footerMatch?.[1] || "";
          const navLinks = [...navContent.matchAll(/href=["']([^"']+)["']/gi), ...footerContent.matchAll(/href=["']([^"']+)["']/gi)];
          
          // Track which URLs this page links to (for unique counting per source page)
          const linkedFromThisPage = new Set<string>();
          
          for (const match of linkMatches) {
            try {
              const rawHref = match[1];
              // Skip hash-only links, javascript:, mailto:, tel:, etc.
              if (rawHref.startsWith('#') || rawHref.startsWith('javascript:') || 
                  rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
                continue;
              }
              
              const linkUrl = new URL(rawHref, currentUrl);
              
              // Only process internal links (same hostname)
              if (linkUrl.hostname.toLowerCase() !== hostname) continue;
              
              // Skip if it's an asset URL, not a page
              if (!isPageUrl(linkUrl.href)) continue;
              
              // Skip junk patterns
              if (junkPatterns.some(pattern => pattern.test(linkUrl.pathname))) continue;
              
              // Normalize the URL
              const normalizedLinkUrl = normalizeUrl(linkUrl.href, hostname);
              
              // Add to unique links set for this page
              linksSet.add(normalizedLinkUrl);
              
              // Track internal link count (only count each URL once per source page)
              if (!linkedFromThisPage.has(normalizedLinkUrl)) {
                linkedFromThisPage.add(normalizedLinkUrl);
                internalLinkCounts.set(normalizedLinkUrl, (internalLinkCounts.get(normalizedLinkUrl) || 0) + 1);
              }

              if (!visited.has(normalizedLinkUrl) && !toVisit.find(t => t.url === normalizedLinkUrl) && visited.size + toVisit.length < maxPages) {
                toVisit.push({ url: normalizedLinkUrl, depth: currentDepth + 1 });
              }
            } catch {}
          }
          
          // Convert Set to Array for the result
          const links = Array.from(linksSet);

          // Check if current page is in navigation
          const isNav = navLinks.some(n => {
            try {
              const navUrl = new URL(n[1], currentUrl);
              return navUrl.hostname === hostname && 
                     `${navUrl.protocol}//${navUrl.hostname}${navUrl.pathname}` === currentUrl;
            } catch { return false; }
          });
          if (isNav) navigationLinks.add(currentUrl);

          pages.push({
            url: currentUrl,
            status: response.status,
            title,
            links: links.slice(0, 50), // Already deduplicated via Set
            depth: currentDepth,
            internalLinkCount: internalLinkCounts.get(currentUrl) || 0,
            isNavigation: navigationLinks.has(currentUrl),
          });

        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : "Unknown error";
          console.error(`Error crawling ${currentUrl}:`, e);
          errors.push(`${currentUrl}: ${errorMsg}`);
          pages.push({
            url: currentUrl,
            status: 0,
            links: [],
            error: errorMsg,
            depth: currentDepth,
            internalLinkCount: 0,
            isNavigation: false,
          });

          // Update metadata with error info
          metadata.set("status", {
            progress,
            label: `Error crawling ${currentUrl.slice(0, 30)}...: ${errorMsg.slice(0, 50)}...`,
            pagesFound: visited.size,
            auditId,
            lastError: errorMsg,
          } as any);
        }

        // Small delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Group URLs by pattern for representative sampling
      const urlGroups = {
        core: [] as string[],
        blog: [] as string[],
        product: [] as string[],
        service: [] as string[],
        category: [] as string[],
        other: [] as string[],
      };

      // Identify core pages (Priority 1)
      const corePatterns = [
        /^\/$/, // Homepage
        /\/contact/i,
        /\/contact-us/i,
        /\/about/i,
        /\/about-us/i,
        /\/privacy-policy/i,
        /\/terms/i,
        /\/terms-of-service/i,
      ];

      // Identify template patterns (Priority 2)
      const blogPatterns = [/\/blog\//i, /\/news\//i, /\/post\//i, /\/article\//i, /\/insights\//i, /\/journal\//i];
      const productPatterns = [/\/product\//i, /\/item\//i, /\/shop\//i, /\/p\//i, /\/store\//i];
      const servicePatterns = [/\/service\//i, /\/services\//i, /\/solution\//i, /\/solutions\//i, /\/offering\//i];
      const categoryPatterns = [/\/category\//i, /\/collection\//i, /\/tag\//i, /\/products\//i];

      for (const page of pages) {
        const pathname = new URL(page.url).pathname;

        // Check for core pages
        if (corePatterns.some(pattern => pattern.test(pathname))) {
          urlGroups.core.push(page.url);
        }
        // Check for blog patterns
        else if (blogPatterns.some(pattern => pattern.test(pathname))) {
          urlGroups.blog.push(page.url);
        }
        // Check for service patterns (Money Pages)
        else if (servicePatterns.some(pattern => pattern.test(pathname))) {
          urlGroups.service.push(page.url);
        }
        // Check for product patterns
        else if (productPatterns.some(pattern => pattern.test(pathname))) {
          urlGroups.product.push(page.url);
        }
        // Check for category patterns
        else if (categoryPatterns.some(pattern => pattern.test(pathname))) {
          urlGroups.category.push(page.url);
        }
        // Everything else
        else {
          urlGroups.other.push(page.url);
        }
      }

      // Get top linked pages (Priority 3)
      const topLinkedPages = Array.from(internalLinkCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([url, count]) => ({ url, linkCount: count }));

      metadata.set("status", {
        progress: 100,
        label: `Crawl complete! Found ${pages.length} pages`,
        pagesFound: pages.length,
        auditId,
        errors: errors.length,
      } as any);

      return {
        baseUrl: url,
        pagesFound: pages.length,
        pages,
        sitemapUrls,
        errors,
        urlGroups,
        topLinkedPages,
      };

    } catch (error) {
      // Catch any unexpected errors
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Site crawler fatal error:", error);
      metadata.set("status", {
        progress: 0,
        label: `Fatal error: ${errorMsg}`,
        pagesFound: 0,
        auditId,
        error: errorMsg,
      } as any);
      throw error;
    }
  },
});
