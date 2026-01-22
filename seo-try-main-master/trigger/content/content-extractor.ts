import { task, metadata } from "@trigger.dev/sdk";

interface ExtractedPage {
  url: string;
  type: "service" | "blog" | "product" | "other";
  title?: string;
  content: string;
  wordCount: number;
  mainTopic?: string;
  summary?: string;
}

interface ContentExtractionPayload {
  baseUrl: string;
  pages: Array<{
    url: string;
    type: string;
  }>;
  maxPages?: number;
  extractContent?: boolean;
  analysisId?: string;
  userId?: string;
}

interface ContentExtractionOutput {
  baseUrl: string;
  pagesProcessed: number;
  extractedPages: ExtractedPage[];
  aggregatedContent: {
    services: string[];
    blogs: string[];
    products: string[];
  };
  totalWordCount: number;
}

export const contentExtractorTask = task({
  id: "content-extractor",
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 60000,
  },
  run: async (payload: ContentExtractionPayload): Promise<ContentExtractionOutput> => {
    const { baseUrl, pages, maxPages = 50, extractContent = true } = payload;

    // Lazy import cheerio to avoid Trigger.dev indexing issues
    await import("cheerio");

    try {
      metadata.set("status", {
        progress: 0,
        label: "Starting content extraction...",
        pagesProcessed: 0,
      } as any);

      const extractedPages: ExtractedPage[] = [];
      const aggregatedContent = {
        services: [] as string[],
        blogs: [] as string[],
        products: [] as string[],
      };
      let totalWordCount = 0;

      // Process pages
      const pagesToProcess = pages.slice(0, maxPages);
      
      for (let i = 0; i < pagesToProcess.length; i++) {
        const page = pagesToProcess[i];
        const progress = Math.round(((i + 1) / pagesToProcess.length) * 100);
        
        metadata.set("status", {
          progress,
          label: `Extracting content from ${i + 1}/${pagesToProcess.length}: ${page.url.slice(0, 50)}...`,
          pagesProcessed: i + 1,
        } as any);

        try {
          if (!extractContent) {
            // Just record the page without extracting content
            extractedPages.push({
              url: page.url,
              type: page.type as any,
              content: "",
              wordCount: 0,
            });
            continue;
          }

          const response = await fetch(page.url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
            signal: AbortSignal.timeout(30000),
            redirect: "follow",
          });

          const contentType = response.headers.get('content-type') || '';
          if (!contentType.includes('text/html')) {
            console.log(`Skipping non-HTML content: ${page.url}`);
            continue;
          }

          const html = await response.text();

          // Extract main content using cheerio (simpler than jsdom, no filesystem dependencies)
          const cheerio = await import("cheerio");
          const $ = cheerio.load(html);

          // Remove non-content elements
          $('script, style, nav, header, footer, aside, iframe, noscript').remove();

          // Try to find main content area
          let content = '';
          let title = $('title').text() || '';

          // Look for common content containers
          const contentSelectors = [
            'article',
            'main',
            '[role="main"]',
            '.content',
            '.post-content',
            '.entry-content',
            '.article-content',
            '#content',
            '#main-content',
          ];

          for (const selector of contentSelectors) {
            const element = $(selector);
            if (element.length > 0 && element.text().length > 200) {
              content = element.text();
              break;
            }
          }

          // Fallback to body if no content found
          if (!content || content.length < 200) {
            content = $('body').text();
          }

          // Clean up content
          content = content.replace(/\s+/g, ' ').trim();

          if (!content || content.length < 100) {
            console.log(`Could not extract sufficient content from: ${page.url}`);
            continue;
          }

          const wordCount = content.split(/\s+/).length;
          totalWordCount += wordCount;

          // Extract main topic from title or first heading
          const mainTopic = $('h1').first().text() || title;

          // Generate a brief summary (first 200 chars)
          const summary = content.substring(0, 200);

          const extractedPage: ExtractedPage = {
            url: page.url,
            type: page.type as any,
            title,
            content,
            wordCount,
            mainTopic: title,
            summary,
          };

          extractedPages.push(extractedPage);

          // Aggregate content by type
          if (page.type === 'service') {
            aggregatedContent.services.push(content);
          } else if (page.type === 'blog') {
            aggregatedContent.blogs.push(content);
          } else if (page.type === 'product') {
            aggregatedContent.products.push(content);
          }

        } catch (error) {
          console.error(`Error extracting content from ${page.url}:`, error);
        }

        // Small delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      metadata.set("status", {
        progress: 100,
        label: `Content extraction complete! Processed ${extractedPages.length} pages`,
        pagesProcessed: extractedPages.length,
      } as any);

      return {
        baseUrl,
        pagesProcessed: extractedPages.length,
        extractedPages,
        aggregatedContent,
        totalWordCount,
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Content extractor fatal error:", error);
      metadata.set("status", {
        progress: 0,
        label: `Fatal error: ${errorMsg}`,
        pagesProcessed: 0,
        error: errorMsg,
      } as any);
      throw error;
    }
  },
});
