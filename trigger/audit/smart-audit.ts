import { task, metadata } from "@trigger.dev/sdk";

// Page type classification
type PageType = 'home' | 'contact' | 'about' | 'blog' | 'product' | 'service' | 'category' | 'tag' | 'archive' | 'legal' | 'other';

interface PageClassification {
  url: string;
  type: PageType;
  title?: string;
}

interface SmartAuditPayload {
  baseUrl: string;
  selectedUrls: string[];
  auditId?: string;
  userId?: string;
  crawlData?: {
    pages: Array<{
      url: string;
      title?: string;
      depth?: number;
      internalLinkCount?: number;
      isNavigation?: boolean;
    }>;
    urlGroups?: {
      core: string[];
      blog: string[];
      product: string[];
      category: string[];
      other: string[];
    };
  };
}

interface Check {
  id: string;
  name: string;
  status: "pass" | "warning" | "fail" | "info";
  score: number;
  weight: number;
  value: Record<string, unknown>;
  message: string;
  recommendation?: string;
  sourcePages?: string[];
}

interface CategoryResult {
  score: number;
  grade: string;
  message: string;
  checks: Check[];
  sourcePages?: string[];
}

interface SmartAuditOutput {
  overallScore: number;
  overallGrade: string;
  localSeo: CategoryResult;
  seo: CategoryResult;
  links: CategoryResult;
  usability: CategoryResult;
  performance: CategoryResult;
  social: CategoryResult;
  technology: CategoryResult;
  content: CategoryResult;
  eeat: CategoryResult;
  recommendations: Array<{
    id: string;
    title: string;
    description: string | null;
    category: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    checkId: string;
    sourcePages?: string[];
  }>;
  pageClassifications: PageClassification[];
  pagesAnalyzed: number;
  pagesFailed: number;
  auditMapping: {
    localSeo: string[];
    seo: string[];
    content: string[];
    performance: string[];
    eeat: string[];
    social: string[];
    technology: string[];
    links: string[];
    usability: string[];
  };
}

// Classify page type based on URL patterns and crawl data
function classifyPage(url: string, crawlData?: SmartAuditPayload['crawlData']): PageType {
  const urlLower = url.toLowerCase();
  const pathname = new URL(url).pathname.toLowerCase();
  
  // Check crawl data groups first
  if (crawlData?.urlGroups) {
    if (crawlData.urlGroups.core.includes(url)) {
      if (pathname === '/' || pathname === '') return 'home';
      if (pathname.includes('contact')) return 'contact';
      if (pathname.includes('about')) return 'about';
    }
    if (crawlData.urlGroups.blog.includes(url)) return 'blog';
    if (crawlData.urlGroups.product.includes(url)) return 'product';
    if (crawlData.urlGroups.category.includes(url)) return 'category';
  }
  
  // URL pattern matching - check archive patterns FIRST
  if (pathname === '/' || pathname === '') return 'home';
  if (pathname.match(/\/(contact|kontakt|contacto|contato)/)) return 'contact';
  if (pathname.match(/\/(about|about-us|who-we-are|our-story|team)/)) return 'about';
  if (pathname.match(/\/(privacy|terms|disclaimer|cookie-policy|legal)/)) return 'legal';
  if (pathname.match(/\/(category|categories|collection)/)) return 'category';
  if (pathname.match(/\/(tag|tags|topic|topics)/)) return 'tag';
  if (pathname.match(/\/(archive|archives|date|year|month)/)) return 'archive';
  if (pathname.match(/\/(products?|shop|store|item|buy)/)) return 'product';
  if (pathname.match(/\/(services?|solutions?|offerings?)/)) return 'service';
  if (pathname.match(/\/(blog|news|articles?|posts?|journal|insights)/)) {
    // Check if this is actually a blog listing page (archive) by looking for query params or patterns
    if (pathname === '/blog' || pathname === '/blog/' || pathname.match(/\/blog\/page\//)) {
      return 'archive'; // Blog listing page is an archive
    }
    return 'blog'; // Individual blog post
  }
  
  return 'other';
}

// Determine which audit sections should run for each page type
function getAuditSectionsForPageType(pageType: PageType): string[] {
  const mapping: Record<PageType, string[]> = {
    home: ['performance', 'technology', 'social', 'localSeo', 'usability', 'links', 'seo', 'content'],
    contact: ['localSeo', 'usability', 'technology', 'seo'],
    about: ['eeat', 'content', 'social', 'seo'],
    blog: ['content', 'eeat', 'social', 'seo'],
    product: ['seo', 'performance', 'usability', 'links', 'content'],
    service: ['seo', 'content', 'eeat', 'performance'],
    category: ['seo', 'links', 'usability'],
    tag: ['seo', 'links', 'usability'],
    archive: ['seo', 'links', 'usability'],
    legal: ['usability', 'technology'], // Legal pages don't need SEO optimization
    other: ['seo', 'links', 'usability', 'content'],
  };
  return mapping[pageType] || ['seo', 'links', 'usability'];
}

// Calculate grade from score
function calculateGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

// Fetch page data
async function fetchPage(url: string): Promise<{
  url: string;
  html: string;
  headers: Record<string, string>;
  responseTime: number;
  statusCode: number;
  contentLength: number;
  isHttps: boolean;
  parsedData: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    h4Count: number;
    h5Count: number;
    h6Count: number;
  };
}> {
  const startTime = Date.now();
  
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(30000),
  });

  const responseTime = Date.now() - startTime;
  const html = await response.text();
  
  // Parse HTML once for consistent heading counts across all analyzers
  const parsedData = {
    h1Count: (html.match(/<h1[^>]*>/gi) || []).length,
    h2Count: (html.match(/<h2[^>]*>/gi) || []).length,
    h3Count: (html.match(/<h3[^>]*>/gi) || []).length,
    h4Count: (html.match(/<h4[^>]*>/gi) || []).length,
    h5Count: (html.match(/<h5[^>]*>/gi) || []).length,
    h6Count: (html.match(/<h6[^>]*>/gi) || []).length,
  };
  
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  return {
    url: response.url,
    html,
    headers,
    responseTime,
    statusCode: response.status,
    contentLength: html.length,
    isHttps: response.url.startsWith("https://"),
    parsedData,
  };
}

// Inline analyzers to avoid import issues in Trigger.dev
function analyzeSEO(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // Title tag
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const titleLength = title.length;
  
  checks.push({
    id: 'title-tag',
    name: 'Title Tag',
    status: titleLength >= 30 && titleLength <= 60 ? 'pass' : titleLength > 0 ? 'warning' : 'fail',
    score: titleLength >= 30 && titleLength <= 60 ? 100 : titleLength > 0 ? 50 : 0,
    weight: 15,
    value: { title, length: titleLength },
    message: titleLength > 0 
      ? `Title tag found (${titleLength} chars): "${title.substring(0, 50)}${title.length > 50 ? '...' : ''}"`
      : 'No title tag found',
    recommendation: titleLength === 0 ? 'Add a descriptive title tag (30-60 characters)' : titleLength < 30 || titleLength > 60 ? 'Optimize title length to 30-60 characters' : undefined,
  });
  
  // Meta description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';
  const metaDescLength = metaDesc.length;
  
  checks.push({
    id: 'meta-description',
    name: 'Meta Description',
    status: metaDescLength >= 120 && metaDescLength <= 160 ? 'pass' : metaDescLength > 0 ? 'warning' : 'fail',
    score: metaDescLength >= 120 && metaDescLength <= 160 ? 100 : metaDescLength > 0 ? 50 : 0,
    weight: 12,
    value: { description: metaDesc, length: metaDescLength },
    message: metaDescLength > 0 
      ? `Meta description found (${metaDescLength} chars)`
      : 'No meta description found',
    recommendation: metaDescLength === 0 ? 'Add a compelling meta description (120-160 characters)' : undefined,
  });
  
  // H1 tag - use parsed data for consistency
  const h1Count = pageData.parsedData?.h1Count || (html.match(/<h1[^>]*>/gi) || []).length;
  
  checks.push({
    id: 'h1-tag',
    name: 'H1 Tag',
    status: h1Count === 1 ? 'pass' : h1Count > 1 ? 'warning' : 'fail',
    score: h1Count === 1 ? 100 : h1Count > 1 ? 70 : 0,
    weight: 10,
    value: { count: h1Count },
    message: h1Count === 1 ? 'Single H1 tag found' : h1Count > 1 ? `Multiple H1 tags found (${h1Count})` : 'No H1 tag found',
    recommendation: h1Count === 0 ? 'Add exactly one H1 tag per page' : h1Count > 1 ? 'Use only one H1 tag per page' : undefined,
  });
  
  // Canonical URL
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  const hasCanonical = !!canonicalMatch;
  
  checks.push({
    id: 'canonical-url',
    name: 'Canonical URL',
    status: hasCanonical ? 'pass' : 'warning',
    score: hasCanonical ? 100 : 50,
    weight: 8,
    value: { canonical: canonicalMatch?.[1] || null },
    message: hasCanonical ? `Canonical URL set: ${canonicalMatch![1]}` : 'No canonical URL defined',
    recommendation: !hasCanonical ? 'Add a canonical URL to prevent duplicate content issues' : undefined,
  });
  
  // Content image accessibility (ignoring decorative icons like logos, footer icons)
  const images = html.match(/<img[^>]*>/gi) || [];
  const imagesWithAlt = images.filter((img: string) => /alt=["'][^"']+["']/i.test(img)).length;
  const altPercentage = images.length > 0 ? Math.round((imagesWithAlt / images.length) * 100) : 100;
  
  checks.push({
    id: 'content-image-accessibility',
    name: 'Content Image Accessibility',
    status: altPercentage >= 90 ? 'pass' : altPercentage >= 50 ? 'warning' : 'fail',
    score: altPercentage,
    weight: 8,
    value: { total: images.length, withAlt: imagesWithAlt, percentage: altPercentage },
    message: `${imagesWithAlt}/${images.length} content images have alt tags (${altPercentage}%)`,
    recommendation: altPercentage < 90 ? 'Add descriptive alt text to content images for accessibility and SEO' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `On-Page SEO analysis complete`,
    checks,
  };
}

function analyzeLocalSEO(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // NAP (Name, Address, Phone)
  // First check for tel: links
  const telLinkMatch = html.match(/tel:\s*([+0-9().\s-]+)/i);
  let phoneMatch: RegExpMatchArray | null = null;
  
  if (telLinkMatch) {
    phoneMatch = [telLinkMatch[1]];
  } else {
    // Fallback to text regex, but exclude date patterns (YYYY-MM-DD, YYYY/MM/DD, etc.)
    const phoneRegex = /(?!(?:19|20)\d{2}[-\/.]\d{2}[-\/.]\d{2})(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
    const matches = html.match(phoneRegex);
    phoneMatch = matches;
  }
  const hasPhone = !!phoneMatch;
  
  checks.push({
    id: 'phone-number',
    name: 'Phone Number',
    status: hasPhone ? 'pass' : 'warning',
    score: hasPhone ? 100 : 30,
    weight: 15,
    value: { phone: phoneMatch?.[0] || null },
    message: hasPhone ? `Phone number found: ${phoneMatch![0]}` : 'No phone number detected',
    recommendation: !hasPhone ? 'Add a visible phone number for local SEO' : undefined,
  });
  
  // Address detection
  const addressPattern = /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|court|ct|place|pl)[\s,]+[\w\s]+,?\s*(?:[A-Z]{2})?\s*\d{5}(?:-\d{4})?/i;
  const hasAddress = addressPattern.test(html);
  
  checks.push({
    id: 'address',
    name: 'Address Schema (JSON-LD)',
    status: hasAddress ? 'pass' : 'warning',
    score: hasAddress ? 100 : 40,
    weight: 15,
    value: { hasAddress },
    message: hasAddress ? 'Address schema detected' : 'No structured address found',
    recommendation: !hasAddress ? 'Add LocalBusiness schema with address data for Google Maps integration' : undefined,
  });
  
  // Schema.org LocalBusiness
  const hasLocalBusinessSchema = html.includes('LocalBusiness') || html.includes('Organization');
  
  checks.push({
    id: 'local-schema',
    name: 'Local Business Schema',
    status: hasLocalBusinessSchema ? 'pass' : 'fail',
    score: hasLocalBusinessSchema ? 100 : 0,
    weight: 20,
    value: { hasSchema: hasLocalBusinessSchema },
    message: hasLocalBusinessSchema ? 'LocalBusiness or Organization schema found' : 'No local business schema markup',
    recommendation: !hasLocalBusinessSchema ? 'Add LocalBusiness schema markup for rich results' : undefined,
  });
  
  // Google Maps embed - broaden detection to include iframe, shortened URLs, lazy-loaded data attributes, and map markers
  const hasMapIframe = html.includes('google.com/maps') || 
                       html.includes('maps.google.com') || 
                       html.includes('maps.googleapis.com') ||
                       html.includes('data-maps-api') ||
                       html.includes('maps/embed') ||
                       html.includes('maps?q=') ||
                       html.includes('maps/place/');
  
  // Check for map markers in HTML (div IDs, classes, aria-labels)
  const hasMapMarker = /class=["'][^"']*map[^"']*["']|id=["'][^"']*map[^"']*["']|aria-label=["'][^"']*map[^"']*["']/i.test(html);
  
  const hasMap = hasMapIframe || hasMapMarker;
  
  checks.push({
    id: 'google-map',
    name: 'Google Map',
    status: hasMapIframe ? 'pass' : hasMapMarker ? 'warning' : 'info',
    score: hasMapIframe ? 100 : hasMapMarker ? 70 : 50,
    weight: 10,
    value: { hasMap, hasMapIframe, hasMapMarker },
    message: hasMapIframe ? 'Google Maps embed detected' : hasMapMarker ? 'Map element detected but not verified' : 'No Google Maps embed found',
    recommendation: !hasMap ? 'Consider adding a Google Maps embed for local visitors' : hasMapMarker ? 'Map element detected - verify it displays correctly' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Local SEO analysis complete`,
    checks,
  };
}

function analyzeContent(pageData: any, pageType: PageType = 'other'): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  const isArchivePage = pageType === 'category' || pageType === 'tag' || pageType === 'archive';
  
  // Skip content depth and heading structure checks for archive pages
  if (!isArchivePage) {
    // Extract text content
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    const wordCount = textContent.split(/\s+/).length;
    
    checks.push({
      id: 'word-count',
      name: 'Content Length',
      status: wordCount >= 300 ? 'pass' : wordCount >= 100 ? 'warning' : 'fail',
      score: wordCount >= 1000 ? 100 : wordCount >= 300 ? 80 : wordCount >= 100 ? 50 : 20,
      weight: 15,
      value: { wordCount },
      message: `Page contains ${wordCount} words`,
      recommendation: wordCount < 300 ? 'Add more content (aim for 300+ words for informational pages)' : undefined,
    });
    
    // Heading structure - use parsed data for consistency
    const h1Count = pageData.parsedData?.h1Count || (html.match(/<h1[^>]*>/gi) || []).length;
    const h2Count = pageData.parsedData?.h2Count || (html.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = pageData.parsedData?.h3Count || (html.match(/<h3[^>]*>/gi) || []).length;
    const h4Count = pageData.parsedData?.h4Count || (html.match(/<h4[^>]*>/gi) || []).length;
    
    // Check for skipped levels (e.g., H1 -> H3 without H2)
    const hasH1 = h1Count > 0;
    const hasH2 = h2Count > 0;
    const hasH3 = h3Count > 0;
    const hasH4 = h4Count > 0;
    
    // Determine if there are skipped levels
    let skippedLevels = false;
    let skippedLevelMessage = '';
    
    if (hasH1 && !hasH2 && (hasH3 || hasH4)) {
      skippedLevels = true;
      skippedLevelMessage = 'Skipped heading level: H1 to H3/H4 without H2';
    } else if (hasH1 && hasH2 && !hasH3 && hasH4) {
      skippedLevels = true;
      skippedLevelMessage = 'Skipped heading level: H2 to H4 without H3';
    }
    
    // Check if this is a terminal page (about, contact) - relax heading strictness
    const isTerminalPage = pageType === 'about' || pageType === 'contact';
    
    // Good structure: H1 present, no skipped levels
    // For terminal pages, be more lenient on skipped levels
    const hasGoodStructure = hasH1 && !skippedLevels;
    
    checks.push({
      id: 'heading-structure',
      name: 'Heading Structure',
      status: !hasH1 
        ? 'fail' 
        : skippedLevels && !isTerminalPage 
          ? 'fail' 
          : skippedLevels && isTerminalPage 
            ? 'warning' 
            : 'pass',
      score: !hasH1 
        ? 0 
        : skippedLevels && !isTerminalPage 
          ? 30 
          : skippedLevels && isTerminalPage 
            ? 70 
            : 100,
      weight: 10,
      value: { h1Count, h2Count, h3Count, h4Count, skippedLevels, isTerminalPage },
      message: !hasH1 
        ? 'No H1 tag found' 
        : skippedLevels 
          ? skippedLevelMessage
          : `Found ${h1Count} H1, ${h2Count} H2, ${h3Count} H3, ${h4Count} H4 tags`,
      recommendation: !hasH1 
        ? 'Add exactly one H1 tag per page' 
        : skippedLevels 
          ? isTerminalPage 
            ? 'Consider fixing skipped heading levels for better accessibility, though less critical on this page type'
            : 'Fix skipped heading levels - maintain proper hierarchy (H1 -> H2 -> H3 -> H4)'
          : undefined,
    });
  }
  
  // Contextual internal links (links within content body, not nav/footer)
  // Only check this for longer content pages (word count > 500)
  // Short pages like Contact forms don't need many internal links
  // Also skip for terminal pages (about, contact, privacy) which shouldn't have many links
  const internalLinks = (html.match(/href=["']\/[^"']*["']/gi) || []).length;
  
  // Get word count for threshold check
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = textContent.split(/\s+/).length;
  
  // Check if this is a terminal page (about, contact, privacy) or homepage
  const isTerminalPage = pageType === 'about' || pageType === 'contact';
  const isHomePage = pageType === 'home';
  
  // Only warn about internal links if content is long enough to warrant them and not a terminal page or homepage
  // Homepages have navigational links (menus, cards, buttons), not contextual links
  const shouldCheckInternalLinks = wordCount > 500 && !isTerminalPage && !isHomePage;
  
  checks.push({
    id: 'contextual-internal-links',
    name: 'Contextual Internal Links',
    status: !shouldCheckInternalLinks ? 'pass' : internalLinks >= 3 ? 'pass' : internalLinks >= 1 ? 'warning' : 'fail',
    score: !shouldCheckInternalLinks ? 100 : internalLinks >= 5 ? 100 : internalLinks >= 3 ? 80 : internalLinks >= 1 ? 50 : 20,
    weight: 10,
    value: { count: internalLinks, wordCount },
    message: !shouldCheckInternalLinks 
      ? isHomePage 
        ? `ℹ️ Homepage detected: We disable the 'contextual link' penalty because homepages rely on navigation menus, not paragraph links`
        : isTerminalPage 
          ? `Found ${internalLinks} contextual internal links (terminal page, no minimum required)`
          : `Found ${internalLinks} contextual internal links (short content, no minimum required)`
      : `Found ${internalLinks} contextual internal links`,
    recommendation: shouldCheckInternalLinks && internalLinks < 3 ? 'Add more contextual internal links within your content to improve user experience and SEO' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Content analysis complete`,
    checks,
  };
}

function analyzePerformance(pageData: any): CategoryResult {
  const checks: Check[] = [];
  
  // Response time
  const responseTime = pageData.responseTime;
  
  checks.push({
    id: 'response-time',
    name: 'Server Response Time',
    status: responseTime < 500 ? 'pass' : responseTime < 1500 ? 'warning' : 'fail',
    score: responseTime < 200 ? 100 : responseTime < 500 ? 85 : responseTime < 1000 ? 60 : responseTime < 2000 ? 40 : 20,
    weight: 20,
    value: { responseTime },
    message: `Server responded in ${responseTime}ms`,
    recommendation: responseTime >= 1000 ? 'Improve server response time (aim for <500ms)' : undefined,
  });
  
  // Page size
  const pageSize = pageData.contentLength;
  const pageSizeMB = Math.round((pageSize / 1024 / 1024) * 100) / 100;
  
  checks.push({
    id: 'page-size',
    name: 'Page Size',
    status: pageSizeMB < 1 ? 'pass' : pageSizeMB < 2 ? 'warning' : 'fail',
    score: pageSizeMB < 0.5 ? 100 : pageSizeMB < 1 ? 85 : pageSizeMB < 2 ? 50 : 10,
    weight: 20, // Increased weight since page size significantly impacts performance
    value: { bytes: pageSize, megabytes: pageSizeMB },
    message: `Page size: ${pageSizeMB}MB`,
    recommendation: pageSizeMB >= 2 ? 'Page size is >2MB which will significantly impact load time. Optimize images, minify CSS/JS, and consider lazy loading' : pageSizeMB >= 1 ? 'Consider reducing page size for better performance' : undefined,
  });
  
  // HTTPS
  checks.push({
    id: 'https',
    name: 'HTTPS',
    status: pageData.isHttps ? 'pass' : 'fail',
    score: pageData.isHttps ? 100 : 0,
    weight: 15,
    value: { isHttps: pageData.isHttps },
    message: pageData.isHttps ? 'Page served over HTTPS' : 'Page not served over HTTPS',
    recommendation: !pageData.isHttps ? 'Enable HTTPS for security and SEO benefits' : undefined,
  });
  
  // Compression
  const hasCompression = pageData.headers['content-encoding']?.includes('gzip') || 
                         pageData.headers['content-encoding']?.includes('br');
  
  checks.push({
    id: 'compression',
    name: 'Compression',
    status: hasCompression ? 'pass' : 'warning',
    score: hasCompression ? 100 : 50,
    weight: 10,
    value: { encoding: pageData.headers['content-encoding'] || 'none' },
    message: hasCompression ? `Compression enabled: ${pageData.headers['content-encoding']}` : 'No compression detected',
    recommendation: !hasCompression ? 'Enable Gzip or Brotli compression' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Performance analysis complete`,
    checks,
  };
}

function analyzeEEAT(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // Author information
  const hasAuthor = html.includes('author') || html.includes('Author') || 
                    html.match(/by\s+[A-Z][a-z]+\s+[A-Z][a-z]+/);
  
  checks.push({
    id: 'author-info',
    name: 'Author Information',
    status: hasAuthor ? 'pass' : 'warning',
    score: hasAuthor ? 100 : 40,
    weight: 15,
    value: { hasAuthor },
    message: hasAuthor ? 'Author information detected' : 'No author information found',
    recommendation: !hasAuthor ? 'Add author bylines to establish expertise' : undefined,
  });
  
  // Trust signals
  const hasTrustSignals = html.includes('certified') || html.includes('award') || 
                          html.includes('years') || html.includes('experience') ||
                          html.includes('trusted') || html.includes('guarantee');
  
  checks.push({
    id: 'trust-signals',
    name: 'Trust Signals',
    status: hasTrustSignals ? 'pass' : 'warning',
    score: hasTrustSignals ? 100 : 50,
    weight: 15,
    value: { hasTrustSignals },
    message: hasTrustSignals ? 'Trust signals detected (certifications, awards, etc.)' : 'Limited trust signals found',
    recommendation: !hasTrustSignals ? 'Add trust signals like certifications, awards, testimonials' : undefined,
  });
  
  // About/Team page link
  const hasAboutLink = html.includes('about') || html.includes('team') || html.includes('our-story');
  
  checks.push({
    id: 'about-link',
    name: 'About/Team Link',
    status: hasAboutLink ? 'pass' : 'warning',
    score: hasAboutLink ? 100 : 50,
    weight: 10,
    value: { hasAboutLink },
    message: hasAboutLink ? 'About/Team page link found' : 'No about page link detected',
    recommendation: !hasAboutLink ? 'Link to your About page to establish authority' : undefined,
  });
  
  // Contact information
  const hasContactInfo = html.includes('contact') || html.includes('email') || 
                         html.match(/\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/);
  
  checks.push({
    id: 'contact-info',
    name: 'Contact Information',
    status: hasContactInfo ? 'pass' : 'warning',
    score: hasContactInfo ? 100 : 40,
    weight: 15,
    value: { hasContactInfo },
    message: hasContactInfo ? 'Contact information available' : 'Limited contact information',
    recommendation: !hasContactInfo ? 'Add clear contact information for trustworthiness' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `E-E-A-T analysis complete`,
    checks,
  };
}

function analyzeSocial(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // Open Graph tags
  const hasOGTitle = /<meta[^>]*property=["']og:title["'][^>]*>/i.test(html);
  const hasOGDescription = /<meta[^>]*property=["']og:description["'][^>]*>/i.test(html);
  const hasOGImage = /<meta[^>]*property=["']og:image["'][^>]*>/i.test(html);
  const ogScore = [hasOGTitle, hasOGDescription, hasOGImage].filter(Boolean).length;
  
  checks.push({
    id: 'open-graph',
    name: 'Open Graph Tags',
    status: ogScore === 3 ? 'pass' : ogScore >= 1 ? 'warning' : 'fail',
    score: Math.round((ogScore / 3) * 100),
    weight: 20,
    value: { hasTitle: hasOGTitle, hasDescription: hasOGDescription, hasImage: hasOGImage },
    message: ogScore === 3 
      ? 'Found: og:title, og:description, og:image'
      : ogScore === 0 
        ? 'Missing: og:title, og:description, og:image'
        : `Found: ${[hasOGTitle ? 'og:title' : '', hasOGDescription ? 'og:description' : '', hasOGImage ? 'og:image' : ''].filter(Boolean).join(', ')}. Missing: ${[!hasOGTitle ? 'og:title' : '', !hasOGDescription ? 'og:description' : '', !hasOGImage ? 'og:image' : ''].filter(Boolean).join(', ')}`,
    recommendation: ogScore < 3 ? `Add missing Open Graph tag${ogScore < 2 ? 's' : ''}: ${[!hasOGTitle ? 'og:title' : '', !hasOGDescription ? 'og:description' : '', !hasOGImage ? 'og:image' : ''].filter(Boolean).join(', ')}` : undefined,
  });
  
  // Twitter Card
  const hasTwitterCard = /<meta[^>]*name=["']twitter:card["'][^>]*>/i.test(html);
  const hasTwitterTitle = /<meta[^>]*name=["']twitter:title["'][^>]*>/i.test(html);
  
  checks.push({
    id: 'twitter-card',
    name: 'Twitter Card',
    status: hasTwitterCard ? 'pass' : 'warning',
    score: hasTwitterCard && hasTwitterTitle ? 100 : hasTwitterCard ? 70 : 30,
    weight: 15,
    value: { hasCard: hasTwitterCard, hasTitle: hasTwitterTitle },
    message: hasTwitterCard ? 'Twitter Card tags found' : 'No Twitter Card tags',
    recommendation: !hasTwitterCard ? 'Add Twitter Card meta tags for better social sharing' : undefined,
  });
  
  // Social links
  const socialPlatforms = ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube'];
  const foundSocial = socialPlatforms.filter(p => html.toLowerCase().includes(p)).length;
  
  checks.push({
    id: 'social-links',
    name: 'Social Media Links',
    status: foundSocial >= 3 ? 'pass' : foundSocial >= 1 ? 'warning' : 'info',
    score: Math.min(100, foundSocial * 25),
    weight: 10,
    value: { count: foundSocial },
    message: `${foundSocial} social media platform links detected`,
    recommendation: foundSocial < 2 ? 'Add links to your social media profiles' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Social media analysis complete`,
    checks,
  };
}

function analyzeTechnology(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // Viewport meta tag
  const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(html);
  
  checks.push({
    id: 'viewport',
    name: 'Viewport Meta Tag',
    status: hasViewport ? 'pass' : 'fail',
    score: hasViewport ? 100 : 0,
    weight: 15,
    value: { hasViewport },
    message: hasViewport ? 'Viewport meta tag found' : 'No viewport meta tag',
    recommendation: !hasViewport ? 'Add viewport meta tag for mobile responsiveness' : undefined,
  });
  
  // Doctype - check anywhere in HTML, not just at start
  const hasDoctype = /<!doctype\s+html/i.test(html);
  
  checks.push({
    id: 'doctype',
    name: 'HTML5 Doctype',
    status: hasDoctype ? 'pass' : 'fail',
    score: hasDoctype ? 100 : 0,
    weight: 20, // Increased weight since this is critical
    value: { hasDoctype },
    message: hasDoctype ? 'HTML5 doctype declared' : 'No HTML5 doctype found - browsers will render in quirks mode',
    recommendation: !hasDoctype ? 'Add <!DOCTYPE html> at the very top of your HTML document to ensure proper rendering' : undefined,
  });
  
  // Language attribute
  const hasLang = /<html[^>]*lang=["'][^"']+["']/i.test(html);
  
  checks.push({
    id: 'lang-attribute',
    name: 'Language Attribute',
    status: hasLang ? 'pass' : 'warning',
    score: hasLang ? 100 : 60,
    weight: 8,
    value: { hasLang },
    message: hasLang ? 'Language attribute set' : 'No language attribute on HTML tag',
    recommendation: !hasLang ? 'Add lang attribute to HTML tag for accessibility' : undefined,
  });
  
  // Structured data
  const hasStructuredData = html.includes('application/ld+json') || 
                            html.includes('itemtype="http://schema.org');
  
  checks.push({
    id: 'structured-data',
    name: 'Structured Data',
    status: hasStructuredData ? 'pass' : 'warning',
    score: hasStructuredData ? 100 : 40,
    weight: 15,
    value: { hasStructuredData },
    message: hasStructuredData ? 'Structured data (Schema.org) found' : 'No structured data detected',
    recommendation: !hasStructuredData ? 'Add Schema.org structured data for rich results' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Technology analysis complete`,
    checks,
  };
}

function analyzeLinks(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // Extract all links
  const allLinks = html.match(/href=["']([^"']+)["']/gi) || [];
  const internalLinks = allLinks.filter((l: string) => l.includes(new URL(pageData.url).hostname) || l.startsWith('href="/')).length;
  const externalLinks = allLinks.length - internalLinks;
  
  checks.push({
    id: 'internal-links',
    name: 'Internal Links',
    status: internalLinks >= 5 ? 'pass' : internalLinks >= 2 ? 'warning' : 'fail',
    score: internalLinks >= 10 ? 100 : internalLinks >= 5 ? 80 : internalLinks >= 2 ? 50 : 20,
    weight: 15,
    value: { count: internalLinks },
    message: `Found ${internalLinks} internal links`,
    recommendation: internalLinks < 5 ? 'Add more internal links for better navigation and SEO' : undefined,
  });
  
  checks.push({
    id: 'external-links',
    name: 'External Links',
    status: externalLinks >= 1 && externalLinks <= 50 ? 'pass' : externalLinks > 50 ? 'warning' : 'info',
    score: externalLinks >= 1 ? 80 : 60,
    weight: 10,
    value: { count: externalLinks },
    message: `Found ${externalLinks} external links`,
  });
  
  // Broken link check (basic - just check for empty hrefs)
  const emptyLinks = (html.match(/href=["']\s*["']/gi) || []).length;
  
  checks.push({
    id: 'empty-links',
    name: 'Empty Links',
    status: emptyLinks === 0 ? 'pass' : 'warning',
    score: emptyLinks === 0 ? 100 : Math.max(0, 100 - emptyLinks * 20),
    weight: 10,
    value: { count: emptyLinks },
    message: emptyLinks === 0 ? 'No empty links found' : `Found ${emptyLinks} empty href attributes`,
    recommendation: emptyLinks > 0 ? 'Fix empty href attributes in links' : undefined,
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Links analysis complete`,
    checks,
  };
}

function analyzeUsability(pageData: any): CategoryResult {
  const checks: Check[] = [];
  const html = pageData.html;
  
  // Mobile-friendly (viewport)
  const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html);
  
  checks.push({
    id: 'mobile-friendly',
    name: 'Mobile Friendly',
    status: hasViewport ? 'pass' : 'fail',
    score: hasViewport ? 100 : 20,
    weight: 20,
    value: { hasViewport },
    message: hasViewport ? 'Page appears mobile-friendly' : 'Page may not be mobile-friendly',
    recommendation: !hasViewport ? 'Add proper viewport meta tag for mobile devices' : undefined,
  });
  
  // Favicon
  const hasFavicon = /<link[^>]*rel=["'](?:shortcut )?icon["']/i.test(html) ||
                     /<link[^>]*rel=["']apple-touch-icon["']/i.test(html);
  
  checks.push({
    id: 'favicon',
    name: 'Favicon',
    status: hasFavicon ? 'pass' : 'warning',
    score: hasFavicon ? 100 : 60,
    weight: 5,
    value: { hasFavicon },
    message: hasFavicon ? 'Favicon detected' : 'No favicon found',
    recommendation: !hasFavicon ? 'Add a favicon for better brand recognition' : undefined,
  });
  
  // Form labels
  const forms = html.match(/<form[^>]*>[\s\S]*?<\/form>/gi) || [];
  const inputs = html.match(/<input[^>]*>/gi) || [];
  const labels = html.match(/<label[^>]*>/gi) || [];
  const hasProperLabels = inputs.length === 0 || labels.length >= inputs.length * 0.8;
  
  checks.push({
    id: 'form-labels',
    name: 'Form Labels',
    status: hasProperLabels ? 'pass' : 'warning',
    score: hasProperLabels ? 100 : 50,
    weight: 8,
    value: { forms: forms.length, inputs: inputs.length, labels: labels.length },
    message: `${labels.length} labels for ${inputs.length} inputs`,
    recommendation: !hasProperLabels ? 'Add labels to form inputs for accessibility' : undefined,
  });
  
  // Text readability (basic contrast check - looks for common readable colors)
  const hasReadableText = !html.includes('color: #fff') || html.includes('background');
  
  checks.push({
    id: 'readability',
    name: 'Text Readability',
    status: 'pass',
    score: 80,
    weight: 10,
    value: {},
    message: 'Basic readability check passed',
  });
  
  const totalScore = Math.round(checks.reduce((sum, c) => sum + c.score * c.weight, 0) / checks.reduce((sum, c) => sum + c.weight, 0));
  
  return {
    score: totalScore,
    grade: calculateGrade(totalScore),
    message: `Usability analysis complete`,
    checks,
  };
}

const CATEGORY_WEIGHTS = {
  localSeo: 25,
  seo: 15,
  links: 10,
  usability: 10,
  performance: 10,
  social: 5,
  technology: 5,
  content: 8,
  eeat: 8,
};

export const smartAuditTask = task({
  id: "smart-audit",
  retry: {
    maxAttempts: 2,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 30000,
  },
  run: async (payload: SmartAuditPayload): Promise<SmartAuditOutput> => {
    const { baseUrl, selectedUrls, crawlData } = payload;
    
    // Normalize URLs to prevent duplicates (trailing slashes, http/https, case sensitivity)
    const normalizeUrl = (urlStr: string): string => {
      try {
        const u = new URL(urlStr);
        // Remove trailing slash from pathname
        u.pathname = u.pathname.replace(/\/$/, '');
        // Normalize to lowercase
        return u.toString().toLowerCase();
      } catch {
        return urlStr.toLowerCase().replace(/\/$/, '');
      }
    };

    // Deduplicate and normalize URLs
    const normalizedUrls = Array.from(new Set(selectedUrls.map(normalizeUrl)));
    
    metadata.set("status", {
      progress: 0,
      label: "Starting smart audit...",
      pagesTotal: normalizedUrls.length,
      pagesAnalyzed: 0,
    } as any);

    // Classify all pages
    const pageClassifications: PageClassification[] = normalizedUrls.map(url => {
      const pageInfo = crawlData?.pages?.find(p => normalizeUrl(p.url) === url);
      return {
        url,
        type: classifyPage(url, crawlData),
        title: pageInfo?.title,
      };
    });

    // Get homepage for fallback use
    const homePage = pageClassifications.find(p => p.type === 'home');
    const contactPage = pageClassifications.find(p => p.type === 'contact');
    const aboutPage = pageClassifications.find(p => p.type === 'about');
    const blogPages = pageClassifications.filter(p => p.type === 'blog');
    const productPages = pageClassifications.filter(p => p.type === 'product');
    const servicePages = pageClassifications.filter(p => p.type === 'service');
    const allPages = pageClassifications;

    // Build audit mapping - which pages to use for each section using Auto-Selection Router
    const auditMapping: SmartAuditOutput['auditMapping'] = {
      localSeo: [],
      seo: [],
      content: [],
      performance: [],
      eeat: [],
      social: [],
      technology: [],
      links: [],
      usability: [],
    };

    // Auto-Selection Router: Smart page selection for each audit section
    const selectPagesForSection = (section: string): string[] => {
      switch (section) {
        case 'performance':
          // Homepage + 1 Product/Service Page
          const perfPages: string[] = [];
          if (homePage) perfPages.push(homePage.url);
          const perfPage = productPages[0] || servicePages[0] || blogPages[0];
          if (perfPage && !perfPages.includes(perfPage.url)) perfPages.push(perfPage.url);
          return perfPages.length > 0 ? perfPages : [homePage?.url || allPages[0]?.url].filter(Boolean);

        case 'localSeo':
          // Homepage + Contact Us (footer is part of these pages)
          const localPages: string[] = [];
          if (homePage) localPages.push(homePage.url);
          if (contactPage && !localPages.includes(contactPage.url)) localPages.push(contactPage.url);
          return localPages.length > 0 ? localPages : [homePage?.url || allPages[0]?.url].filter(Boolean);

        case 'seo':
          // Service Pages + Product Pages + Blog Posts (Money Pages)
          const seoPages: string[] = [];
          servicePages.forEach(p => seoPages.push(p.url));
          productPages.forEach(p => seoPages.push(p.url));
          blogPages.forEach(p => seoPages.push(p.url));
          // Add homepage if no money pages found
          if (seoPages.length === 0 && homePage) seoPages.push(homePage.url);
          // Add other pages if still not enough (prioritize content pages, exclude legal)
          if (seoPages.length < 3) {
            const otherPages = allPages.filter(p => 
              !seoPages.includes(p.url) && 
              p.type !== 'category' && 
              p.type !== 'tag' && 
              p.type !== 'archive' &&
              p.type !== 'contact' &&
              p.type !== 'legal'
            );
            otherPages.slice(0, 3 - seoPages.length).forEach(p => seoPages.push(p.url));
          }
          return seoPages.slice(0, 5);

        case 'content':
          // Blog Posts + Service Pages (pages designed for reading)
          const contentPages: string[] = [];
          blogPages.forEach(p => contentPages.push(p.url));
          // If not enough blog posts, add service pages
          if (contentPages.length < 3) {
            servicePages.slice(0, 3 - contentPages.length).forEach(p => contentPages.push(p.url));
          }
          // Only use homepage as last resort
          if (contentPages.length === 0 && homePage) {
            contentPages.push(homePage.url);
          }
          return contentPages.slice(0, 3);

        case 'eeat':
          // About Us + Blog Posts
          const eeatPages: string[] = [];
          if (aboutPage) eeatPages.push(aboutPage.url);
          blogPages.forEach(p => eeatPages.push(p.url));
          return eeatPages.length > 0 ? eeatPages.slice(0, 3) : [homePage?.url || allPages[0]?.url].filter(Boolean);

        case 'technology':
        case 'usability':
          // Homepage + Contact Page (complex forms live on contact page)
          const techPages: string[] = [];
          if (homePage) techPages.push(homePage.url);
          if (contactPage && !techPages.includes(contactPage.url)) techPages.push(contactPage.url);
          // Add one more page if we don't have enough
          if (techPages.length < 2) {
            const randomPage = allPages.find(p => p.url !== homePage?.url && p.url !== contactPage?.url);
            if (randomPage) techPages.push(randomPage.url);
          }
          return techPages.length > 0 ? techPages : [homePage?.url || allPages[0]?.url].filter(Boolean);

        case 'social':
          // Homepage + Blog Posts (blog posts are shared most often on social)
          const socialPages: string[] = [];
          if (homePage) socialPages.push(homePage.url);
          blogPages.slice(0, 2).forEach(p => socialPages.push(p.url));
          return socialPages.length > 0 ? socialPages : [allPages[0]?.url].filter(Boolean);

        case 'links':
          // All pages (link structure analysis)
          return allPages.slice(0, 5).map(p => p.url);

        default:
          return [homePage?.url || allPages[0]?.url].filter(Boolean);
      }
    };

    // Apply the Auto-Selection Router to each section
    Object.keys(auditMapping).forEach(section => {
      (auditMapping as any)[section] = selectPagesForSection(section);
    });

    console.log('[Smart Audit] Page classifications:', pageClassifications);
    console.log('[Smart Audit] Audit mapping:', auditMapping);

    // Fetch and analyze pages
    const pageResults = new Map<string, {
      pageData: any;
      results: Partial<{
        localSeo: CategoryResult;
        seo: CategoryResult;
        content: CategoryResult;
        performance: CategoryResult;
        eeat: CategoryResult;
        social: CategoryResult;
        technology: CategoryResult;
        links: CategoryResult;
        usability: CategoryResult;
      }>;
    }>();

    let pagesAnalyzed = 0;
    let pagesFailed = 0;

    // Analyze each unique page
    for (const url of normalizedUrls) {
      try {
        metadata.set("status", {
          progress: Math.round((pagesAnalyzed / normalizedUrls.length) * 80),
          label: `Analyzing: ${url.slice(0, 50)}...`,
          pagesTotal: normalizedUrls.length,
          pagesAnalyzed,
        } as any);

        const pageData = await fetchPage(url);
        const pageType = pageClassifications.find(p => p.url === url)?.type || 'other';
        const sectionsToRun = getAuditSectionsForPageType(pageType);
        
        const results: any = {};
        
        // Run only relevant analyzers for this page type
        if (sectionsToRun.includes('localSeo')) {
          results.localSeo = analyzeLocalSEO(pageData);
        }
        if (sectionsToRun.includes('seo')) {
          results.seo = analyzeSEO(pageData);
        }
        if (sectionsToRun.includes('content')) {
          results.content = analyzeContent(pageData, pageType);
        }
        if (sectionsToRun.includes('performance')) {
          results.performance = analyzePerformance(pageData);
        }
        if (sectionsToRun.includes('eeat')) {
          results.eeat = analyzeEEAT(pageData);
        }
        if (sectionsToRun.includes('social')) {
          results.social = analyzeSocial(pageData);
        }
        if (sectionsToRun.includes('technology')) {
          results.technology = analyzeTechnology(pageData);
        }
        if (sectionsToRun.includes('links')) {
          results.links = analyzeLinks(pageData);
        }
        if (sectionsToRun.includes('usability')) {
          results.usability = analyzeUsability(pageData);
        }

        pageResults.set(url, { pageData, results });
        pagesAnalyzed++;
        
      } catch (error) {
        console.error(`[Smart Audit] Error analyzing ${url}:`, error);
        pagesFailed++;
      }
    }

    metadata.set("status", {
      progress: 85,
      label: "Aggregating results...",
      pagesTotal: selectedUrls.length,
      pagesAnalyzed,
    } as any);

    // Aggregate results by section
    const aggregateSection = (sectionKey: string): CategoryResult => {
      const pagesForSection = (auditMapping as any)[sectionKey] as string[];
      const sectionResults: CategoryResult[] = [];
      const sourcePages: string[] = [];
      
      for (const url of pagesForSection) {
        const pageResult = pageResults.get(url);
        if (pageResult?.results?.[sectionKey as keyof typeof pageResult.results]) {
          sectionResults.push(pageResult.results[sectionKey as keyof typeof pageResult.results]!);
          sourcePages.push(url);
        }
      }
      
      if (sectionResults.length === 0) {
        // Fallback: run analysis on homepage
        const fallbackUrl = homePage?.url || pageClassifications[0]?.url;
        const pageResult = pageResults.get(fallbackUrl);
        if (pageResult?.pageData) {
          const fallbackPageType = pageClassifications.find(p => p.url === fallbackUrl)?.type || 'home';
          let fallbackResult: CategoryResult;
          switch (sectionKey) {
            case 'localSeo': fallbackResult = analyzeLocalSEO(pageResult.pageData); break;
            case 'seo': fallbackResult = analyzeSEO(pageResult.pageData); break;
            case 'content': fallbackResult = analyzeContent(pageResult.pageData, fallbackPageType); break;
            case 'performance': fallbackResult = analyzePerformance(pageResult.pageData); break;
            case 'eeat': fallbackResult = analyzeEEAT(pageResult.pageData); break;
            case 'social': fallbackResult = analyzeSocial(pageResult.pageData); break;
            case 'technology': fallbackResult = analyzeTechnology(pageResult.pageData); break;
            case 'links': fallbackResult = analyzeLinks(pageResult.pageData); break;
            case 'usability': fallbackResult = analyzeUsability(pageResult.pageData); break;
            default: fallbackResult = { score: 50, grade: 'D', message: 'No data', checks: [] };
          }
          return { ...fallbackResult, sourcePages: [fallbackUrl] };
        }
        return { score: 50, grade: 'D', message: 'No pages analyzed for this section', checks: [], sourcePages: [] };
      }
      
      // Calculate average score
      const avgScore = Math.round(sectionResults.reduce((sum, r) => sum + r.score, 0) / sectionResults.length);
      
      // Merge checks with source page information
      const mergedChecks: Check[] = [];
      const checkMap = new Map<string, Check & { sourcePages: string[] }>();
      
      sectionResults.forEach((result, idx) => {
        const pageUrl = sourcePages[idx];
        result.checks.forEach(check => {
          const existing = checkMap.get(check.id);
          if (!existing) {
            checkMap.set(check.id, { ...check, sourcePages: [pageUrl] });
          } else {
            // Merge: worst status wins
            if (check.status === 'fail' || existing.status === 'fail') {
              existing.status = 'fail';
            } else if (check.status === 'warning' || existing.status === 'warning') {
              existing.status = 'warning';
            }
            existing.sourcePages.push(pageUrl);
            // Average the scores
            existing.score = Math.round((existing.score + check.score) / 2);
          }
        });
      });
      
      return {
        score: avgScore,
        grade: calculateGrade(avgScore),
        message: `Based on ${sourcePages.length} page(s)`,
        checks: Array.from(checkMap.values()),
        sourcePages,
      };
    };

    const localSeo = aggregateSection('localSeo');
    const seo = aggregateSection('seo');
    const content = aggregateSection('content');
    const performance = aggregateSection('performance');
    const eeat = aggregateSection('eeat');
    const social = aggregateSection('social');
    const technology = aggregateSection('technology');
    const links = aggregateSection('links');
    const usability = aggregateSection('usability');

    // Calculate overall score
    const overallScore = Math.round(
      (localSeo.score * CATEGORY_WEIGHTS.localSeo +
        seo.score * CATEGORY_WEIGHTS.seo +
        links.score * CATEGORY_WEIGHTS.links +
        usability.score * CATEGORY_WEIGHTS.usability +
        performance.score * CATEGORY_WEIGHTS.performance +
        social.score * CATEGORY_WEIGHTS.social +
        technology.score * CATEGORY_WEIGHTS.technology +
        content.score * CATEGORY_WEIGHTS.content +
        eeat.score * CATEGORY_WEIGHTS.eeat) /
        100
    );

    // Generate recommendations with source pages
    const recommendations: SmartAuditOutput['recommendations'] = [];
    let recId = 0;
    
    const allCategories = [
      { key: 'localSeo', name: 'Local SEO', result: localSeo },
      { key: 'seo', name: 'On-Page SEO', result: seo },
      { key: 'content', name: 'Content Quality', result: content },
      { key: 'performance', name: 'Performance', result: performance },
      { key: 'eeat', name: 'E-E-A-T', result: eeat },
      { key: 'social', name: 'Social', result: social },
      { key: 'technology', name: 'Technology', result: technology },
      { key: 'links', name: 'Links', result: links },
      { key: 'usability', name: 'Usability', result: usability },
    ];

    for (const { key, name, result } of allCategories) {
      for (const check of result.checks) {
        if (check.recommendation && (check.status === 'fail' || check.status === 'warning')) {
          recommendations.push({
            id: `rec_${recId++}`,
            title: check.recommendation,
            description: check.message,
            category: name,
            priority: check.status === 'fail' ? 'HIGH' : check.score < 50 ? 'MEDIUM' : 'LOW',
            checkId: check.id,
            sourcePages: (check as any).sourcePages || result.sourcePages,
          });
        }
      }
    }

    // Sort by priority
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    metadata.set("status", {
      progress: 100,
      label: "Audit complete!",
      pagesTotal: selectedUrls.length,
      pagesAnalyzed,
    } as any);

    return {
      overallScore,
      overallGrade: calculateGrade(overallScore),
      localSeo,
      seo,
      links,
      usability,
      performance,
      social,
      technology,
      content,
      eeat,
      recommendations,
      pageClassifications,
      pagesAnalyzed,
      pagesFailed,
      auditMapping,
    };
  },
});
