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
      const hostname = baseUrl.hostname;

      const visited = new Set<string>();
      const toVisit: Array<{ url: string; depth: number }> = [{ url, depth: 0 }];
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
            const sitemapPageUrl = match[1];
            if (sitemapPageUrl.includes(hostname) && !visited.has(sitemapPageUrl)) {
              sitemapUrls.push(sitemapPageUrl);
              if (!toVisit.find(t => t.url === sitemapPageUrl)) {
                toVisit.push({ url: sitemapPageUrl, depth: 1 });
              }
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
          const links: string[] = [];
          const linkMatches = html.matchAll(/href=["']([^"']+)["']/gi);
          const navMatch = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/i);
          const footerMatch = html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);

          // Extract navigation links
          const navContent = navMatch?.[1] || "";
          const footerContent = footerMatch?.[1] || "";
          const navLinks = [...navContent.matchAll(/href=["']([^"']+)["']/gi), ...footerContent.matchAll(/href=["']([^"']+)["']/gi)];
          
          for (const match of linkMatches) {
            try {
              const linkUrl = new URL(match[1], currentUrl);
              // Only follow internal links
              if (linkUrl.hostname === hostname &&
                !linkUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|pdf|css|js|ico|woff|woff2|ttf|eot)$/i) &&
                !linkUrl.hash &&
                !junkPatterns.some(pattern => pattern.test(linkUrl.pathname))) {
                // Normalize URL by removing trailing slash (except for root)
                let cleanPath = linkUrl.pathname;
                if (cleanPath !== '/' && cleanPath.endsWith('/')) {
                  cleanPath = cleanPath.slice(0, -1);
                }
                const cleanUrl = `${linkUrl.protocol}//${linkUrl.hostname}${cleanPath}`;
                links.push(cleanUrl);

                // Track internal link count
                internalLinkCounts.set(cleanUrl, (internalLinkCounts.get(cleanUrl) || 0) + 1);

                if (!visited.has(cleanUrl) && !toVisit.find(t => t.url === cleanUrl) && visited.size + toVisit.length < maxPages) {
                  toVisit.push({ url: cleanUrl, depth: currentDepth + 1 });
                }
              }
            } catch {}
          }

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
            links: [...new Set(links)].slice(0, 50),
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
